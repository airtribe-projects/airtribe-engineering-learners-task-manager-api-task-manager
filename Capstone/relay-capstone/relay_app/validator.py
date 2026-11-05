import json
from pathlib import Path

CATALOG_PATH = Path(__file__).resolve().parents[1] / "data" / "node_catalog.json"

def load_catalog():
    if not CATALOG_PATH.exists():
        return {"nodes": [], "triggers": []}
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def validate_workflow_definition(defn: dict) -> tuple[bool, str | None, str | None]:
    if not isinstance(defn, dict):
        return False, "Definition must be a JSON object", "invalid_definition"
    
    wid = defn.get("id")
    if not wid or not isinstance(wid, str):
        return False, "Workflow 'id' is required and must be a string", "missing_id"
    
    nodes = defn.get("nodes")
    if not isinstance(nodes, list) or len(nodes) == 0:
        return False, "Workflow must have at least one node in 'nodes'", "empty_nodes"
    
    catalog = load_catalog()
    catalog_nodes = {n["type"]: n for n in catalog.get("nodes", [])}
    
    node_ids = set()
    for node in nodes:
        if not isinstance(node, dict) or "id" not in node:
            return False, "Each node must have an 'id'", "invalid_node"
        nid = node["id"]
        if nid in node_ids:
            return False, f"Duplicate node id '{nid}'", "duplicate_node_id"
        node_ids.add(nid)
    
    entry = defn.get("entry")
    if not entry or entry not in node_ids:
        return False, f"Entry node '{entry}' does not exist in nodes", "invalid_entry_node"
    
    for node in nodes:
        nid = node["id"]
        ntype = node.get("type")
        if not ntype or ntype not in catalog_nodes:
            return False, f"Node '{nid}' has unknown type '{ntype}'", "invalid_node_type"
        
        cat_node = catalog_nodes[ntype]
        params = node.get("params", {}) or {}
        cat_params = cat_node.get("params", {})
        
        for p_name, p_schema in cat_params.items():
            if p_schema.get("required") and (p_name not in params or params[p_name] is None):
                return False, f"Node '{nid}' missing required param '{p_name}'", "missing_required_param"
            
            if p_name in params and params[p_name] is not None:
                expected_enum = p_schema.get("enum")
                if expected_enum and params[p_name] not in expected_enum:
                    # Templated expressions e.g. {{...}} are allowed for templatable fields
                    val = str(params[p_name])
                    if not (p_schema.get("templatable") and "{{" in val):
                        return False, f"Node '{nid}' param '{p_name}' must be one of {expected_enum}", "invalid_param_value"
        
        # Check next references
        if ntype == "condition":
            on_true = node.get("on_true")
            on_false = node.get("on_false")
            if on_true and on_true not in node_ids:
                return False, f"Node '{nid}' on_true references nonexistent node '{on_true}'", "invalid_node_reference"
            if on_false and on_false not in node_ids:
                return False, f"Node '{nid}' on_false references nonexistent node '{on_false}'", "invalid_node_reference"
        else:
            nxt = node.get("next")
            if nxt and nxt not in node_ids:
                return False, f"Node '{nid}' next references nonexistent node '{nxt}'", "invalid_node_reference"
                
    return True, None, None
