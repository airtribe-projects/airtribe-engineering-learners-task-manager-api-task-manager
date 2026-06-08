# Resume RAG — Frontend (React + Vite)

Single-page UI for the matcher. Talks to the FastAPI backend via the Vite
dev-proxy (`/api/*` → `http://localhost:8000`).

## Run

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Make sure the backend is running on port 8000 first:

```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

## Features

* **Match tab** — paste or load a saved JD, tweak must-have / nice-to-have
  skills, set hard filters (min years, min education), pick top-K and the
  semantic-vs-keyword blend, then run the matcher. Each result card shows the
  0–100 score, matched + missing skills, top excerpts, reasoning, and the
  underlying semantic / keyword sub-scores.
* **Candidates tab** — browse every indexed candidate with extracted
  metadata; click a row to preview the raw resume text.
* **Header stats** — chunk count, embedding-model name, and a one-click
  *Rebuild index* button that calls `POST /api/index/build`.
