# Task Manager API

## Project Overview

A RESTful API built with Node.js and Express for managing tasks. This application provides full CRUD (Create, Read, Update, Delete) functionality for task management with the ability to filter tasks by their completion status. The API uses an in-memory data store and includes comprehensive validation and error handling.

## Setup Instructions

### Prerequisites

- Node.js version 18.0.0 or higher
- npm (Node Package Manager)

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-api-rahul43177
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:

For development mode with auto-reload:
```bash
npm run dev
```

For production mode:
```bash
npm start
```

The server will start on port 3000 and you will see:
```
Server is listening on 3000
```

## API Documentation

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieves all tasks from the database.

**Response:** Array of task objects.

**How to Test:**
```bash
curl http://localhost:3000/tasks
```

### 2. Filter Tasks by Completion Status

**Endpoint:** `GET /tasks?completed=<true|false>`

**Description:** Retrieves tasks filtered by their completion status.

**Query Parameters:**
- `completed`: Boolean value as string ("true" or "false")

**How to Test:**

Get all completed tasks:
```bash
curl http://localhost:3000/tasks?completed=true
```

Get all incomplete tasks:
```bash
curl http://localhost:3000/tasks?completed=false
```

### 3. Get Task by ID

**Endpoint:** `GET /tasks/:id`

**Description:** Retrieves a specific task by its ID.

**URL Parameters:**
- `id`: Task ID (integer)

**Response:** Single task object.

**How to Test:**
```bash
curl http://localhost:3000/tasks/1
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

### 4. Create New Task

**Endpoint:** `POST /tasks`

**Description:** Creates a new task with the provided information.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

**Required Fields:**
- `title`: String (cannot be empty or whitespace only)
- `description`: String (cannot be empty or whitespace only)
- `completed`: Boolean (optional, defaults to false)

**How to Test:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Complete Node.js tutorial","completed":false}'
```

**Expected Response:**
```json
{
  "status": true,
  "newData": {
    "id": 11,
    "title": "Learn Node.js",
    "description": "Complete Node.js tutorial",
    "completed": false
  },
  "entireData": [...]
}
```

### 5. Update Task

**Endpoint:** `PUT /tasks/:id`

**Description:** Updates an existing task by its ID.

**URL Parameters:**
- `id`: Task ID (integer)

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Required Fields:**
- `title`: String (cannot be empty)
- `description`: String (cannot be empty)
- `completed`: Boolean (required)

**How to Test:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated description","completed":true}'
```

**Expected Response:**
```json
{
  "status": true,
  "message": "The task updated successfully",
  "entireUpdatedTaskList": [...]
}
```

### 6. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Description:** Deletes a task by its ID.

**URL Parameters:**
- `id`: Task ID (integer)

**How to Test:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Expected Response:**
```json
{
  "status": true,
  "message": "The task with id = 1 has been deleted.",
  "originalTaskLength": 10,
  "newTaskLength": 9,
  "deletedRecordsCount": 1,
  "deletedTask": {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
}
```

## Error Responses

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request:** Missing required fields, invalid data format, or empty values
- **404 Not Found:** Task with the specified ID does not exist
- **500 Internal Server Error:** Unexpected server errors

**Example Error Response:**
```json
{
  "status": false,
  "message": "Title and Description are required fields"
}
```

## Testing the API

Run the automated test suite:
```bash
npm test
```

The test suite uses Supertest and Tap to verify all API endpoints and error handling.

## Project Structure

```
task-manager-api-rahul43177/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies and scripts
├── controller/
│   └── taskManagerController.js    # Business logic for task operations
├── model/
│   └── taskManagerDatabase.js      # In-memory data storage
├── routes/
│   └── taskManagerRouter.js        # API route definitions
└── test/
    └── server.test.js              # Test cases
```

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Supertest**: HTTP testing library
- **Tap**: Test framework
