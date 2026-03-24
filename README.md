# Task Manager API

A RESTful API for managing tasks, built with Node.js and Express. This project is part of the Airtribe Backend Engineering Launchpad program.

## Features

- CRUD operations for tasks
- Filter tasks by completion status
- Sort tasks by creation date
- Task priority levels (low, medium, high)
- Filter tasks by priority level
- Input validation and error handling

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```

   The server will start on `http://localhost:3000`.

4. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### GET /tasks

Retrieve all tasks. Supports optional filtering and sorting.

**Query Parameters:**

| Parameter   | Type   | Description                          |
|-------------|--------|--------------------------------------|
| completed   | string | Filter by completion status (`true` or `false`) |
| sort        | string | Sort field (`createdAt`)             |
| order       | string | Sort order (`asc` or `desc`). Defaults to `asc` |

**Examples:**
```
GET /tasks
GET /tasks?completed=true
GET /tasks?completed=false
GET /tasks?sort=createdAt&order=desc
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "createdAt": "2026-02-24T09:00:00.000Z"
  }
]
```

### GET /tasks/:id

Retrieve a specific task by its ID.

**Example:**
```
GET /tasks/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "createdAt": "2026-02-24T09:00:00.000Z"
}
```

**Error:** `404 Not Found` if the task does not exist.

### GET /tasks/priority/:level

Retrieve tasks filtered by priority level.

**Parameters:** `level` - one of `low`, `medium`, `high`

**Example:**
```
GET /tasks/priority/high
```

**Response:** `200 OK` - Returns an array of tasks with the specified priority.

**Error:** `400 Bad Request` if the priority level is invalid.

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

| Field       | Type    | Required | Description                              |
|-------------|---------|----------|------------------------------------------|
| title       | string  | Yes      | Task title                               |
| description | string  | Yes      | Task description                         |
| completed   | boolean | Yes      | Completion status                        |
| priority    | string  | No       | Priority level (`low`, `medium`, `high`). Defaults to `low` |

**Response:** `201 Created`

**Error:** `400 Bad Request` if required fields are missing or priority is invalid.

### PUT /tasks/:id

Update an existing task by its ID.

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}
```

| Field       | Type    | Required | Description                              |
|-------------|---------|----------|------------------------------------------|
| title       | string  | Yes      | Task title                               |
| description | string  | Yes      | Task description                         |
| completed   | boolean | Yes      | Completion status                        |
| priority    | string  | No       | Priority level (`low`, `medium`, `high`) |

**Response:** `200 OK`

**Error:** `404 Not Found` if the task does not exist. `400 Bad Request` if input is invalid.

### DELETE /tasks/:id

Delete a task by its ID.

**Example:**
```
DELETE /tasks/1
```

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

**Error:** `404 Not Found` if the task does not exist.

## Testing the API

### Using Postman

1. Start the server with `node app.js`
2. Use the following base URL: `http://localhost:3000`
3. Set the request body type to **raw** and format to **JSON** for POST and PUT requests

### Using curl

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get completed tasks
curl http://localhost:3000/tasks?completed=true

# Sort by creation date (newest first)
curl "http://localhost:3000/tasks?sort=createdAt&order=desc"

# Get a single task
curl http://localhost:3000/tasks/1

# Get high priority tasks
curl http://localhost:3000/tasks/priority/high

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Description","completed":false,"priority":"high"}'

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated desc","completed":true,"priority":"medium"}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

### Automated Tests

```bash
npm test
```
