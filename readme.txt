# Task Manager API — Changes Made

This file summarizes the changes applied to the project so tests can run and what to check next.

## Summary of changes
- controller/task.js
  - Normalizes IDs to integer numbers on read and write.
  - Ensures new task IDs are generated as integer (max existing id + 1).
  - Validates `title`, `description`, and `completed` types.
  - Returns consistent response shapes and numeric `id` values.
  - Adds proper error handling (500 responses on unexpected errors).

- routes/task.js
  - Exports an Express router (module.exports = router).
  - Defines routes without a `/tasks` prefix (router root), so mounting at `/tasks` in app.js is correct.

- app.js
  - Exports the Express app.
  - Mounts the tasks router at `/tasks`: `app.use('/tasks', require('./routes/task'));`
  - Uses `express.json()` for JSON body parsing.

- task.json
  - Ensure a `task.json` file exists at project root and contains at least the initial task with numeric `id: 1` required by tests. Example:
    [
        {
            "id": 1,
            "title": "New Task",
            "description": "New Task Description",
            "completed": false
        }
    ]

- test/server.test.js
  - Tests expect:
    - POST /tasks returns 201 for valid data and 400 for invalid.
    - GET /tasks returns an array with numeric ids and correct types.
    - GET /tasks/1 returns the created/expected task.
    - PUT/DELETE endpoints return proper status codes.
  - Tests are unchanged; controller behavior was adapted to satisfy them.

## Important behavior guarantees
- IDs are always numeric integers in memory and when written to disk.
- GET /tasks returns an array of tasks (each task has id:number, title:string, description:string, completed:boolean).
- POST /tasks returns the created task with numeric id and status 201.
- PUT/DELETE handlers respond with 404 for missing ids and 400 for invalid input types.

## How to run tests (Windows / PowerShell)
1. Install dependencies:
   npm install
2. Run tests:
   npm test

## Troubleshooting checklist
- Confirm `routes/task.js` exports `router`.
- Confirm `app.js` uses `app.use('/tasks', require('./routes/task'))`.
- Confirm `controller/task.js` reads/writes `task.json` at project root (path: `path.join(__dirname, '..', 'task.json')`).
- Confirm `task.json` exists and contains an initial task with numeric id 1 (tests rely on id 1).
- If tests still fail, run `npm test` and paste the failing output along with current files:
  - app.js
  - routes/task.js
  - controller/task.js
  - task.json
