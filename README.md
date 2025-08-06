# Task Manager API

A simple REST API for managing tasks built with Express.js and Node.js.

## Task Completion Summary

This project was updated to implement a complete CRUD (Create, Read, Update, Delete) API for task management that passes all test requirements.

### What Was Implemented

**Original State:** The application was just a basic Express.js server setup with no endpoints or functionality.

**Completed Implementation:** Built a complete CRUD API from scratch with the following endpoints:

1. **GET /tasks** - Retrieve all tasks
   - Returns `200` with array of all tasks

2. **POST /tasks** - Create a new task
   - Validates required fields (`title`, `description`)
   - Returns `201` with created task
   - Returns `400` for invalid data

3. **GET /tasks/:id** - Retrieve a specific task by ID
   - Returns `404` if task not found
   - Returns `200` with task data if found

4. **PUT /tasks/:id** - Update an existing task
   - Validates required fields (`title`, `description`)
   - Validates data types (`completed` must be boolean)
   - Returns `404` if task not found
   - Returns `400` for invalid data
   - Returns `200` with updated task on success

5. **DELETE /tasks/:id** - Delete a task
   - Returns `404` if task not found
   - Returns `200` with deleted task data on success

### API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/tasks` | Get all tasks | 200 |
| POST | `/tasks` | Create new task | 201, 400 |
| GET | `/tasks/:id` | Get task by ID | 200, 404 |
| PUT | `/tasks/:id` | Update task by ID | 200, 400, 404 |
| DELETE | `/tasks/:id` | Delete task by ID | 200, 404 |

### Task Data Structure

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

### Validation Rules

- **POST/PUT**: `title` and `description` are required
- **PUT**: `completed` must be a boolean value
- **All ID operations**: Returns 404 for non-existent task IDs

### Test Results

✅ **All 19 test assertions passed**
- POST /tasks (with validation)
- GET /tasks (all tasks)
- GET /tasks/:id (with 404 handling)
- PUT /tasks/:id (with validation and 404 handling)  
- DELETE /tasks/:id (with 404 handling)

### Running the Application

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start server
npm start
```

The server runs on port 3000 and uses in-memory data storage with initial data loaded from `task.json`.
