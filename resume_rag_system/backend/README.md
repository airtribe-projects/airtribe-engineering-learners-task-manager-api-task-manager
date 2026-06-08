# Resume RAG — Backend (FastAPI)

A thin FastAPI wrapper around the project-root `resume_rag.py` and
`job_matcher.py` modules. Reuses the same ChromaDB collection.

## Run

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The first call to any indexing endpoint will lazily download the
`all-MiniLM-L6-v2` embedding model (~90 MB).

## Endpoints

| Method | Path                              | Purpose                                |
| ------ | --------------------------------- | -------------------------------------- |
| GET    | `/api/health`                     | Liveness probe                         |
| GET    | `/api/index/stats`                | Vector-store stats                     |
| POST   | `/api/index/build`                | (Re)build the index from `data/resumes/` |
| GET    | `/api/candidates`                 | All candidates + metadata              |
| GET    | `/api/candidates/{name}/resume`   | Raw resume text for a candidate        |
| GET    | `/api/jds`                        | Saved job descriptions                 |
| POST   | `/api/match`                      | Run hybrid matching, return top-K      |

### `POST /api/match` payload

```json
{
  "title": "Senior ML Engineer",
  "description": "Looking for a Python engineer with PyTorch experience...",
  "must_have_skills": ["python", "pytorch", "transformers"],
  "nice_to_have_skills": ["langchain", "rag"],
  "min_years_experience": 5,
  "min_education": "BACHELOR",
  "top_k": 10,
  "semantic_weight": 0.65,
  "apply_hard_filters": true
}
```

Response matches the schema from the Milestone 2 brief: `top_matches` is a
list of `{candidate_name, resume_path, match_score, matched_skills,
relevant_excerpts, reasoning, ...}`.
