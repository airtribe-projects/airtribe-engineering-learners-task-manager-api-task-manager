import asyncio
import json
import logging
import time
import uuid
from datetime import datetime, timezone

from relay_app.db import get_connection
from relay_app.engine import execute_node
from relay_app.templates import resolve_value

logger = logging.getLogger("relay.worker")

class WorkflowWorker:
    def __init__(self):
        self.running = False
        self._task = None

    def start(self):
        self.running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("Relay background worker started.")

    def stop(self):
        self.running = False
        if self._task:
            self._task.cancel()

    async def _run_loop(self):
        # Crash recovery on startup: resume interrupted runs
        await self.recover_in_flight_runs()
        
        while self.running:
            try:
                processed = await self.process_next_run()
                if not processed:
                    await asyncio.sleep(0.5)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in worker loop: {e}", exc_info=True)
                await asyncio.sleep(1.0)

    async def recover_in_flight_runs(self):
        """
        Recovers runs that were in 'running' status when the worker process stopped.
        Resumes them from the last completed step.
        """
        with get_connection() as conn:
            rows = conn.execute(
                "SELECT run_id FROM runs WHERE status = 'running' ORDER BY created_at ASC"
            ).fetchall()
            
        for row in rows:
            run_id = row["run_id"]
            logger.info(f"Resuming interrupted run '{run_id}' from last completed step...")
            await asyncio.to_thread(self._execute_run_durable, run_id)

    async def process_next_run(self) -> bool:
        run_id = None
        with get_connection() as conn:
            # Pick next queued run
            row = conn.execute(
                "SELECT run_id FROM runs WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1"
            ).fetchone()
            if row:
                run_id = row["run_id"]
                conn.execute(
                    "UPDATE runs SET status = 'running', started_at = ? WHERE run_id = ?",
                    (datetime.now(timezone.utc).isoformat(), run_id)
                )
                conn.commit()
                
        if run_id:
            await asyncio.to_thread(self._execute_run_durable, run_id)
            return True
        return False

    def _execute_run_durable(self, run_id: str):
        with get_connection() as conn:
            run = conn.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,)).fetchone()
            if not run or run["status"] in ("succeeded", "failed", "cancelled"):
                return

            defn = json.loads(run["definition_snapshot_json"])
            trigger_payload = json.loads(run["trigger_payload_json"])
            nodes_by_id = {n["id"]: n for n in defn.get("nodes", [])}
            limits = defn.get("limits", {}) or {}
            max_steps = limits.get("max_steps", 50)

            # Load past steps to rebuild context and find where to resume
            past_steps = conn.execute(
                "SELECT * FROM steps WHERE run_id = ? ORDER BY started_at ASC",
                (run_id,)
            ).fetchall()

        # Reconstruct execution context
        context = {
            "trigger": {
                "body": trigger_payload.get("input", trigger_payload)
            },
            "nodes": {}
        }
        
        executed_node_ids = []
        last_node_id = None
        last_next_id = None

        for s in past_steps:
            if s["status"] == "succeeded" and s["output_json"]:
                out = json.loads(s["output_json"])
                context["nodes"][s["node_id"]] = {"output": out}
                executed_node_ids.append(s["node_id"])
                last_node_id = s["node_id"]
                node_spec = nodes_by_id.get(s["node_id"])
                if node_spec:
                    if node_spec["type"] == "condition":
                        last_next_id = node_spec.get("on_true") if out.get("result") else node_spec.get("on_false")
                    else:
                        last_next_id = node_spec.get("next")

        step_count = len(executed_node_ids)

        # Check if there was an approval step in waiting state
        waiting_appr_step = next((s for s in past_steps if s["type"] == "approval" and s["status"] == "waiting"), None)
        if waiting_appr_step:
            appr_node_id = waiting_appr_step["node_id"]
            with get_connection() as conn:
                appr_rec = conn.execute(
                    "SELECT * FROM approvals WHERE run_id = ? AND node_id = ?",
                    (run_id, appr_node_id)
                ).fetchone()

            if appr_rec and appr_rec["status"] == "approved":
                # Mark step succeeded
                now_iso = datetime.now(timezone.utc).isoformat()
                with get_connection() as conn:
                    conn.execute("""
                        UPDATE steps SET status = 'succeeded', output_json = ?, finished_at = ?
                        WHERE step_id = ?
                    """, (
                        json.dumps({"decision": "approved", "decided_by": appr_rec["decided_by"]}),
                        now_iso,
                        waiting_appr_step["step_id"]
                    ))
                    conn.commit()

                context["nodes"][appr_node_id] = {"output": {"decision": "approved", "decided_by": appr_rec["decided_by"]}}
                executed_node_ids.append(appr_node_id)
                appr_node_spec = nodes_by_id.get(appr_node_id)
                curr_node_id = appr_node_spec.get("next") if appr_node_spec else None
            elif appr_rec and appr_rec["status"] == "rejected":
                with get_connection() as conn:
                    conn.execute("UPDATE runs SET status = 'cancelled', finished_at = ? WHERE run_id = ?",
                                 (datetime.now(timezone.utc).isoformat(), run_id))
                    conn.commit()
                return
            else:
                # Still pending
                with get_connection() as conn:
                    conn.execute("UPDATE runs SET status = 'waiting_approval' WHERE run_id = ?", (run_id,))
                    conn.commit()
                return
        else:
            if last_next_id is not None:
                curr_node_id = last_next_id
            elif executed_node_ids:
                curr_node_id = None # finished
            else:
                curr_node_id = defn.get("entry")

        # Main execution loop
        while curr_node_id:
            # Check cooperative cancellation
            with get_connection() as conn:
                check_run = conn.execute("SELECT status FROM runs WHERE run_id = ?", (run_id,)).fetchone()
                if check_run and check_run["status"] == "cancelled":
                    return

            node = nodes_by_id.get(curr_node_id)
            if not node:
                self._fail_run(run_id, f"Referenced node '{curr_node_id}' not found in definition snapshot")
                return

            # Check step cap
            step_count += 1
            if step_count > max_steps:
                cap_reason = f"Run exceeded maximum step cap of {max_steps} steps (step limit exceeded / max_steps cap)"
                self._fail_run(run_id, cap_reason, stop_reason=cap_reason)
                return

            ntype = node["type"]
            nid = node["id"]

            # Handle approval node
            if ntype == "approval":
                with get_connection() as conn:
                    existing_appr = conn.execute(
                        "SELECT * FROM approvals WHERE run_id = ? AND node_id = ?",
                        (run_id, nid)
                    ).fetchone()
                    
                    if existing_appr and existing_appr["status"] == "approved":
                        # already approved in earlier resume
                        context["nodes"][nid] = {"output": {"decision": "approved"}}
                        curr_node_id = node.get("next")
                        continue
                    
                    appr_id = existing_appr["approval_id"] if existing_appr else f"apr_{uuid.uuid4().hex[:8]}"
                    msg = resolve_value(node.get("params", {}).get("message", "Approval required"), context)
                    
                    if not existing_appr:
                        conn.execute("""
                            INSERT INTO approvals (approval_id, run_id, node_id, message, status, created_at)
                            VALUES (?, ?, ?, ?, 'pending', ?)
                        """, (appr_id, run_id, nid, str(msg), datetime.now(timezone.utc).isoformat()))

                    # Insert waiting step in trace
                    step_id = f"step_{uuid.uuid4().hex[:8]}"
                    conn.execute("""
                        INSERT INTO steps (step_id, run_id, node_id, type, status, input_json, started_at, created_at)
                        VALUES (?, ?, ?, 'approval', 'waiting', ?, ?, ?)
                    """, (
                        step_id, run_id, nid,
                        json.dumps({"message": str(msg)}),
                        datetime.now(timezone.utc).isoformat(),
                        datetime.now(timezone.utc).isoformat()
                    ))
                    
                    conn.execute("""
                        UPDATE runs SET status = 'waiting_approval', current_node_id = ? WHERE run_id = ?
                    """, (nid, run_id))
                    conn.commit()
                return # Worker pauses run here until approval API is called

            # Execute normal node with retry & timing
            step_id = f"step_{uuid.uuid4().hex[:8]}"
            start_iso = datetime.now(timezone.utc).isoformat()
            t0 = time.monotonic()
            
            resolved_input = resolve_value(node.get("params", {}), context)
            max_attempts = 2
            attempt = 1
            output = None
            token_usage = None
            next_id = None
            exec_error = None

            while attempt <= max_attempts:
                try:
                    output, token_usage, next_id = execute_node(node, context, run_id)
                    exec_error = None
                    break
                except Exception as e:
                    exec_error = str(e)
                    if attempt < max_attempts and ntype != "approval":
                        time.sleep(1.0)
                    attempt += 1

            duration_ms = round((time.monotonic() - t0) * 1000)
            fin_iso = datetime.now(timezone.utc).isoformat()

            with get_connection() as conn:
                if exec_error:
                    conn.execute("""
                        INSERT INTO steps (step_id, run_id, node_id, type, status, attempt, input_json, error, duration_ms, started_at, finished_at, created_at)
                        VALUES (?, ?, ?, ?, 'failed', ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        step_id, run_id, nid, ntype, attempt,
                        json.dumps(resolved_input, default=str),
                        exec_error, duration_ms, start_iso, fin_iso, fin_iso
                    ))
                    conn.commit()
                    self._fail_run(run_id, f"Node '{nid}' failed: {exec_error}")
                    return
                else:
                    conn.execute("""
                        INSERT INTO steps (step_id, run_id, node_id, type, status, attempt, input_json, output_json, token_usage_json, duration_ms, started_at, finished_at, created_at)
                        VALUES (?, ?, ?, ?, 'succeeded', ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        step_id, run_id, nid, ntype, attempt,
                        json.dumps(resolved_input, default=str),
                        json.dumps(output, default=str),
                        json.dumps(token_usage) if token_usage else None,
                        duration_ms, start_iso, fin_iso, fin_iso
                    ))
                    conn.commit()

            context["nodes"][nid] = {"output": output}
            curr_node_id = next_id

        # Workflow reached end
        with get_connection() as conn:
            conn.execute(
                "UPDATE runs SET status = 'succeeded', finished_at = ? WHERE run_id = ?",
                (datetime.now(timezone.utc).isoformat(), run_id)
            )
            conn.commit()

    def _fail_run(self, run_id: str, error_msg: str, stop_reason: str | None = None):
        with get_connection() as conn:
            conn.execute(
                "UPDATE runs SET status = 'failed', error_message = ?, stop_reason = ?, finished_at = ? WHERE run_id = ?",
                (error_msg, stop_reason or error_msg, datetime.now(timezone.utc).isoformat(), run_id)
            )
            conn.commit()
