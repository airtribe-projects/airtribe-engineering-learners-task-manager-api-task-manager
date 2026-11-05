# Resume RAG & Job Matching System (Milestone 2)

A retrieval-augmented system that ingests resumes, chunks them by section,
embeds the chunks into a local vector database, and ranks candidates against
a job description using hybrid (semantic + keyword) search. Ships with a
**FastAPI backend** and a **React (Vite) frontend**.

## Layout

```
resume_rag_system/
├── resume_rag.py           # Part A: ingestion, chunking, embedding, vector DB
├── job_matcher.py          # Part B: semantic + hybrid search, scoring, reasoning
├── generate_dataset.py     # Reproducible dataset generator (32 resumes, 6 JDs)
├── backend/                # FastAPI service wrapping the matcher
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── frontend/               # React + Vite single-page UI
│   ├── src/
│   ├── package.json
│   └── README.md
├── data/
│   ├── resumes/            # 32 plain-text resumes (dataset)
│   └── job_descriptions/   # 6 job descriptions (JSON)
├── notebooks/
│   └── experiments.ipynb   # Experimentation, metrics & analysis
├── requirements.txt
└── README.md
```

## Quick start (full stack)

```bash
# 1. Install core + backend deps
pip install -r requirements.txt
pip install -r backend/requirements.txt

# 2. Build the vector index from the resume dataset
python resume_rag.py --build

# 3. Start the API
cd backend && uvicorn main:app --reload --port 8000

# 4. In another terminal, start the UI
cd frontend && npm install && npm run dev
# open http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`, so no CORS
configuration is needed in development.

## CLI usage (no UI)

```bash
python resume_rag.py --build
python job_matcher.py --jd data/job_descriptions/jd_ml_engineer.json --top-k 10
python job_matcher.py --jd-text "Looking for a senior Python engineer with 5+ years..." --top-k 5
```

## Design

* **Embeddings:** `sentence-transformers/all-MiniLM-L6-v2` (384-d, local, no API key required).
  An OpenAI fallback is wired in but disabled by default.
* **Vector DB:** ChromaDB (persistent, local-disk).
* **Chunking:** Section-aware splitter (Summary, Skills, Experience, Education, Projects, …).
  Each chunk inherits resume-level metadata (name, total years of experience,
  education, top skills) so chunk hits can be aggregated per candidate and filtered.
* **Hybrid search:** Dense semantic retrieval is fused with BM25 keyword scoring on the
  must-have skills extracted from the JD. The final 0–100 score is a weighted blend.
* **Must-have filters:** Hard filters (e.g. `min_years=5`, required skills) are applied
  before ranking, so candidates that fail a non-negotiable are excluded entirely.

See `notebooks/experiments.ipynb` for retrieval accuracy on a labelled set,
latency measurements, and ablations (semantic-only vs hybrid).
