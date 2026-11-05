import re
from typing import Any

TEMPLATE_RE = re.compile(r"\{\{([^}]+)\}\}")

def get_by_path(context: dict, path: str) -> Any:
    parts = [p.strip() for p in path.strip().split(".") if p.strip()]
    curr = context
    for part in parts:
        if isinstance(curr, dict):
            if part in curr:
                curr = curr[part]
            else:
                return None
        elif isinstance(curr, list):
            try:
                idx = int(part)
                curr = curr[idx]
            except (ValueError, IndexError):
                return None
        else:
            return None
    return curr

def resolve_value(val: Any, context: dict) -> Any:
    if isinstance(val, str):
        trimmed = val.strip()
        # Single exact expression: preserve native type (e.g. int, dict, bool)
        match = TEMPLATE_RE.fullmatch(trimmed)
        if match:
            path = match.group(1).strip()
            resolved = get_by_path(context, path)
            return resolved if resolved is not None else ""
        
        # Embedded expressions: replace inline
        def repl(m):
            res = get_by_path(context, m.group(1).strip())
            return str(res) if res is not None else ""
        
        return TEMPLATE_RE.sub(repl, val)
    elif isinstance(val, dict):
        return {k: resolve_value(v, context) for k, v in val.items()}
    elif isinstance(val, list):
        return [resolve_value(item, context) for item in val]
    return val
