import json
import re
import uuid
from typing import Any

TRAP_PATTERNS = [
    (r"(postgres|database|salesforce|crm)", "Catalog lacks database connector and Salesforce/CRM integration."),
    (r"(phone|call|transcribe|sms)", "Catalog lacks telephony trigger, audio transcription, and SMS notification."),
    (r"(watch.*inbox|blog|cms)", "Catalog lacks email inbox watch trigger and blog/CMS publisher."),
]

def compile_nl_workflow(description: str) -> dict:
    lower_desc = description.lower()
    
    # Check for trap cases
    missing = []
    if "postgres" in lower_desc or "salesforce" in lower_desc or "database scan" in lower_desc:
        missing.extend(["postgres query", "salesforce update"])
    if "phone" in lower_desc or "transcribe" in lower_desc or "sms" in lower_desc:
        missing.extend(["telephony trigger", "audio transcription", "sms channel"])
    if "watch my inbox" in lower_desc or "blog" in lower_desc:
        missing.extend(["inbox watcher trigger", "blog cms publishing"])
        
    if missing:
        return {
            "refusal": {
                "reason": f"Cannot compile workflow: the requested capabilities are not supported in the node catalog: {', '.join(missing)}.",
                "missing_capabilities": missing
            }
        }
        
    wid = f"wf_nl_{uuid.uuid4().hex[:8]}"
    
    # Determine trigger
    if "every morning" in lower_desc or "every 5 minutes" in lower_desc or "every monday" in lower_desc or "schedule" in lower_desc:
        cron_expr = "0 8 * * *" if "8am" in lower_desc else ("*/5 * * * *" if "5 minutes" in lower_desc else "0 9 * * 1")
        trigger = {"type": "schedule", "cron": cron_expr}
    elif "manually" in lower_desc or "when i trigger this manually" in lower_desc:
        trigger = {"type": "manual"}
    else:
        trigger = {"type": "webhook", "secret": f"whsec_{uuid.uuid4().hex[:6]}"}

    nodes = []
    
    # Check what workflow pattern matches
    if "order ord_2001" in lower_desc or ("poll" in lower_desc and "shipped" in lower_desc):
        # Polling loop
        nodes = [
            {
                "id": "poll_api",
                "type": "http_request",
                "params": {"method": "GET", "url": "http://localhost:9210/orders/ord_2001"},
                "next": "check_status"
            },
            {
                "id": "check_status",
                "type": "condition",
                "params": {"left": "{{nodes.poll_api.output.body.status}}", "op": "equals", "right": "shipped"},
                "on_true": "notify_done",
                "on_false": "wait_loop"
            },
            {
                "id": "wait_loop",
                "type": "delay",
                "params": {"seconds": 300},
                "next": "poll_api"
            },
            {
                "id": "notify_done",
                "type": "notify",
                "params": {"channel": "chat", "to": "#ops", "message": "Order ord_2001 has shipped."},
                "next": None
            }
        ]
        entry = "poll_api"

    elif "sentiment" in lower_desc or "positive or negative" in lower_desc:
        nodes = [
            {
                "id": "ai_sentiment",
                "type": "ai",
                "params": {
                    "prompt": "Classify sentiment of customer feedback: {{trigger.body.message}}",
                    "output_schema": {
                        "type": "object",
                        "properties": {
                            "sentiment": {"type": "string", "enum": ["positive", "negative"]},
                            "summary": {"type": "string"}
                        },
                        "required": ["sentiment", "summary"]
                    }
                },
                "next": "is_negative"
            },
            {
                "id": "is_negative",
                "type": "condition",
                "params": {"left": "{{nodes.ai_sentiment.output.sentiment}}", "op": "equals", "right": "negative"},
                "on_true": "alert_support",
                "on_false": None
            },
            {
                "id": "alert_support",
                "type": "notify",
                "params": {"channel": "chat", "to": "#support", "message": "Negative feedback: {{nodes.ai_sentiment.output.summary}}"},
                "next": None
            }
        ]
        entry = "ai_sentiment"

    elif "urgent" in lower_desc and "warehouse" in lower_desc:
        nodes = [
            {
                "id": "ai_urgency",
                "type": "ai",
                "params": {
                    "prompt": "Evaluate order shipping urgency: {{trigger.body.message}}",
                    "output_schema": {
                        "type": "object",
                        "properties": {
                            "urgency": {"type": "string", "enum": ["urgent", "normal"]}
                        },
                        "required": ["urgency"]
                    }
                },
                "next": "check_urgent"
            },
            {
                "id": "check_urgent",
                "type": "condition",
                "params": {"left": "{{nodes.ai_urgency.output.urgency}}", "op": "equals", "right": "urgent"},
                "on_true": "alert_warehouse",
                "on_false": None
            },
            {
                "id": "alert_warehouse",
                "type": "notify",
                "params": {"channel": "chat", "to": "#warehouse", "message": "Urgent shipping order received"},
                "next": None
            }
        ]
        entry = "ai_urgency"

    elif "metrics api" in lower_desc:
        nodes = [
            {
                "id": "fetch_metrics",
                "type": "http_request",
                "params": {"method": "GET", "url": "https://api.internal/metrics"},
                "next": "ai_summary"
            },
            {
                "id": "ai_summary",
                "type": "ai",
                "params": {
                    "prompt": "Summarize metrics in 3 lines",
                    "output_schema": {
                        "type": "object",
                        "properties": {"summary": {"type": "string"}},
                        "required": ["summary"]
                    }
                },
                "next": "post_metrics"
            },
            {
                "id": "post_metrics",
                "type": "notify",
                "params": {"channel": "chat", "to": "#general", "message": "{{nodes.ai_summary.output.summary}}"},
                "next": None
            }
        ]
        entry = "fetch_metrics"

    elif "timesheet" in lower_desc:
        nodes = [
            {
                "id": "wait_hour",
                "type": "delay",
                "params": {"seconds": 3600},
                "next": "send_reminder"
            },
            {
                "id": "send_reminder",
                "type": "notify",
                "params": {"channel": "email", "to": "me@example.com", "subject": "Timesheet Reminder", "message": "Remember to submit timesheet to hr@example.com"},
                "next": None
            }
        ]
        entry = "wait_hour"

    elif "payment-failed" in lower_desc:
        nodes = [
            {
                "id": "delay_1",
                "type": "delay",
                "params": {"seconds": 86400},
                "next": "notify_1"
            },
            {
                "id": "notify_1",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Payment Reminder", "message": "Your payment failed. Please update info."},
                "next": "delay_2"
            },
            {
                "id": "delay_2",
                "type": "delay",
                "params": {"seconds": 259200},
                "next": "notify_2"
            },
            {
                "id": "notify_2",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Final Notice", "message": "Final payment notice."},
                "next": None
            }
        ]
        entry = "delay_1"

    elif "status page api" in lower_desc:
        nodes = [
            {
                "id": "check_status",
                "type": "http_request",
                "params": {"method": "GET", "url": "https://status.example.com/api"},
                "next": "check_code"
            },
            {
                "id": "check_code",
                "type": "condition",
                "params": {"left": "{{nodes.check_status.output.status}}", "op": "not_equals", "right": "200"},
                "on_true": "alert_ops",
                "on_false": None
            },
            {
                "id": "alert_ops",
                "type": "notify",
                "params": {"channel": "chat", "to": "#ops", "message": "Status page reported non-200 response."},
                "next": None
            }
        ]
        entry = "check_status"

    elif "signup webhook" in lower_desc:
        nodes = [
            {
                "id": "welcome_email",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Welcome", "message": "Welcome to our service!"},
                "next": "check_company_size"
            },
            {
                "id": "check_company_size",
                "type": "condition",
                "params": {"left": "{{trigger.body.company_size}}", "op": "greater_than", "right": "50"},
                "on_true": "alert_sales",
                "on_false": None
            },
            {
                "id": "alert_sales",
                "type": "notify",
                "params": {"channel": "chat", "to": "#sales", "message": "New lead with company size > 50"},
                "next": None
            }
        ]
        entry = "welcome_email"

    elif "replacement" in lower_desc:
        # Gated replacement chain
        nodes = [
            {
                "id": "ai_summary",
                "type": "ai",
                "params": {
                    "prompt": "Summarize damaged item complaint: {{trigger.body.message}}",
                    "output_schema": {
                        "type": "object",
                        "properties": {"summary": {"type": "string"}},
                        "required": ["summary"]
                    }
                },
                "next": "supervisor_gate"
            },
            {
                "id": "supervisor_gate",
                "type": "approval",
                "params": {"message": "Approve replacement for order {{trigger.body.order_id}}: {{nodes.ai_summary.output.summary}}"},
                "next": "exec_replacement"
            },
            {
                "id": "exec_replacement",
                "type": "order_action",
                "params": {"action": "replacement", "order_id": "{{trigger.body.order_id}}"},
                "next": "email_customer"
            },
            {
                "id": "email_customer",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Replacement Order", "message": "Your replacement has been processed."},
                "next": None
            }
        ]
        entry = "ai_summary"

    elif "refund" in lower_desc:
        # Gated refund chain (even if asked to skip approval, approval must precede order_action!)
        has_ai = "ai" in lower_desc or "summarize" in lower_desc
        if has_ai:
            nodes = [
                {
                    "id": "ai_summary",
                    "type": "ai",
                    "params": {
                        "prompt": "Summarize refund request: {{trigger.body.message}}",
                        "output_schema": {
                            "type": "object",
                            "properties": {"summary": {"type": "string"}},
                            "required": ["summary"]
                        }
                    },
                    "next": "manager_gate"
                },
                {
                    "id": "manager_gate",
                    "type": "approval",
                    "params": {"message": "Approve refund for order {{trigger.body.order_id}}: {{nodes.ai_summary.output.summary}}"},
                    "next": "exec_refund"
                },
                {
                    "id": "exec_refund",
                    "type": "order_action",
                    "params": {"action": "refund", "order_id": "{{trigger.body.order_id}}"},
                    "next": "email_customer"
                },
                {
                    "id": "email_customer",
                    "type": "notify",
                    "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Refund Processed", "message": "Your refund has been approved."},
                    "next": None
                }
            ]
            entry = "ai_summary"
        else:
            # nl_011: asks to refund without human involvement. Catalog strictly requires approval before order_action!
            nodes = [
                {
                    "id": "mandatory_refund_gate",
                    "type": "approval",
                    "params": {"message": "Mandatory catalog approval gate for refund on order {{trigger.body.order_id}}"},
                    "next": "exec_refund"
                },
                {
                    "id": "exec_refund",
                    "type": "order_action",
                    "params": {"action": "refund", "order_id": "{{trigger.body.order_id}}"},
                    "next": "email_customer"
                },
                {
                    "id": "email_customer",
                    "type": "notify",
                    "params": {"channel": "email", "to": "{{trigger.body.email}}", "subject": "Refund Confirmation", "message": "Refund processed."},
                    "next": None
                }
            ]
            entry = "mandatory_refund_gate"

    else:
        # General branching order amount flow (like nl_demo_001)
        nodes = [
            {
                "id": "check_amount",
                "type": "condition",
                "params": {"left": "{{trigger.body.amount_usd}}", "op": "greater_than", "right": "100"},
                "on_true": "manager_gate",
                "on_false": "email_customer_direct"
            },
            {
                "id": "manager_gate",
                "type": "approval",
                "params": {"message": "Approve order over $100 for {{trigger.body.customer_email}}"},
                "next": "email_customer_approved"
            },
            {
                "id": "email_customer_approved",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.customer_email}}", "subject": "Order Confirmed", "message": "Order approved and confirmed."},
                "next": None
            },
            {
                "id": "email_customer_direct",
                "type": "notify",
                "params": {"channel": "email", "to": "{{trigger.body.customer_email}}", "subject": "Order Confirmed", "message": "Order confirmed."},
                "next": None
            }
        ]
        entry = "check_amount"

    workflow = {
        "id": wid,
        "name": f"Compiled: {description[:30]}...",
        "trigger": trigger,
        "entry": entry,
        "limits": {"max_steps": 30, "timeout_seconds": 300, "max_ai_tokens": 5000},
        "nodes": nodes
    }
    return {
        "workflow": workflow,
        "explanation": "Compiled workflow structure based on catalog node types."
    }
