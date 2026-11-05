"""
resume_rag.py — Part A of Milestone 2.

Loads resumes from disk, chunks them by section, extracts structured
metadata, embeds each chunk with a SentenceTransformer model, and
persists everything into a ChromaDB vector store.

Run:
    python resume_rag.py --build               # (re)build the index
    python resume_rag.py --stats               # report on the current index
    python resume_rag.py --inspect <name>      # dump chunks for a candidate
"""

from __future__ import annotations

import argparse
import json
import re
import time
import uuid
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

# --- Reuse Milestone 1's file reader if available, fall back to a local one ---
try:  # pragma: no cover
    import sys
    sys.path.append(str(Path(__file__).resolve().parent.parent / "llm_file_tools"))
    from fs_tools import FileSystemTools  # type: ignore
    _HAVE_M1 = True
except Exception:
    _HAVE_M1 = False


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
RESUMES_DIR = DATA_DIR / "resumes"
DB_DIR = ROOT / ".chroma"
COLLECTION_NAME = "resumes_v1"
EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Canonical section headers we want to detect.
SECTION_ALIASES: Dict[str, List[str]] = {
    "summary":     ["professional summary", "summary", "profile", "objective", "about"],
    "skills":      ["technical skills", "skills", "core competencies", "technologies"],
    "experience":  ["professional experience", "work experience", "experience", "employment history"],
    "education":   ["education", "academic background", "qualifications"],
    "projects":    ["projects", "selected projects", "personal projects"],
    "certifications": ["certifications", "licenses", "certificates"],
    "awards":      ["awards", "honors", "achievements"],
    "publications": ["publications", "papers"],
}

# A flat skill vocabulary used for metadata extraction. Kept generous on purpose.
SKILL_VOCAB = [
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang", "rust",
    "kotlin", "swift", "scala", "ruby", "php", "r", "matlab", "sql", "nosql",
    "react", "angular", "vue", "node.js", "nodejs", "django", "flask", "fastapi",
    "spring", "express", "next.js", "redux",
    "tensorflow", "pytorch", "scikit-learn", "sklearn", "keras", "huggingface",
    "transformers", "langchain", "llamaindex", "openai", "anthropic", "rag",
    "machine learning", "deep learning", "nlp", "computer vision", "mlops",
    "data analysis", "data science", "statistics", "feature engineering",
    "pandas", "numpy", "matplotlib", "plotly", "tableau", "power bi", "excel",
    "spark", "hadoop", "kafka", "airflow", "dbt", "snowflake", "databricks",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "ci/cd", "git", "linux", "bash", "rest", "graphql", "grpc",
    "agile", "scrum", "leadership", "mentoring", "communication",
]

