#!/usr/bin/env python3
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVAL_PATH = ROOT / "data" / "nl_eval.jsonl"

def main():
    with open(EVAL_PATH, "r", encoding="utf-8") as f:
        cases = [json.loads(line) for line in f if line.strip()]

    passed = 0
    total = len(cases)
    print(f"\nRunning NL Compiler evaluation on {total} cases...\n")

    for case in cases:
        cid = case["id"]
        desc = case["description"]
        expected = case["expect"]
        req = urllib.request.Request(
            "http://localhost:8080/workflows/compile",
            data=json.dumps({"description": desc}).encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.load(resp)
                code = resp.status
        except urllib.error.HTTPError as e:
            code = e.code
            try:
                data = json.load(e)
            except Exception:
                data = {"raw": e.read().decode()}

        if expected == "refusal":
            ok = "refusal" in data
            print(f"  [{'PASS' if ok else 'FAIL'}] {cid} (trap case): refused={ok}")
            if ok: passed += 1
        else:
            wf = data.get("workflow", {})
            nodes = wf.get("nodes", [])
            node_types = [n["type"] for n in nodes]
            req_types = case.get("assertions", {}).get("required_node_types", [])
            types_ok = all(t in node_types for t in req_types)
            print(f"  [{'PASS' if types_ok else 'FAIL'}] {cid}: generated valid workflow with required nodes {req_types}")
            if types_ok: passed += 1

    print(f"\nNL Compiler Results: {passed}/{total} passed ({round(passed/total*100)}%)\n")

if __name__ == "__main__":
    main()
