"""
job_matcher.py — Part B of Milestone 2.

Given a job description, returns the top-K candidates from the vector
store built by `resume_rag.py`. Combines:

* Dense semantic retrieval over resume chunks (ChromaDB cosine similarity).
* Sparse keyword retrieval (BM25) restricted to must-have skills extracted
  from the JD — this catches exact-skill matches that pure embeddings smear.
* Hard filters (e.g. "5+ years Python") that exclude candidates outright.
* A 0–100 blended score with human-readable reasoning and the chunks that
  drove the match.

Run:
    python job_matcher.py --jd data/job_descriptions/jd_ml_engineer.json
    python job_matcher.py --jd-text "Senior Python engineer..." --top-k 5
"""

from __future__ import annotations

import argparse
import json
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from resume_rag import (
    COLLECTION_NAME,
    DB_DIR,
    EMBED_MODEL_NAME,
    SKILL_VOCAB,
    Embedder,
)

ROOT = Path(__file__).resolve().parent
JD_DIR = ROOT / "data" / "job_descriptions"


# ---------------------------------------------------------------------------
# Job description parsing
# ---------------------------------------------------------------------------

@dataclass
class JobRequirements:
    title: str = ""
    description: str = ""
    must_have_skills: List[str] = field(default_factory=list)
    nice_to_have_skills: List[str] = field(default_factory=list)
    min_years_experience: int = 0
    min_education: str = ""  # one of "", "BACHELOR", "MASTER", "PHD"


_EDU_RANK = {"": 0, "BACHELOR": 1, "BSC": 1, "BS": 1, "BTECH": 1,
             "MASTER": 2, "MS": 2, "MSC": 2, "MTECH": 2, "MBA": 2,
             "PHD": 3, "DOCTORATE": 3}


def _extract_skills_from_text(text: str) -> List[str]:
    lower = text.lower()
    found: List[str] = []
    for skill in SKILL_VOCAB:
        if " " in skill or "/" in skill or "." in skill:
            if skill in lower and skill not in found:
                found.append(skill)
        else:
            if re.search(rf"\b{re.escape(skill)}\b", lower) and skill not in found:
                found.append(skill)
    return found


def _extract_min_years(text: str) -> int:
    # Catches "5+ years", "minimum 5 years", "at least 7 years experience".
    candidates = []
    for m in re.finditer(
        r"(?:minimum|at\s+least|>=?|\b)\s*(\d{1,2})\+?\s*\+?\s*years?",
        text, re.IGNORECASE,
    ):
        candidates.append(int(m.group(1)))
    return max(candidates) if candidates else 0


def _extract_min_education(text: str) -> str:
    lowered = text.lower()
    if "phd" in lowered or "doctorate" in lowered:
        return "PHD"
    if "master" in lowered or "ms degree" in lowered or "m.s." in lowered or "msc" in lowered:
        return "MASTER"
    if "bachelor" in lowered or "b.s." in lowered or "bsc" in lowered or "b.tech" in lowered:
        return "BACHELOR"
    return ""


def parse_job(payload: Dict[str, Any] | str) -> JobRequirements:
    """Accepts either a dict from a JD JSON file, or a raw description string."""
    if isinstance(payload, str):
        payload = {"description": payload}

    description = payload.get("description", "") or ""
    must = list(payload.get("must_have_skills") or [])
    nice = list(payload.get("nice_to_have_skills") or [])

    # If the JD JSON didn't list skills, mine them from the prose.
    if not must and not nice:
        mined = _extract_skills_from_text(description)
        # Treat the first half as must-have, rest as nice-to-have when nothing's marked.
        cutoff = max(1, len(mined) // 2)
        must, nice = mined[:cutoff], mined[cutoff:]

    return JobRequirements(
        title=payload.get("title", ""),
        description=description,
        must_have_skills=[s.lower() for s in must],
        nice_to_have_skills=[s.lower() for s in nice],
        min_years_experience=int(payload.get("min_years_experience")
                                 or _extract_min_years(description)),
        min_education=(payload.get("min_education") or _extract_min_education(description)).upper(),
    )


# ---------------------------------------------------------------------------
# Hybrid matcher
# ---------------------------------------------------------------------------

@dataclass
class CandidateMatch:
    candidate_name: str
    resume_path: str
    match_score: float
    semantic_score: float
    keyword_score: float
    matched_skills: List[str]
    missing_must_have: List[str]
    relevant_excerpts: List[str]
    reasoning: str
    years_experience: int
    highest_education: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "candidate_name": self.candidate_name,
            "resume_path": self.resume_path,
            "match_score": round(self.match_score, 1),
            "semantic_score": round(self.semantic_score, 3),
            "keyword_score": round(self.keyword_score, 3),
            "matched_skills": self.matched_skills,
            "missing_must_have": self.missing_must_have,
            "relevant_excerpts": self.relevant_excerpts,
            "reasoning": self.reasoning,
            "years_experience": self.years_experience,
            "highest_education": self.highest_education,
        }


