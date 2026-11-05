import json
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from relay_app.db import get_connection, init_db
from relay_app.nl_compiler import compile_nl_workflow
from relay_app.seeds import seed_workflows_if_needed
from relay_app.validator import validate_workflow_definition
from relay_app.worker import WorkflowWorker

worker = WorkflowWorker()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_workflows_if_needed()
    worker.start()
    yield
    worker.stop()

app = FastAPI(title="Relay: AI Workflow Orchestrator", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Workflows API ---

@app.get("/workflows")
def list_workflows():
    with get_connection() as conn:
        rows = conn.execute("SELECT id, name, description, status, created_at, updated_at FROM workflows ORDER BY created_at ASC").fetchall()
    return [{"id": r["id"], "name": r["name"], "description": r["description"], "status": r["status"]} for r in rows]

@app.post("/workflows", status_code=status.HTTP_201_CREATED)
async def create_workflow(request: Request):
    body = await request.json()
    valid, err, code = validate_workflow_definition(body)
    if not valid:
        return JSONResponse(
            status_code=400,
            content={"error": {"message": err, "code": code or "validation_error"}}
        )
    
    wid = body["id"]
    name = body.get("name", wid)
    desc = body.get("description", "")
    trigger = json.dumps(body.get("trigger", {}))
    entry = body.get("entry")
    limits = json.dumps(body.get("limits", {}))
    nodes = json.dumps(body.get("nodes", []))
    defn = json.dumps(body)
    now = datetime.now(timezone.utc).isoformat()
    
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO workflows (id, name, description, status, trigger_json, entry, limits_json, nodes_json, definition_json, created_at, updated_at)
            VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                trigger_json = excluded.trigger_json,
                entry = excluded.entry,
                limits_json = excluded.limits_json,
                nodes_json = excluded.nodes_json,
                definition_json = excluded.definition_json,
                updated_at = excluded.updated_at
        """, (wid, name, desc, trigger, entry, limits, nodes, defn, now, now))
        conn.commit()
        
    return {"id": wid, "status": "draft"}

@app.get("/workflows/{workflow_id}")
def get_workflow(workflow_id: str):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail={"error": {"message": f"Workflow '{workflow_id}' not found", "code": "not_found"}})
    
    defn = json.loads(row["definition_json"])
    defn["status"] = row["status"]
    return defn

@app.post("/workflows/{workflow_id}/publish")
def publish_workflow(workflow_id: str):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,)).fetchone()
        if not row:
            return JSONResponse(
                status_code=404,
                content={"error": {"message": f"Workflow '{workflow_id}' not found", "code": "not_found"}}
            )
        
        defn = json.loads(row["definition_json"])
        valid, err, code = validate_workflow_definition(defn)
        if not valid:
            return JSONResponse(
                status_code=400,
                content={"error": {"message": err, "code": code or "invalid_publish"}}
            )
            
        now = datetime.now(timezone.utc).isoformat()
        conn.execute("UPDATE workflows SET status = 'published', updated_at = ? WHERE id = ?", (now, workflow_id))
        conn.commit()
        
    return {"id": workflow_id, "status": "published"}

# --- Triggers ---

@app.post("/workflows/{workflow_id}/trigger")
async def manual_trigger(workflow_id: str, request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    return _create_run(workflow_id, "manual", body)

@app.post("/hooks/{workflow_id}")
async def webhook_trigger(workflow_id: str, request: Request, x_relay_secret: str | None = Header(None, alias="X-Relay-Secret")):
    with get_connection() as conn:
        wf = conn.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,)).fetchone()
        
    if not wf:
        return JSONResponse(
            status_code=404,
            content={"error": {"message": f"Workflow '{workflow_id}' not found", "code": "not_found"}}
        )
        
    trigger_spec = json.loads(wf["trigger_json"])
    expected_secret = trigger_spec.get("secret")
    
    if not x_relay_secret or x_relay_secret != expected_secret:
        return JSONResponse(
            status_code=401,
            content={"error": {"message": "Invalid or missing X-Relay-Secret header", "code": "unauthorized"}}
        )
        
    try:
        payload = await request.json()
    except Exception:
        payload = {}
        
    return _create_run(workflow_id, "webhook", {"input": payload})

def _create_run(workflow_id: str, trigger_type: str, payload: dict):
    with get_connection() as conn:
        wf = conn.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,)).fetchone()
        if not wf:
            return JSONResponse(
                status_code=404,
                content={"error": {"message": f"Workflow '{workflow_id}' not found", "code": "not_found"}}
            )
            
        # Snapshot definition
        defn = json.loads(wf["definition_json"])
        run_id = f"run_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc).isoformat()
        
        conn.execute("""
            INSERT INTO runs (run_id, workflow_id, status, trigger_type, trigger_payload_json, definition_snapshot_json, created_at)
            VALUES (?, ?, 'queued', ?, ?, ?, ?)
        """, (run_id, workflow_id, trigger_type, json.dumps(payload), json.dumps(defn), now))
        conn.commit()
        
    return JSONResponse(status_code=202, content={"run_id": run_id, "id": run_id, "status": "queued"})

# --- Runs & Traces ---

@app.get("/runs")
def list_runs(workflow_id: str | None = None):
    with get_connection() as conn:
        if workflow_id:
            rows = conn.execute("SELECT * FROM runs WHERE workflow_id = ? ORDER BY created_at DESC", (workflow_id,)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM runs ORDER BY created_at DESC LIMIT 50").fetchall()
            
    res = []
    for r in rows:
        res.append({
            "run_id": r["run_id"],
            "workflow_id": r["workflow_id"],
            "status": r["status"],
            "started_at": r["started_at"],
            "finished_at": r["finished_at"],
            "stop_reason": r["stop_reason"]
        })
    return res

@app.get("/runs/{run_id}")
def get_run(run_id: str):
    with get_connection() as conn:
        run = conn.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,)).fetchone()
        if not run:
            return JSONResponse(
                status_code=404,
                content={"error": {"message": f"Run '{run_id}' not found", "code": "not_found"}}
            )
            
        step_rows = conn.execute("SELECT * FROM steps WHERE run_id = ? ORDER BY started_at ASC", (run_id,)).fetchall()
        
    steps = []
    for s in step_rows:
        step_obj = {
            "node_id": s["node_id"],
            "type": s["type"],
            "status": s["status"],
            "attempt": s["attempt"],
            "input": json.loads(s["input_json"]) if s["input_json"] else None,
            "output": json.loads(s["output_json"]) if s["output_json"] else None,
            "error": s["error"],
            "token_usage": json.loads(s["token_usage_json"]) if s["token_usage_json"] else None,
            "duration_ms": s["duration_ms"],
            "started_at": s["started_at"]
        }
        steps.append(step_obj)
        
    return {
        "run_id": run["run_id"],
        "id": run["run_id"],
        "workflow_id": run["workflow_id"],
        "status": run["status"],
        "started_at": run["started_at"],
        "finished_at": run["finished_at"],
        "error_message": run["error_message"],
        "stop_reason": run["stop_reason"],
        "steps": steps
    }

@app.post("/runs/{run_id}/cancel")
def cancel_run(run_id: str):
    with get_connection() as conn:
        run = conn.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,)).fetchone()
        if not run:
            return JSONResponse(status_code=404, content={"error": {"message": "Run not found", "code": "not_found"}})
            
        if run["status"] in ("succeeded", "failed", "cancelled"):
            return JSONResponse(status_code=409, content={"error": {"message": f"Cannot cancel terminal run in status {run['status']}", "code": "conflict"}})
            
        now = datetime.now(timezone.utc).isoformat()
        conn.execute("UPDATE runs SET status = 'cancelled', finished_at = ? WHERE run_id = ?", (now, run_id))
        # Also close any pending approvals
        conn.execute("UPDATE approvals SET status = 'cancelled' WHERE run_id = ? AND status = 'pending'", (run_id,))
        conn.commit()
        
    return {"run_id": run_id, "status": "cancelled"}

# --- Approvals ---

@app.get("/approvals")
def list_approvals(status: str | None = None):
    with get_connection() as conn:
        if status:
            rows = conn.execute("SELECT * FROM approvals WHERE status = ? ORDER BY created_at DESC", (status,)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM approvals ORDER BY created_at DESC").fetchall()
            
    return [{"id": r["approval_id"], "approval_id": r["approval_id"], "run_id": r["run_id"], "node_id": r["node_id"], "message": r["message"], "status": r["status"]} for r in rows]

@app.post("/approvals/{approval_id}/approve")
def approve_action(approval_id: str):
    with get_connection() as conn:
        appr = conn.execute("SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)).fetchone()
        if not appr:
            return JSONResponse(status_code=404, content={"error": {"message": "Approval not found", "code": "not_found"}})
        if appr["status"] != "pending":
            return JSONResponse(status_code=409, content={"error": {"message": f"Approval is already {appr['status']}", "code": "conflict"}})
            
        now = datetime.now(timezone.utc).isoformat()
        conn.execute("UPDATE approvals SET status = 'approved', decided_by = 'admin', decided_at = ? WHERE approval_id = ?", (now, approval_id))
        conn.execute("UPDATE runs SET status = 'queued' WHERE run_id = ?", (appr["run_id"],))
        conn.commit()
        
    return {"id": approval_id, "status": "approved"}

@app.post("/approvals/{approval_id}/reject")
def reject_action(approval_id: str):
    with get_connection() as conn:
        appr = conn.execute("SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)).fetchone()
        if not appr:
            return JSONResponse(status_code=404, content={"error": {"message": "Approval not found", "code": "not_found"}})
        if appr["status"] != "pending":
            return JSONResponse(status_code=409, content={"error": {"message": f"Approval is already {appr['status']}", "code": "conflict"}})
            
        now = datetime.now(timezone.utc).isoformat()
        conn.execute("UPDATE approvals SET status = 'rejected', decided_by = 'admin', decided_at = ? WHERE approval_id = ?", (now, approval_id))
        conn.execute("UPDATE runs SET status = 'cancelled', finished_at = ? WHERE run_id = ?", (now, appr["run_id"]))
        conn.commit()
        
    return {"id": approval_id, "status": "rejected"}

# --- Good To Have: NL Compiler ---

@app.post("/workflows/compile")
async def compile_workflow(request: Request):
    body = await request.json()
    description = body.get("description", "")
    res = compile_nl_workflow(description)
    if "refusal" in res:
        return JSONResponse(status_code=422, content=res)
    return res

# --- Ops Console ---

@app.get("/console", response_class=HTMLResponse)
@app.get("/", response_class=HTMLResponse)
def get_console():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relay: AI Workflow Orchestrator Console</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-slate-900 text-slate-100 min-h-screen font-sans">
        <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                    <i class="fa-solid fa-diagram-project"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        Relay <span class="text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full font-mono">v1.0 Durable</span>
                    </h1>
                    <p class="text-xs text-slate-400">AI Workflow Orchestrator & Durable Step Engine</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="refreshAll()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition flex items-center gap-2">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
            </div>
        </header>

        <main class="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left: Workflows & Approvals -->
            <div class="space-y-6">
                <!-- Approvals Card -->
                <div class="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-semibold flex items-center gap-2 text-amber-400">
                            <i class="fa-solid fa-shield-halved"></i> Pending Approvals
                        </h2>
                        <span id="pending-count" class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">0</span>
                    </div>
                    <div id="approvals-list" class="space-y-3">
                        <p class="text-xs text-slate-500 italic">No approvals pending</p>
                    </div>
                </div>

                <!-- Workflows Card -->
                <div class="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-semibold flex items-center gap-2 text-white">
                            <i class="fa-solid fa-sitemap"></i> Workflows
                        </h2>
                        <span id="wf-count" class="text-xs text-slate-400 font-mono">0</span>
                    </div>
                    <div id="workflows-list" class="space-y-2">
                        <p class="text-xs text-slate-500">Loading workflows...</p>
                    </div>
                </div>
            </div>

            <!-- Right: Runs History & Trace Viewer -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Runs List -->
                <div class="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-semibold flex items-center gap-2 text-white">
                            <i class="fa-solid fa-list-check"></i> Recent Execution Runs
                        </h2>
                        <span class="text-xs text-slate-400">Auto-refreshing trace</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="text-xs text-slate-400 uppercase border-b border-slate-700/60 bg-slate-900/40">
                                <tr>
                                    <th class="py-2.5 px-3">Run ID</th>
                                    <th class="py-2.5 px-3">Workflow</th>
                                    <th class="py-2.5 px-3">Status</th>
                                    <th class="py-2.5 px-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="runs-tbody" class="divide-y divide-slate-700/40">
                                <tr><td colspan="4" class="py-4 text-center text-slate-500 text-xs">No runs recorded yet</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Trace Inspector Modal / Card -->
                <div id="trace-card" class="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-semibold flex items-center gap-2 text-indigo-400">
                            <i class="fa-solid fa-clock-rotate-left"></i> Step Trace Inspector
                        </h2>
                        <span id="inspecting-run-id" class="text-xs font-mono text-slate-400">Select a run above</span>
                    </div>
                    <div id="trace-steps" class="space-y-3">
                        <p class="text-xs text-slate-500 italic">Click "View Trace" on any run to inspect inputs, outputs, token metrics, and attempts.</p>
                    </div>
                </div>
            </div>
        </main>

        <script>
            async function refreshAll() {
                loadApprovals();
                loadWorkflows();
                loadRuns();
            }

            async function loadApprovals() {
                try {
                    const res = await fetch('/approvals?status=pending');
                    const approvals = await res.json();
                    const container = document.getElementById('approvals-list');
                    document.getElementById('pending-count').innerText = approvals.length;
                    
                    if (approvals.length === 0) {
                        container.innerHTML = '<p class="text-xs text-slate-500 italic">No approvals pending</p>';
                        return;
                    }

                    container.innerHTML = approvals.map(a => `
                        <div class="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
                            <div class="font-medium text-amber-200">${a.message}</div>
                            <div class="font-mono text-slate-400 text-[10px]">Run: ${a.run_id} | Node: ${a.node_id}</div>
                            <div class="flex gap-2 pt-1">
                                <button onclick="decide('${a.id}', 'approve')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition">Approve</button>
                                <button onclick="decide('${a.id}', 'reject')" class="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition">Reject</button>
                            </div>
                        </div>
                    `).join('');
                } catch(e) { console.error(e); }
            }

            async function decide(id, action) {
                await fetch(`/approvals/${id}/${action}`, { method: 'POST' });
                refreshAll();
            }

            async function loadWorkflows() {
                try {
                    const res = await fetch('/workflows');
                    const wfs = await res.json();
                    document.getElementById('wf-count').innerText = wfs.length;
                    const container = document.getElementById('workflows-list');
                    container.innerHTML = wfs.map(w => `
                        <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-center justify-between text-xs">
                            <div>
                                <div class="font-medium text-slate-200">${w.name || w.id}</div>
                                <div class="text-[10px] text-slate-400 font-mono">${w.id}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono ${w.status === 'published' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-slate-700 text-slate-300'}">${w.status}</span>
                                <button onclick="triggerWf('${w.id}')" class="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition">Run</button>
                            </div>
                        </div>
                    `).join('');
                } catch(e) { console.error(e); }
            }

            async function triggerWf(id) {
                const res = await fetch(`/workflows/${id}/trigger`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({input: {}})
                });
                const data = await res.json();
                loadRuns();
                if (data.run_id) inspectRun(data.run_id);
            }

            async function loadRuns() {
                try {
                    const res = await fetch('/runs');
                    const runs = await res.json();
                    const tbody = document.getElementById('runs-tbody');
                    if (runs.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-slate-500 text-xs">No runs recorded yet</td></tr>';
                        return;
                    }
                    tbody.innerHTML = runs.map(r => {
                        let badge = 'bg-slate-700 text-slate-300';
                        if (r.status === 'succeeded') badge = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
                        if (r.status === 'failed') badge = 'bg-rose-950 text-rose-400 border border-rose-800';
                        if (r.status === 'waiting_approval') badge = 'bg-amber-950 text-amber-400 border border-amber-800';
                        if (r.status === 'running') badge = 'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse';

                        return `
                            <tr class="hover:bg-slate-800/40 transition">
                                <td class="py-2.5 px-3 font-mono text-xs text-indigo-300">${r.run_id}</td>
                                <td class="py-2.5 px-3 font-mono text-xs text-slate-300">${r.workflow_id}</td>
                                <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${badge}">${r.status}</span></td>
                                <td class="py-2.5 px-3">
                                    <button onclick="inspectRun('${r.run_id}')" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View Trace</button>
                                </td>
                            </tr>
                        `;
                    }).join('');
                } catch(e) { console.error(e); }
            }

            async function inspectRun(runId) {
                document.getElementById('inspecting-run-id').innerText = runId;
                const res = await fetch(`/runs/${runId}`);
                const run = await res.json();
                const container = document.getElementById('trace-steps');
                
                if (!run.steps || run.steps.length === 0) {
                    container.innerHTML = `<p class="text-xs text-slate-500 italic">Run is ${run.status}. No steps recorded yet.</p>`;
                    return;
                }

                container.innerHTML = run.steps.map((s, idx) => `
                    <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-400">${idx+1}</span>
                                <span class="font-semibold text-slate-200">${s.node_id}</span>
                                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">${s.type}</span>
                            </div>
                            <span class="text-[10px] font-mono ${s.status === 'succeeded' ? 'text-emerald-400' : (s.status === 'failed' ? 'text-rose-400' : 'text-amber-400')}">${s.status} (${s.duration_ms || 0}ms)</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded">
                            <div><span class="text-slate-500">Input:</span> <pre class="text-slate-300 overflow-x-auto">${JSON.stringify(s.input, null, 1)}</pre></div>
                            <div><span class="text-slate-500">Output:</span> <pre class="text-slate-300 overflow-x-auto">${JSON.stringify(s.output, null, 1)}</pre></div>
                        </div>
                    </div>
                `).join('');
            }

            setInterval(refreshAll, 3000);
            refreshAll();
        </script>
    </body>
    </html>
    """
