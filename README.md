# Task Manager API

Small Express-based REST API for managing tasks. Intended for learning and exercises.

## Features
- CRUD endpoints for tasks
- In-memory task store (no external DB)
- Tests included (tap + supertest)

## Requirements
- Node.js 18+ (macOS)

## Install
```bash
cd task-manager-api-Code-Sevak
npm install
```

## Run
```bash
npm run dev   # if a dev script exists (e.g. nodemon) or
node app.js
```
Default port: 3000

## API Endpoints
Base path: /tasks

- GET /tasks — list tasks
- GET /tasks/:id — get a task
- POST /tasks — create task
  - body: { "title": "...", "description": "...", "completed": false }
- PUT /tasks/:id — update task
- DELETE /tasks/:id — delete task

Response codes: 200, 201, 400, 404

## Project layout
- app.js — Express app / server
- routes/taskRoutes.js — task routes
- models/taskSchema.js — in-memory tasks
- test/ — tests
- task.json — sample data
- package.json — scripts & dependencies

## Notes / Next steps
- Replace in-memory store with a DB (Mongo/Postgres) for persistence.
- Add request validation and environment config for production.

License: ISC