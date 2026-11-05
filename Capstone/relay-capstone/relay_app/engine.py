import json
import time
import uuid
import os
import httpx
from datetime import datetime, timezone
from typing import Any

from relay_app.db import get_connection
from relay_app.templates import resolve_value
from relay_app.ai_adapter import execute_ai_step

MOCK_WORLD_URL = os.getenv("MOCK_WORLD_URL", "http://localhost:9210").rstrip("/")

def execute_node(node: dict, context: dict, run_id: str) -> tuple[dict, dict | None, str | None]:
    """
    Executes a node, returning (output, token_usage, next_node_id).
    Raises Exception if execution fails or approval gate is violated.
    """
    ntype = node.get("type")
    nid = node.get("id")
    params = resolve_value(node.get("params", {}), context)
    
    # 1. Approval Gate check for sensitive nodes
    if ntype == "order_action" or node.get("requires_approval", False):
        with get_connection() as conn:
            row = conn.execute(
                "SELECT 1 FROM approvals WHERE run_id = ? AND status = 'approved'",
                (run_id,)
            ).fetchone()
            if not row:
                raise PermissionError(
                    f"Sensitive node '{nid}' requires prior approval, but no approved record exists for this run."
                )

    idempotency_key = f"{run_id}:{nid}"
    timeout = 10.0

    if ntype == "condition":
        left = params.get("left")
        op = params.get("op")
        right = params.get("right")
        res = _evaluate_condition(left, op, right)
        next_id = node.get("on_true") if res else node.get("on_false")
        return {"result": res}, None, next_id

    elif ntype == "delay":
        secs = float(params.get("seconds", 0))
        if secs > 0:
            time.sleep(secs)
        return {}, None, node.get("next")

    elif ntype == "notify":
        channel = params.get("channel")
        to = params.get("to")
        subject = params.get("subject")
        message = params.get("message")
        
        headers = {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotency_key
        }
        
        if channel == "chat":
            url = f"{MOCK_WORLD_URL}/chat/message"
            payload = {"channel": to, "message": message}
        else: # email
            url = f"{MOCK_WORLD_URL}/email/send"
            payload = {"to": to, "subject": subject, "message": message}
            
        with httpx.Client(timeout=timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code >= 400:
                raise RuntimeError(f"Notify endpoint failed with status {resp.status_code}: {resp.text}")
            data = resp.json()
            return {"delivered": True, "notification_id": data.get("notification_id", str(uuid.uuid4()))}, None, node.get("next")

    elif ntype == "order_action":
        action = params.get("action")
        order_id = params.get("order_id")
        amount_usd = params.get("amount_usd")
        
        headers = {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotency_key
        }
        
        if action == "refund":
            url = f"{MOCK_WORLD_URL}/orders/{order_id}/refund"
            payload = {}
            if amount_usd is not None and str(amount_usd).strip() != "":
                payload["amount_usd"] = float(amount_usd)
        elif action == "replacement":
            url = f"{MOCK_WORLD_URL}/orders/{order_id}/replacement"
            payload = {}
        else:
            raise ValueError(f"Unknown order action '{action}'")
            
        with httpx.Client(timeout=timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code >= 400:
                raise RuntimeError(f"Order action failed with status {resp.status_code}: {resp.text}")
            return resp.json(), None, node.get("next")

    elif ntype == "http_request":
        method = params.get("method", "GET").upper()
        url = params.get("url")
        req_headers = params.get("headers") or {}
        req_body = params.get("body")
        
        headers = dict(req_headers)
        if method in ("POST", "PUT", "DELETE", "PATCH"):
            headers["Idempotency-Key"] = idempotency_key
            
        with httpx.Client(timeout=timeout) as client:
            resp = client.request(method, url, headers=headers, json=req_body if req_body else None)
            try:
                resp_body = resp.json()
            except Exception:
                resp_body = resp.text
            return {"status": resp.status_code, "body": resp_body}, None, node.get("next")

    elif ntype == "ai":
        prompt = params.get("prompt", "")
        schema = params.get("output_schema", {})
        output, token_usage = execute_ai_step(prompt, schema)
        return output, token_usage, node.get("next")

    elif ntype == "approval":
        # Handled at worker level because it pauses the run
        return {"decision": "pending"}, None, node.get("next")

    else:
        raise ValueError(f"Unsupported node type: {ntype}")

def _evaluate_condition(left: Any, op: str, right: Any) -> bool:
    # Try numeric conversion if possible
    try:
        if left is not None and right is not None:
            fl = float(left)
            fr = float(right)
            if op == "equals":
                return fl == fr
            elif op == "not_equals":
                return fl != fr
            elif op == "greater_than":
                return fl > fr
            elif op == "less_than":
                return fl < fr
    except (ValueError, TypeError):
        pass

    # String / generic comparison
    sl = str(left) if left is not None else ""
    sr = str(right) if right is not None else ""

    if op == "equals":
        return sl == sr
    elif op == "not_equals":
        return sl != sr
    elif op == "contains":
        return sr in sl
    elif op == "greater_than":
        return sl > sr
    elif op == "less_than":
        return sl < sr
    else:
        raise ValueError(f"Unknown condition op: {op}")