class JobMatcher:
    def __init__(
        self,
        db_dir: Path = DB_DIR,
        collection_name: str = COLLECTION_NAME,
        embed_model_name: str = EMBED_MODEL_NAME,
        semantic_weight: float = 0.65,
    ):
        import chromadb
        self.client = chromadb.PersistentClient(path=str(db_dir))
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        self.embedder = Embedder(embed_model_name)
        self.semantic_weight = semantic_weight

    # -- core ---------------------------------------------------------------
    def match(
        self,
        job: JobRequirements,
        top_k: int = 10,
        retrieve_chunks: int = 60,
        apply_hard_filters: bool = True,
    ) -> Dict[str, Any]:
        if self.collection.count() == 0:
            raise RuntimeError(
                "Vector store is empty. Run `python resume_rag.py --build` first."
            )

        t0 = time.perf_counter()

        # --- 1. Dense retrieval -------------------------------------------
        query_text = job.description.strip() or " ".join(
            job.must_have_skills + job.nice_to_have_skills
        )
        query_vec = self.embedder.encode([query_text])[0]
        retrieved = self.collection.query(
            query_embeddings=[query_vec],
            n_results=min(retrieve_chunks, self.collection.count()),
        )
        dense_seconds = time.perf_counter() - t0

        documents = retrieved["documents"][0]
        metadatas = retrieved["metadatas"][0]
        # Chroma returns cosine *distance*; convert to similarity in [0, 1].
        distances = retrieved["distances"][0]
        similarities = [max(0.0, 1.0 - d) for d in distances]

        # --- 2. Aggregate per candidate -----------------------------------
        per_candidate: Dict[str, Dict[str, Any]] = {}
        for doc, md, sim in zip(documents, metadatas, similarities):
            name = md["candidate_name"]
            slot = per_candidate.setdefault(name, {
                "metadata": md,
                "chunks": [],
                "max_sim": 0.0,
                "avg_sim": 0.0,
            })
            slot["chunks"].append({"text": doc, "section": md.get("section"), "sim": sim})
            slot["max_sim"] = max(slot["max_sim"], sim)

        for slot in per_candidate.values():
            sims = [c["sim"] for c in slot["chunks"]]
            slot["avg_sim"] = sum(sims) / len(sims)
            # Top-3 mean is more informative than overall mean.
            top3 = sorted(sims, reverse=True)[:3]
            slot["semantic_score"] = sum(top3) / len(top3)

        # --- 3. Keyword (BM25) over the entire resume corpus --------------
        keyword_scores = self._bm25_scores(job.must_have_skills)

        # --- 4. Hard filters & blended scoring -----------------------------
        matches: List[CandidateMatch] = []
        for name, slot in per_candidate.items():
            md = slot["metadata"]
            cand_skills = [s.strip() for s in (md.get("skills") or "").split(",") if s.strip()]
            cand_skills_lower = {s.lower() for s in cand_skills}

            matched_must = [s for s in job.must_have_skills if s in cand_skills_lower]
            missing_must = [s for s in job.must_have_skills if s not in cand_skills_lower]
            matched_nice = [s for s in job.nice_to_have_skills if s in cand_skills_lower]

            if apply_hard_filters:
                if md.get("years_experience", 0) < job.min_years_experience:
                    continue
                cand_edu_rank = _EDU_RANK.get((md.get("highest_education") or "").upper(), 0)
                req_edu_rank = _EDU_RANK.get(job.min_education, 0)
                if cand_edu_rank < req_edu_rank:
                    continue

            semantic = slot["semantic_score"]            # 0..1
            keyword = keyword_scores.get(name, 0.0)      # 0..1 (normalised below)
            skill_coverage = (
                len(matched_must) / len(job.must_have_skills)
                if job.must_have_skills else 1.0
            )
            nice_bonus = (
                0.25 * len(matched_nice) / len(job.nice_to_have_skills)
                if job.nice_to_have_skills else 0.0
            )

            blended = (
                self.semantic_weight * semantic
                + (1 - self.semantic_weight) * (0.5 * keyword + 0.5 * skill_coverage)
            ) + nice_bonus
            blended = max(0.0, min(1.0, blended))
            score_100 = round(blended * 100, 1)

            top_chunks = sorted(slot["chunks"], key=lambda c: c["sim"], reverse=True)[:3]
            excerpts = [
                f"[{c['section']}] {c['text'][:240].strip()}{'…' if len(c['text']) > 240 else ''}"
                for c in top_chunks
            ]
            reasoning = self._explain(
                semantic, skill_coverage, matched_must, missing_must, matched_nice,
                md.get("years_experience", 0), job,
            )

            matches.append(CandidateMatch(
                candidate_name=name,
                resume_path=md.get("source_path", ""),
                match_score=score_100,
                semantic_score=semantic,
                keyword_score=keyword,
                matched_skills=sorted(set(matched_must + matched_nice)),
                missing_must_have=missing_must,
                relevant_excerpts=excerpts,
                reasoning=reasoning,
                years_experience=md.get("years_experience", 0),
                highest_education=md.get("highest_education", ""),
            ))

        matches.sort(key=lambda m: m.match_score, reverse=True)
        latency_ms = round((time.perf_counter() - t0) * 1000, 1)

        return {
            "job_description": job.description,
            "job_title": job.title,
            "must_have_skills": job.must_have_skills,
            "min_years_experience": job.min_years_experience,
            "min_education": job.min_education,
            "top_matches": [m.to_dict() for m in matches[:top_k]],
            "diagnostics": {
                "candidates_considered": len(per_candidate),
                "candidates_after_filters": len(matches),
                "dense_retrieval_seconds": round(dense_seconds, 3),
                "total_latency_ms": latency_ms,
                "semantic_weight": self.semantic_weight,
            },
        }

    # -- helpers ------------------------------------------------------------
    def _bm25_scores(self, must_have: List[str]) -> Dict[str, float]:
        """Compute candidate-level BM25 scores for the must-have skill terms.

        We pull every chunk via the collection, group by candidate, and run
        rank_bm25 over the per-candidate concatenated text. Scores are
        min-max normalised to [0, 1]."""
        if not must_have:
            return {}

        all_chunks = self.collection.get()
        docs_by_candidate: Dict[str, List[str]] = {}
        for doc, md in zip(all_chunks["documents"], all_chunks["metadatas"]):
            docs_by_candidate.setdefault(md["candidate_name"], []).append(doc)

        try:
            from rank_bm25 import BM25Okapi
        except ImportError:
            return {}

        names = list(docs_by_candidate.keys())
        corpus = [
            re.findall(r"[A-Za-z0-9+./#-]+", " ".join(docs).lower())
            for docs in docs_by_candidate.values()
        ]
        bm25 = BM25Okapi(corpus)
        query_tokens = [t.lower() for t in must_have]
        raw = bm25.get_scores(query_tokens)
        if raw.max() <= 0:
            return {n: 0.0 for n in names}
        normalised = (raw - raw.min()) / (raw.max() - raw.min() + 1e-9)
        return {n: float(s) for n, s in zip(names, normalised)}

    @staticmethod
    def _explain(
        semantic: float,
        skill_coverage: float,
        matched_must: List[str],
        missing_must: List[str],
        matched_nice: List[str],
        years: int,
        job: JobRequirements,
    ) -> str:
        bits: List[str] = []
        if matched_must:
            bits.append(f"Covers {len(matched_must)}/{len(job.must_have_skills)} "
                        f"must-have skills ({', '.join(matched_must)}).")
        if missing_must:
            bits.append(f"Missing: {', '.join(missing_must)}.")
        if matched_nice:
            bits.append(f"Bonus skills: {', '.join(matched_nice)}.")
        bits.append(f"Semantic similarity to JD: {semantic:.2f}.")
        if job.min_years_experience:
            bits.append(f"{years} yrs experience vs {job.min_years_experience}+ required.")
        if skill_coverage >= 0.8 and semantic >= 0.55:
            bits.append("Strong overall fit.")
        elif skill_coverage < 0.5:
            bits.append("Weak skill coverage — likely needs upskilling.")
        return " ".join(bits)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _load_jd(path: Path) -> Dict[str, Any]:
    if path.suffix.lower() == ".json":
        return json.loads(path.read_text(encoding="utf-8"))
    return {"description": path.read_text(encoding="utf-8")}


def _cli() -> None:
    parser = argparse.ArgumentParser(description="Match resumes to a job description.")
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--jd", type=Path, help="Path to a JD JSON or text file.")
    src.add_argument("--jd-text", type=str, help="Raw JD description string.")
    parser.add_argument("--top-k", type=int, default=10)
    parser.add_argument("--no-filters", action="store_true",
                        help="Disable hard must-have filters (years, education).")
    parser.add_argument("--semantic-weight", type=float, default=0.65)
    args = parser.parse_args()

    payload = _load_jd(args.jd) if args.jd else args.jd_text
    job = parse_job(payload)
    matcher = JobMatcher(semantic_weight=args.semantic_weight)
    report = matcher.match(job, top_k=args.top_k, apply_hard_filters=not args.no_filters)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    _cli()
