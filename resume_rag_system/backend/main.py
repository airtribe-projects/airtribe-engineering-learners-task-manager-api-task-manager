"""
FastAPI backend for the Resume RAG & Job Matching system.

Wraps the existing `resume_rag` and `job_matcher` modules from the project
root and exposes them as a JSON HTTP API consumed by the React frontend.

Run:
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# --- Make the project-root modules importable ----------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from resume_rag import ResumeRAG, RESUMES_DIR  # noqa: E402
from job_matcher import JD_DIR, JobMatcher, parse_job  # noqa: E402


# ---------------------------------------------------------------------------
# App & singletons
# ---------------------------------------------------------------------------

app = FastAPI(title="Resume RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class _Services:
    """Lazily-constructed singletons so the heavy embedder loads once."""

    _rag: Optional[ResumeRAG] = None
    _matcher: Optional[JobMatcher] = None

    @classmethod
    def rag(cls) -> ResumeRAG:
        if cls._rag is None:
            cls._rag = ResumeRAG()
        return cls._rag

    @classmethod
    def matcher(cls, semantic_weight: float = 0.65) -> JobMatcher:
        # Rebuild if the weight changed; otherwise reuse the warm matcher.
        if cls._matcher is None or abs(cls._matcher.semantic_weight - semantic_weight) > 1e-6:
            cls._matcher = JobMatcher(semantic_weight=semantic_weight)
        return cls._matcher


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class MatchRequest(BaseModel):
    description: str = Field(..., description="Free-text job description.")
    title: str = ""
    must_have_skills: List[str] = Field(default_factory=list)
    nice_to_have_skills: List[str] = Field(default_factory=list)
    min_years_experience: int = 0
    min_education: str = ""
    top_k: int = 10
    semantic_weight: float = 0.65
    apply_hard_filters: bool = True


class IndexStats(BaseModel):
    collection: str
    db_path: str
    embedding_model: str
    total_chunks: int


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/index/stats", response_model=IndexStats)
def index_stats() -> Dict[str, Any]:
    return _Services.rag().stats()


@app.post("/api/index/build")
def index_build() -> Dict[str, Any]:
    report = _Services.rag().build()
    # Drop the heavy candidate list from the response — clients can fetch
    # /api/candidates separately if they want it.
    return {
        "resumes_indexed": report["resumes_indexed"],
        "chunks_indexed": report["chunks_indexed"],
        "embed_seconds": report["embed_seconds"],
    }


@app.get("/api/candidates")
def candidates() -> Dict[str, Any]:
    """Return one row per candidate, aggregated from the indexed chunks."""
    rag = _Services.rag()
    if rag.collection.count() == 0:
        return {"candidates": []}
    raw = rag.collection.get()
    seen: Dict[str, Dict[str, Any]] = {}
    for md in raw["metadatas"]:
        name = md["candidate_name"]
        if name in seen:
            continue
        seen[name] = {
            "candidate_name": name,
            "email": md.get("email", ""),
            "phone": md.get("phone", ""),
            "skills": [s.strip() for s in (md.get("skills") or "").split(",") if s.strip()],
            "years_experience": md.get("years_experience", 0),
            "highest_education": md.get("highest_education", ""),
            "source_path": md.get("source_path", ""),
        }
    return {"candidates": sorted(seen.values(), key=lambda c: c["candidate_name"])}


@app.get("/api/candidates/{name}/resume")
def candidate_resume(name: str) -> Dict[str, Any]:
    """Return the raw resume text for a candidate."""
    rag = _Services.rag()
    raw = rag.collection.get(where={"candidate_name": name})
    if not raw["metadatas"]:
        raise HTTPException(404, f"Candidate '{name}' not found in the index.")
    source = raw["metadatas"][0].get("source_path")
    if not source or not Path(source).exists():
        raise HTTPException(404, "Source resume file is missing.")
    return {
        "candidate_name": name,
        "source_path": source,
        "content": Path(source).read_text(encoding="utf-8", errors="ignore"),
    }


@app.get("/api/jds")
def list_jds() -> Dict[str, Any]:
    items = []
    for path in sorted(JD_DIR.glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        items.append({"id": path.stem, **payload})
    return {"jds": items}


@app.post("/api/match")
def match(req: MatchRequest) -> Dict[str, Any]:
    if not req.description.strip() and not req.must_have_skills:
        raise HTTPException(400, "Provide at least a description or must_have_skills.")
    job = parse_job({
        "title": req.title,
        "description": req.description,
        "must_have_skills": req.must_have_skills,
        "nice_to_have_skills": req.nice_to_have_skills,
        "min_years_experience": req.min_years_experience,
        "min_education": req.min_education,
    })
    try:
        return _Services.matcher(req.semantic_weight).match(
            job,
            top_k=req.top_k,
            apply_hard_filters=req.apply_hard_filters,
        )
    except RuntimeError as exc:
        raise HTTPException(409, str(exc))
