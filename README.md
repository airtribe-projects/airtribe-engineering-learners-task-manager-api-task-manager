# Task Manager (Assignment)

Simple Express-based Task Manager used for learning backend concepts.

## Overview

This project exposes a small REST API to manage tasks. Tasks are loaded from `Models/tasks.json` at startup and kept in memory for the running process. The API supports listing, filtering, sorting, creating, updating and deleting tasks.

Key points:
- Built with Express.
- Tests implemented with `tap` + `supertest` in `test/server.test.js`.
- Request logging middleware is included (`middleware/requestLogger.js`).
- Data source: `Models/tasks.json` (loaded on startup). Changes are applied in memory; the file is not overwritten by the API.

## Requirements

- Node.js >= 18
- npm

## Setup

1. Install dependencies

```cmd
npm install
```

2. Run development server (auto-restarts on file changes)

```cmd
npm run dev
```

This runs `nodemon app.js` and will start the server on port 3000.

3. Start normally

```cmd
node app.js
```

Or (equivalent) run `server.js` directly if present:

```cmd
node server.js
```

4. Run tests

```cmd
npm test
```

The tests use `tap` and `supertest` and exercise the API endpoints in `test/server.test.js`.

## API Endpoints

The public API is mounted under the `/api/v1/tasks` prefix. Examples and documentation below use `/api/v1/tasks`.

Default port: `3000` (http://localhost:3000)

### GET /api/v1/tasks

List all tasks. Supports optional query parameters:
- `completed` — `true` or `false`. If provided, filters tasks by completed status.
- `sortBy` — field name to sort by (e.g., `priority`, `createdDate`, `id`).
- `sortDirection` — `asc` (default) or `desc`.

Examples (Windows cmd):

Get all tasks:
```cmd
curl "http://localhost:3000/api/v1/tasks"
```

Get completed tasks sorted by priority descending:
```cmd
curl "http://localhost:3000/api/v1/tasks?completed=true&sortBy=priority&sortDirection=desc"
```

### GET /api/v1/tasks/:id

Get a single task by numeric id.

Example:
```cmd
curl "http://localhost:3000/api/v1/tasks/1"
```

Response: 200 with task object, or 404 if not found.

### POST /api/v1/tasks

Create a new task.

Required JSON body properties:
- `title` (string) — required, non-empty
- `description` (string) — required, non-empty
- `completed` (boolean) — optional but if provided must be boolean

On success: returns 201 with created task (the server assigns `id` and `createdDate`).

Example:
```cmd
curl -X POST "http://localhost:3000/api/v1/tasks" -H "Content-Type: application/json" -d "{\"title\":\"New Task\",\"description\":\"New Task Description\",\"completed\":false}"
```

Validation errors return 400 with a message.

### PUT /api/v1/tasks/:id

Update an existing task. Body may include any of the task properties; `completed` must be a boolean when provided.

Example:
```cmd
curl -X PUT "http://localhost:3000/api/v1/tasks/1" -H "Content-Type: application/json" -d "{\"title\":\"Updated\",\"description\":\"Updated desc\",\"completed\":true}"
```

Responses:
- 200 — updated task
- 400 — invalid data
- 404 — id not found

### DELETE /api/v1/tasks/:id

Delete a task by id.

Example:
```cmd
curl -X DELETE "http://localhost:3000/api/v1/tasks/1"
```

Responses:
- 200 — successful deletion (returns a message and removed task previously)
- 404 — id not found

## Data model

Tasks are stored in `Models/tasks.json` with structure:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true,
      "createdDate": "2025-11-15T00:00:00.000Z",
      "priority": "high"
    }
  ]
}
```

- `id`: number
- `title`: string
- `description`: string
- `completed`: boolean
- `createdDate`: ISO timestamp string (server-assigned for created tasks)
- `priority`: string ("low", "medium", or "high")

Note: The API currently mutates the `tasks` array in memory. If you need persistence across restarts, we can add file-write operations (fs.writeFile) to persist changes back to `Models/tasks.json`.

## Middleware

Logging is implemented with `pino` and `pino-http` for structured, fast request logs.

- The middleware at `middleware/requestLogger.js` is a `pino-http` instance and will
  attach a request-scoped logger at `req.log` for use in route handlers and services.

Usage notes:

- To run the app normally and see JSON-structured logs on stdout:

```cmd
node app.js
curl http://localhost:3000/
```

- For a human-friendly development view, install `pino-pretty` as a dev dependency and
  pipe the app output through it:

```cmd
npm install -D pino-pretty
node app.js | npx pino-pretty
```

- Example: logging inside a handler or service (request-scoped):

```js
// inside a route handler
req.log.info({ route: '/api/v1/tasks', action: 'list' }, 'listing tasks');
```

- If you need global, non-request-scoped logging (startup messages, background jobs),
  create a root pino logger and require it where needed. For request-scoped context,
  prefer `req.log` so logs include request metadata automatically.

If you want, I can:
- Migrate existing `console.log` calls in the codebase to use `req.log` or a pino root logger.
- Add a `dev` script that starts the app and pretty-prints logs automatically.

## Testing notes

- Tests live in `test/server.test.js`. They use `supertest` to call endpoints at `/tasks` (that's why the router is mounted at `/tasks` as well as `/api/v1/tasks`).

- Run a single test by name using tap's grep feature:

```cmd
npx tap -g "POST /tasks" test\server.test.js
```

Or temporary edit: change `tap.test` to `tap.test.only` for the test you want to run.

## Troubleshooting

- If `nodemon` prints `clean exit - waiting for changes` when running `nodemon app.js`, that means `app.js` exited without listening. Use `node app.js` (or `npm run dev`) — `app.js` starts the server only when it is run directly (not when required by tests).

- Ensure Node 18+ is used (the project `pretest` script enforces this).

## Next steps / Improvements

- Persist changes to `Models/tasks.json` when tasks are created/updated/deleted.
- Add validation schema (AJV or express-validator).
- Add pagination for large task lists.
- Add OpenAPI (Swagger) documentation.

---

If you want, I can:
- Add persistence (write updates back to `Models/tasks.json`).
- Add validation middleware.
- Add a `server.js` entry script and update `package.json` scripts (if you prefer that structure).

Tell me which improvement to implement next.