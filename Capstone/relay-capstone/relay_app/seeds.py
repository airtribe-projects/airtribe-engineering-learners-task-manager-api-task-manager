import json
import logging
from pathlib import Path
from datetime import datetime, timezone
from relay_app.db import get_connection

logger = logging.getLogger("relay.seeds")

SEEDS_PATH = Path(__file__).resolve().parents[1] / "data" / "seed_workflows.json"

def seed_workflows_if_needed():
    if not SEEDS_PATH.exists():
        return
    with open(SEEDS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    workflows = data.get("workflows", [])
    now = datetime.now(timezone.utc).isoformat()
    
    with get_connection() as conn:
        for wf in workflows:
            wid = wf["id"]
            name = wf.get("name", wid)
            desc = wf.get("description", "")
            trigger = json.dumps(wf.get("trigger", {}))
            entry = wf.get("entry", "")
            limits = json.dumps(wf.get("limits", {}))
            nodes = json.dumps(wf.get("nodes", []))
            full_def = json.dumps(wf)
            
            conn.execute("""
                INSERT INTO workflows (id, name, description, status, trigger_json, entry, limits_json, nodes_json, definition_json, created_at, updated_at)
                VALUES (?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    status = 'published',
                    trigger_json = excluded.trigger_json,
                    entry = excluded.entry,
                    limits_json = excluded.limits_json,
                    nodes_json = excluded.nodes_json,
                    definition_json = excluded.definition_json,
                    updated_at = excluded.updated_at
            """, (wid, name, desc, trigger, entry, limits, nodes, full_def, now, now))
        conn.commit()
    logger.info(f"Seeded {len(workflows)} workflows with status 'published'.")
