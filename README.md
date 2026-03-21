# Task Manager API

A RESTful API for managing tasks, built with Node.js and Express. Tasks are stored in-memory and seeded from a JSON file on startup. Supports full CRUD operations, filtering by completion status, sorting, and priority levels.

## Task Schema

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "high"
}
```

| Field         | Type    | Required | Description                              |
|---------------|---------|----------|------------------------------------------|
| `id`          | number  | Auto     | Auto-generated unique identifier         |
| `title`       | string  | Yes      | Task title (must not be empty)           |
| `description` | string  | Yes      | Task description (must not be empty)     |
| `completed`   | boolean | Yes      | Whether the task is completed            |
| `priority`    | string  | No       | `low`, `medium`, or `high` (default: `medium`) |

## Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/airtribe-projects/task-manager-api-juvkha.git

cd task-manager-api-juvkha

# Install dependencies
npm install

# Start the server
node app.js
```

The server will start on **http://localhost:3000**.

### Running Tests

```bash
npm test
```

## API Endpoints

### GET /tasks

Retrieve all tasks. Supports optional query parameters for filtering and sorting.

**Query Parameters:**

| Parameter   | Values          | Description                        |
|-------------|-----------------|------------------------------------|
| `completed` | `true`, `false` | Filter tasks by completion status  |
| `sort`      | `asc`, `desc`   | Sort tasks by creation order       |

**Examples:**

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?completed=true

# Get incomplete tasks sorted newest first
curl "http://localhost:3000/tasks?completed=false&sort=desc"
```

**Response:** `200 OK` — Array of task objects.

---

### GET /tasks/:id

Retrieve a specific task by its ID.

```bash
curl http://localhost:3000/tasks/1
```

**Responses:**
- `200 OK` — The task object.
- `404 Not Found` — Task with the given ID does not exist.

---

### GET /tasks/priority/:level

Retrieve all tasks matching a priority level.

```bash
# Get high-priority tasks
curl http://localhost:3000/tasks/priority/high

# Get low-priority tasks
curl http://localhost:3000/tasks/priority/low
```

**Responses:**
- `200 OK` — Array of matching task objects.
- `400 Bad Request` — Invalid priority level (must be `low`, `medium`, or `high`).

---

### POST /tasks

Create a new task.

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task", "description": "Task details", "completed": false, "priority": "high"}'
```

**Request Body:**

| Field         | Type    | Required | Notes                                |
|---------------|---------|----------|--------------------------------------|
| `title`       | string  | Yes      |                                      |
| `description` | string  | Yes      |                                      |
| `completed`   | boolean | Yes      |                                      |
| `priority`    | string  | No       | Defaults to `medium` if not provided |

**Responses:**
- `201 Created` — The newly created task object (with auto-assigned `id`).
- `400 Bad Request` — Missing or invalid fields.

---

### PUT /tasks/:id

Update an existing task by its ID.

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task", "description": "Updated description", "completed": true, "priority": "low"}'
```

**Request Body:**

| Field         | Type    | Required | Notes                                      |
|---------------|---------|----------|--------------------------------------------|
| `title`       | string  | Yes      |                                            |
| `description` | string  | Yes      |                                            |
| `completed`   | boolean | Yes      | Must be a boolean, not a string            |
| `priority`    | string  | No       | If provided, must be `low`, `medium`, or `high` |

**Responses:**
- `200 OK` — The updated task object.
- `400 Bad Request` — Missing or invalid fields.
- `404 Not Found` — Task with the given ID does not exist.

---

### DELETE /tasks/:id

Delete a task by its ID.

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Responses:**
- `200 OK` — The deleted task object.
- `404 Not Found` — Task with the given ID does not exist.

## Error Handling

All error responses return JSON with an `error` field:

```json
{
  "error": "Task not found"
}
```

| Status Code | Condition                                      |
|-------------|------------------------------------------------|
| `400`       | Missing required fields or invalid data types  |
| `404`       | Task ID does not exist                         |
