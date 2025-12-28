# Task Manager API

A RESTful API for managing tasks built with Node.js and Express.js. This API allows you to create, read, update, and delete tasks with support for task priorities and filtering.

## Overview

The Task Manager API provides endpoints to manage a collection of tasks. Each task has a title, description, completion status, priority level, and creation date. The API supports filtering tasks by priority and sorting them by creation date.

### Features

- Create, read, update, and delete tasks
- Task prioritization (low, medium, high)
- Filter tasks by priority
- Sort tasks by creation date
- Input validation and error handling
- In-memory data storage

## Setup Instructions

### Prerequisites

- Node.js version 18.0.0 or higher
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager-api-Vivek-varadharaj
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. The server will start on port 9000. You should see:
   ```
   Server is listening on 9000
   ```

### Running Tests

To run the test suite:
```bash
npm test
```

## API Endpoints

Base URL: `http://localhost:9000/api/v1/tasks`

All endpoints return JSON responses.

### 1. Get All Tasks

Retrieve a list of all tasks with optional filtering and sorting.

**Endpoint:** `GET /api/v1/tasks`

**Query Parameters:**
- `priority` (optional): Filter tasks by priority (`low`, `medium`, `high`)
- `sort` (optional): Sort tasks by creation date (`createdDate` for ascending, `createdDate_desc` for descending)

**Example Request:**
```bash
curl http://localhost:9000/api/v1/tasks
```

**Example Request with Filters:**
```bash
# Filter by priority
curl http://localhost:9000/api/v1/tasks?priority=high

# Sort by creation date (ascending)
curl http://localhost:9000/api/v1/tasks?sort=createdDate

# Sort by creation date (descending)
curl http://localhost:9000/api/v1/tasks?sort=createdDate_desc

# Combine filters
curl http://localhost:9000/api/v1/tasks?priority=medium&sort=createdDate_desc
```

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "completed": false,
      "priority": "medium",
      "createdDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Task by ID

Retrieve a specific task by its ID.

**Endpoint:** `GET /api/v1/tasks/:id`

**Path Parameters:**
- `id` (required): The ID of the task (integer)

**Example Request:**
```bash
curl http://localhost:9000/api/v1/tasks/1
```

**Response (200 OK):**
```json
{
  "task": {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "completed": false,
    "priority": "medium",
    "createdDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task with id 999 not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Invalid task ID"
}
```

### 3. Create Task

Create a new task.

**Endpoint:** `POST /api/v1/tasks`

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "priority": "medium"
}
```

**Fields:**
- `title` (required): The title of the task (string, non-empty)
- `description` (required): The description of the task (string, non-empty)
- `priority` (optional): The priority level (`low`, `medium`, `high`). Defaults to `medium` if not provided.

**Example Request:**
```bash
curl -X POST http://localhost:9000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "priority": "high"
  }'
```

**Response (201 Created):**
```json
{
  "task": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "completed": false,
    "priority": "high",
    "createdDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Title is required and must be a non-empty string"
}
```

### 4. Update Task

Update an existing task. All fields are optional - only provide the fields you want to update.

**Endpoint:** `PUT /api/v1/tasks/:id`

**Path Parameters:**
- `id` (required): The ID of the task to update (integer)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true,
  "taskPriority": "high"
}
```

**Fields (all optional):**
- `title`: Updated title (string, non-empty)
- `description`: Updated description (string, non-empty)
- `completed`: Completion status (boolean)
- `taskPriority`: Updated priority level (`low`, `medium`, `high`)

**Note:** At least one field must be provided.

**Example Request:**
```bash
curl -X PUT http://localhost:9000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "completed": true,
    "taskPriority": "high"
  }'
```

**Response (200 OK):**
```json
{
  "task": {
    "id": 1,
    "title": "Updated Task Title",
    "description": "Task Description",
    "completed": true,
    "priority": "high",
    "createdDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task with id 999 not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "At least one field (title, description, completed) must be provided"
}
```

### 5. Delete Task

Delete a task by its ID.

**Endpoint:** `DELETE /api/v1/tasks/:id`

**Path Parameters:**
- `id` (required): The ID of the task to delete (integer)

**Example Request:**
```bash
curl -X DELETE http://localhost:9000/api/v1/tasks/1
```

**Response (204 No Content):**
No response body.

**Error Response (404 Not Found):**
```json
{
  "message": "Task with id 999 not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Invalid task ID"
}
```

## Task Model

A task object has the following structure:

```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false,
  "priority": "medium",
  "createdDate": "2024-01-15T10:30:00.000Z"
}
```

**Fields:**
- `id` (number): Unique identifier for the task (auto-generated)
- `title` (string): The title of the task
- `description` (string): Detailed description of the task
- `completed` (boolean): Whether the task is completed (default: `false`)
- `priority` (string): Priority level - `low`, `medium`, or `high` (default: `medium`)
- `createdDate` (ISO 8601 date string): Timestamp when the task was created

## Testing the API

### Using cURL

All the examples above use cURL commands. Make sure the server is running before testing.

### Using Postman or Insomnia

1. Import the following requests:
   - **GET** `http://localhost:9000/api/v1/tasks`
   - **GET** `http://localhost:9000/api/v1/tasks/1`
   - **POST** `http://localhost:9000/api/v1/tasks`
   - **PUT** `http://localhost:9000/api/v1/tasks/1`
   - **DELETE** `http://localhost:9000/api/v1/tasks/1`

2. For POST and PUT requests, set the `Content-Type` header to `application/json` and include the appropriate JSON body.

### Using HTTP Client Libraries

#### JavaScript (Fetch API)
```javascript
// Get all tasks
fetch('http://localhost:9000/api/v1/tasks')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a task
fetch('http://localhost:9000/api/v1/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task Description',
    priority: 'high'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Python (requests)
```python
import requests

# Get all tasks
response = requests.get('http://localhost:9000/api/v1/tasks')
print(response.json())

# Create a task
response = requests.post(
    'http://localhost:9000/api/v1/tasks',
    json={
        'title': 'New Task',
        'description': 'Task Description',
        'priority': 'high'
    }
)
print(response.json())
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200 OK**: Successful GET or PUT request
- **201 Created**: Successful POST request
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid input or validation error
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

All error responses include a JSON object with a `message` field describing the error.

## Notes

- The API uses in-memory storage, so all data will be lost when the server restarts.
- Task IDs are auto-incremented starting from 1.
- The `createdDate` field is automatically set when a task is created.
- When updating a task, only provide the fields you want to change (partial updates are supported).