EDU_RE = re.compile(
    r"\b(ph\.?d|doctorate|m\.?s\.?c?|master(?:'s)?|m\.?b\.?a|b\.?s\.?c?|"
    r"bachelor(?:'s)?|b\.?tech|m\.?tech|associate)\b",
    re.IGNORECASE,
)
YEARS_RE = re.compile(r"(\d{1,2})\+?\s*(?:\+\s*)?years?", re.IGNORECASE)
DATE_RANGE_RE = re.compile(
    r"(?P<start>\b(?:19|20)\d{2})\s*[-–to]+\s*(?P<end>\b(?:19|20)\d{2}|present|current)",
    re.IGNORECASE,
)
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_RE = re.compile(r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")


# ---------------------------------------------------------------------------
# Data containers
# ---------------------------------------------------------------------------

@dataclass
class ResumeMetadata:
    name: str
    email: str
    phone: str
    skills: List[str] = field(default_factory=list)
    years_experience: int = 0
    highest_education: str = ""
    source_path: str = ""

    def to_chroma(self) -> Dict[str, Any]:
        # Chroma metadata values must be primitives.
        return {
            "candidate_name": self.name,
            "email": self.email,
            "phone": self.phone,
            "skills": ", ".join(self.skills),
            "years_experience": int(self.years_experience),
            "highest_education": self.highest_education,
            "source_path": self.source_path,
        }


@dataclass
class Chunk:
    text: str
    section: str
    resume_id: str
    metadata: Dict[str, Any]


# ---------------------------------------------------------------------------
# File loading
# ---------------------------------------------------------------------------

def _read_text(path: Path) -> str:
    if _HAVE_M1:
        result = FileSystemTools.read_file(str(path))
        if result.get("success"):
            return result["content"] or ""
    # Fallback: read text directly.
    if path.suffix.lower() == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore")
    raise RuntimeError(
        f"Cannot read {path.suffix} without Milestone 1 file tools available."
    )


def load_resumes(resumes_dir: Path = RESUMES_DIR) -> List[Tuple[str, str]]:
    """Return list of (filepath, raw_text)."""
    if not resumes_dir.exists():
        raise FileNotFoundError(f"Resume directory not found: {resumes_dir}")
    resumes = []
    for path in sorted(resumes_dir.iterdir()):
        if path.suffix.lower() not in {".txt", ".pdf", ".docx"}:
            continue
        text = _read_text(path)
        if text.strip():
            resumes.append((str(path), text))
    return resumes


# ---------------------------------------------------------------------------
# Section-aware chunking
# ---------------------------------------------------------------------------

def _normalise_header(line: str) -> Optional[str]:
    candidate = line.strip().rstrip(":").lower()
    if not candidate or len(candidate) > 60:
        return None
    # Heuristic: section headers are usually short and uppercase or title-case.
    upper_ratio = sum(1 for c in line if c.isupper()) / max(1, sum(1 for c in line if c.isalpha()))
    if upper_ratio < 0.5 and not candidate.endswith(":"):
        # Fall through; we still allow exact alias match below.
        pass
    for canonical, aliases in SECTION_ALIASES.items():
        if candidate in aliases:
            return canonical
    return None


def split_into_sections(text: str) -> Dict[str, str]:
    """Split a resume into a dict of canonical_section -> text.

    Anything before the first detected header is filed as 'header'.
    Unknown headers are kept as 'other:<original>'.
    """
    sections: Dict[str, List[str]] = {"header": []}
    current = "header"
    for raw_line in text.splitlines():
        header = _normalise_header(raw_line)
        if header is not None:
            current = header
            sections.setdefault(current, [])
            continue
        sections.setdefault(current, []).append(raw_line)
    return {k: "\n".join(v).strip() for k, v in sections.items() if "\n".join(v).strip()}


def chunk_resume(
    resume_id: str,
    text: str,
    metadata: ResumeMetadata,
    max_chars: int = 1200,
) -> List[Chunk]:
    """Produce chunks per section. Long sections (Experience) are sub-chunked
    by paragraph so we do not blow past embedding context."""
    sections = split_into_sections(text)
    chunks: List[Chunk] = []
    base_meta = metadata.to_chroma()

    for section, body in sections.items():
        if not body:
            continue
        # Split very long sections by blank lines to keep chunks coherent.
        pieces = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        buffer = ""
        for piece in pieces:
            if len(buffer) + len(piece) + 1 <= max_chars:
                buffer = f"{buffer}\n{piece}".strip()
            else:
                if buffer:
                    chunks.append(Chunk(buffer, section, resume_id, {**base_meta, "section": section}))
                buffer = piece
        if buffer:
            chunks.append(Chunk(buffer, section, resume_id, {**base_meta, "section": section}))
    return chunks


# ---------------------------------------------------------------------------
# Metadata extraction
# ---------------------------------------------------------------------------

def _guess_name(text: str, fallback: str) -> str:
    # Use the first non-empty line that looks like a name (no @, mostly letters).
    for line in text.splitlines():
        line = line.strip()
        if not line or "@" in line or any(ch.isdigit() for ch in line):
            continue
        if 2 <= len(line.split()) <= 5 and len(line) <= 60:
            return line.title()
    return fallback


def _extract_skills(text: str) -> List[str]:
    lower = text.lower()
    found = []
    for skill in SKILL_VOCAB:
        # Word-boundary match for short tokens; substring for multi-word skills.
        if " " in skill or "/" in skill or "." in skill:
            if skill in lower:
                found.append(skill)
        else:
            if re.search(rf"\b{re.escape(skill)}\b", lower):
                found.append(skill)
    # De-duplicate while preserving order.
    seen, ordered = set(), []
    for s in found:
        if s not in seen:
            seen.add(s)
            ordered.append(s)
    return ordered


def _extract_years_experience(text: str) -> int:
    """Best of (a) explicit '7+ years' phrases and (b) sum of date ranges."""
    explicit = [int(m.group(1)) for m in YEARS_RE.finditer(text)]
    explicit_max = max(explicit) if explicit else 0

    spans = 0
    for m in DATE_RANGE_RE.finditer(text):
        start = int(m.group("start"))
        end_raw = m.group("end")
        end = 2026 if end_raw.lower() in {"present", "current"} else int(end_raw)
        spans += max(0, end - start)
    return max(explicit_max, spans)


def _extract_highest_education(text: str) -> str:
    order = ["phd", "doctorate", "master", "mba", "msc", "ms", "btech", "mtech",
             "bachelor", "bsc", "bs", "associate"]
    found = []
    for m in EDU_RE.finditer(text):
        token = m.group(1).lower().replace(".", "")
        found.append(token)
    if not found:
        return ""
    # Pick the most senior degree mentioned.
    for tier in order:
        for f in found:
            if tier in f:
                return tier.upper()
    return found[0].upper()


def extract_metadata(filepath: str, text: str) -> ResumeMetadata:
    fallback_name = Path(filepath).stem.replace("resume_", "").replace("_", " ").title()
    return ResumeMetadata(
        name=_guess_name(text, fallback_name),
        email=(EMAIL_RE.search(text) or [""])[0] if EMAIL_RE.search(text) else "",
        phone=(PHONE_RE.search(text) or [""])[0] if PHONE_RE.search(text) else "",
        skills=_extract_skills(text),
        years_experience=_extract_years_experience(text),
        highest_education=_extract_highest_education(text),
        source_path=filepath,
    )


# ---------------------------------------------------------------------------
# Embedding + vector store
# ---------------------------------------------------------------------------

class Embedder:
    """Thin wrapper so we can swap models without touching the pipeline."""

    def __init__(self, model_name: str = EMBED_MODEL_NAME):
        from sentence_transformers import SentenceTransformer  # local import for fast CLI startup
        self.model_name = model_name
        self._model = SentenceTransformer(model_name)

    def encode(self, texts: List[str]) -> List[List[float]]:
        vectors = self._model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        return [v.tolist() for v in vectors]


class ResumeRAG:
    """End-to-end ingestion pipeline backed by ChromaDB."""

    def __init__(
        self,
        db_dir: Path = DB_DIR,
        collection_name: str = COLLECTION_NAME,
        embed_model_name: str = EMBED_MODEL_NAME,
    ):
        import chromadb
        self.db_dir = Path(db_dir)
        self.db_dir.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(path=str(self.db_dir))
        self.collection_name = collection_name
        self.embedder = Embedder(embed_model_name)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    # -- ingestion ----------------------------------------------------------
    def reset(self) -> None:
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def build(self, resumes_dir: Path = RESUMES_DIR) -> Dict[str, Any]:
        """(Re)ingest every resume in `resumes_dir`. Returns a small report."""
        self.reset()
        resumes = load_resumes(resumes_dir)
        all_chunks: List[Chunk] = []
        candidates: List[ResumeMetadata] = []

        for path, text in resumes:
            meta = extract_metadata(path, text)
            candidates.append(meta)
            resume_id = Path(path).stem
            all_chunks.extend(chunk_resume(resume_id, text, meta))

        if not all_chunks:
            raise RuntimeError("No chunks produced — is the resumes/ folder empty?")

        ids = [f"{c.resume_id}::{c.section}::{i}" for i, c in enumerate(all_chunks)]
        documents = [c.text for c in all_chunks]
        metadatas = [c.metadata for c in all_chunks]

        t0 = time.perf_counter()
        embeddings = self.embedder.encode(documents)
        embed_seconds = time.perf_counter() - t0

        # Chroma can choke on very large single .add() calls; batch to be safe.
        BATCH = 256
        for start in range(0, len(ids), BATCH):
            end = start + BATCH
            self.collection.add(
                ids=ids[start:end],
                documents=documents[start:end],
                metadatas=metadatas[start:end],
                embeddings=embeddings[start:end],
            )

        return {
            "resumes_indexed": len(resumes),
            "chunks_indexed": len(all_chunks),
            "embed_seconds": round(embed_seconds, 3),
            "candidates": [asdict(c) for c in candidates],
        }

    # -- introspection ------------------------------------------------------
    def stats(self) -> Dict[str, Any]:
        count = self.collection.count()
        return {
            "collection": self.collection_name,
            "db_path": str(self.db_dir),
            "embedding_model": self.embedder.model_name,
            "total_chunks": count,
        }

    def inspect(self, candidate: str) -> List[Dict[str, Any]]:
        results = self.collection.get(where={"candidate_name": candidate})
        rows = []
        for i, doc in enumerate(results.get("documents", [])):
            md = results["metadatas"][i]
            rows.append({"section": md.get("section"), "preview": doc[:160], **md})
        return rows


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _cli() -> None:
    parser = argparse.ArgumentParser(description="Resume RAG ingestion pipeline.")
    parser.add_argument("--build", action="store_true", help="(Re)build the vector index.")
    parser.add_argument("--stats", action="store_true", help="Print collection stats.")
    parser.add_argument("--inspect", type=str, help="Dump chunks for a candidate name.")
    parser.add_argument("--resumes-dir", type=Path, default=RESUMES_DIR)
    args = parser.parse_args()

    rag = ResumeRAG()

    if args.build:
        report = rag.build(args.resumes_dir)
        print(json.dumps({k: v for k, v in report.items() if k != "candidates"}, indent=2))
        print(f"Indexed {len(report['candidates'])} candidates.")
    elif args.inspect:
        for row in rag.inspect(args.inspect):
            print(f"[{row['section']}] {row['preview']}")
    else:
        print(json.dumps(rag.stats(), indent=2))


if __name__ == "__main__":
    _cli()
