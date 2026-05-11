# Task Manager API

A RESTful API built with Node.js and Express for managing tasks in memory.

---

## Overview

This API lets you create, read, update, and delete tasks. Tasks can be filtered by completion status or priority level, and are sorted by creation date. All data is held in memory and seeded from `task.json` on startup.

---

## Project Structure

```
task-manager-api-baigny/
├── server.js      # Entry point — starts the HTTP server
├── app.js         # Express setup and route mounting
├── routes.js      # All task route handlers
├── validate.js    # Input validation logic
├── task.json      # Seed data loaded into memory on startup
└── test/
    └── server.test.js
```

---

## Setup

```bash
npm install
node server.js
```

Server runs on `http://localhost:3000`

---

## Task Schema

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "high",
  "createdAt": "2026-04-01T09:00:00.000Z"
}
```

| Field       | Type    | Required | Notes                              |
|-------------|---------|----------|------------------------------------|
| `id`        | number  | auto     | Assigned automatically             |
| `title`     | string  | yes      | Must be a non-empty string         |
| `description` | string | yes    | Must be a non-empty string         |
| `completed` | boolean | yes      | Must be `true` or `false`          |
| `priority`  | string  | no       | `low`, `medium`, or `high` — defaults to `low` |
| `createdAt` | string  | auto     | ISO 8601 timestamp, set on creation |

---

## API Endpoints

### GET /tasks

Retrieve all tasks, sorted by creation date (oldest first).

**Query parameters:**

| Param       | Values          | Description                          |
|-------------|-----------------|--------------------------------------|
| `completed` | `true`, `false` | Filter tasks by completion status. Any other value returns `400`. |

**Responses:**
- `200` — array of tasks
- `400` — invalid `completed` value

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks?completed=true
curl http://localhost:3000/tasks?completed=false
```

---

### GET /tasks/:id

Retrieve a single task by ID.

**Responses:**
- `200` — task object
- `404` — task not found

```bash
curl http://localhost:3000/tasks/1
```

---

### POST /tasks

Create a new task.

**Request body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

- `title`, `description`, `completed` are required
- `priority` is optional, defaults to `low`

**Responses:**
- `201` — created task (includes `id` and `createdAt`)
- `400` — validation errors

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Do something","completed":false}'
```

---

### PUT /tasks/:id

Update an existing task. All fields are optional; only provided fields are changed.

**Request body:**
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "high"
}
```

**Responses:**
- `200` — updated task
- `400` — validation errors
- `404` — task not found

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

---

### DELETE /tasks/:id

Delete a task by ID.

**Responses:**
- `200` — the deleted task
- `404` — task not found

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

### GET /tasks/priority/:level

Retrieve all tasks matching a given priority level.

**Params:** `level` must be `low`, `medium`, or `high`

**Responses:**
- `200` — array of matching tasks
- `400` — invalid priority level

```bash
curl http://localhost:3000/tasks/priority/high
```

---

## Error Response Format

**Validation errors (400):**
```json
{
  "errors": {
    "title": "title is required",
    "completed": "completed must be a boolean"
  }
}
```

**Not found / bad param (404 / 400):**
```json
{ "error": "Task not found" }
```

---

## Testing

**Run the test suite:**
```bash
node test/server.test.js
```

**Test with Postman:**

Collection: [Task Manager API Collection](https://universal-sunset-220568.postman.co/workspace/Exploring-APIs~4290d2d8-ca86-4d7b-a7c6-115807f58037/collection/1081433-6b812845-0178-4fa8-81cb-816504f70746?action=share&creator=1081433)

1. Open Postman Desktop App (required for localhost)
2. Set base URL to `http://localhost:3000`
3. For POST and PUT requests: go to **Body** → **raw** → **JSON**, then paste the request body
