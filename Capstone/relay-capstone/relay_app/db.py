import sqlite3
import json
import os
from pathlib import Path
from datetime import datetime, timezone

DB_PATH = Path(os.getenv("RELAY_DB_PATH", Path(__file__).resolve().parents[1] / "relay.db"))

def get_connection():
    conn = sqlite3.connect(str(DB_PATH), timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL, -- 'draft' or 'published'
            trigger_json TEXT NOT NULL,
            entry TEXT NOT NULL,
            limits_json TEXT NOT NULL,
            nodes_json TEXT NOT NULL,
            definition_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS runs (
            run_id TEXT PRIMARY KEY,
            workflow_id TEXT NOT NULL,
            status TEXT NOT NULL, -- 'queued', 'running', 'waiting_approval', 'succeeded', 'failed', 'cancelled'
            trigger_type TEXT NOT NULL,
            trigger_payload_json TEXT NOT NULL,
            definition_snapshot_json TEXT NOT NULL,
            current_node_id TEXT,
            error_message TEXT,
            stop_reason TEXT,
            started_at TEXT,
            finished_at TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS steps (
            step_id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            node_id TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL, -- 'succeeded', 'failed', 'waiting', 'skipped'
            attempt INTEGER NOT NULL DEFAULT 1,
            input_json TEXT,
            output_json TEXT,
            error TEXT,
            token_usage_json TEXT,
            duration_ms INTEGER,
            started_at TEXT,
            finished_at TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (run_id) REFERENCES runs(run_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS approvals (
            approval_id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            node_id TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL, -- 'pending', 'approved', 'rejected'
            decided_by TEXT,
            decided_at TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (run_id) REFERENCES runs(run_id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_runs_workflow ON runs(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
        CREATE INDEX IF NOT EXISTS idx_steps_run ON steps(run_id);
        CREATE INDEX IF NOT EXISTS idx_approvals_run ON approvals(run_id);
        CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
        """)
