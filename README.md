# Task Manager API

A simple Node.js and Express-based REST API for managing tasks. This project demonstrates CRUD operations, input validation, filtering, sorting, and priority management using an in-memory data store.

## Features
- Create, read, update, and delete tasks
- Filter tasks by completion status
- Sort tasks by creation date
- Assign and filter tasks by priority (low, medium, high)
- Input validation and error handling

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd task-manager-api-Sathya-94
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the server**
   ```sh
   node app.js
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints

### GET /
- **Description:** Health check endpoint.
- **Response:** `Task Manager API!`

### GET /tasks
- **Description:** Retrieve all tasks.
- **Query Parameters:**
  - `completed` (optional): `true` or `false` to filter by completion status.
- **Response:** Array of task objects, sorted by creation date (newest first).
- **Example:**
  ```sh
  curl http://localhost:3000/tasks
  curl http://localhost:3000/tasks?completed=true
  ```

### GET /tasks/:id
- **Description:** Retrieve a specific task by its ID.
- **Response:** Task object or 404 if not found.
- **Example:**
  ```sh
  curl http://localhost:3000/tasks/1
  ```

### GET /tasks/priority/:level
- **Description:** Retrieve tasks by priority (`low`, `medium`, `high`).
- **Response:** Array of task objects with the specified priority.
- **Example:**
  ```sh
  curl http://localhost:3000/tasks/priority/high
  ```

### POST /tasks
- **Description:** Create a new task.
- **Request Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "medium"
  }
  ```
- **Response:** The created task object.
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"New Task","description":"Details","completed":false,"priority":"high"}'
  ```

### PUT /tasks/:id
- **Description:** Update an existing task by its ID.
- **Request Body:** Same as POST /tasks.
- **Response:** The updated task object or 404 if not found.
- **Example:**
  ```sh
  curl -X PUT http://localhost:3000/tasks/1 \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Task","description":"Updated details","completed":true,"priority":"low"}'
  ```

### DELETE /tasks/:id
- **Description:** Delete a task by its ID.
- **Response:** The deleted task object or 404 if not found.
- **Example:**
  ```sh
  curl -X DELETE http://localhost:3000/tasks/1
  ```

## Notes
- All data is stored in-memory and will reset when the server restarts.
- Ensure the `priority` field is one of: `low`, `medium`, `high`.
- All endpoints return JSON responses.

---
