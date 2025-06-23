# Task Management API

A RESTful API for managing tasks built with Node.js and Express.js. This API allows you to create, read, update, and delete tasks, with powerful filtering capabilities.

## Features

- CRUD operations for tasks
- Data persistence using JSON file storage
- Input validation
- Filtering capabilities:
  - Filter by title (case-insensitive)
  - Filter by description (case-insensitive)
  - Filter by completion status
  - Combine multiple filters

## API Endpoints

### GET /tasks
Get all tasks with optional filtering.

Query Parameters:
- `title` - Filter tasks by title (case-insensitive partial match)
- `description` - Filter tasks by description (case-insensitive partial match)
- `completed` - Filter tasks by completion status (true/false)

Example:
```
GET /tasks?title=project&completed=true
```

### GET /tasks/:id
Get a specific task by ID.

### POST /tasks
Create a new task.

Required body:
```json
{
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

### PUT /tasks/:id
Update an existing task.

Required body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### DELETE /tasks/:id
Delete a task by ID.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node app.js
   ```
   The server will start on port 3000.

## Testing

Run the test suite:
```bash
npm test
```

## Data Validation

The API includes validation for:
- Required fields
- Data types
- Empty values

## Error Handling

The API provides appropriate error responses for:
- Invalid requests
- Not found resources
- Server errors

## Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found