# Task Manager API

## Overview

A RESTful API for managing tasks built with Node.js and Express.js. This API provides endpoints to create, read, update, and delete tasks, along with filtering capabilities by priority, completion status, and creation date.

## Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-api-immoksh
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node app.js
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/tasks
```

### 1. Get All Tasks
**GET** `/tasks`

Query Parameters (optional):
- `priority`: Filter by priority (e.g., "low", "medium", "high")
- `completed`: Filter by completion status (true/false)
- `createdAt`: Filter by creation date (format: "YYYY-MM-DD")

**Example Requests:**
```bash
GET /tasks
GET /tasks?priority=high
GET /tasks?completed=true
GET /tasks?createdAt=2026-01-25
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "low",
    "createdAt": "2026-01-25"
  }
]
```

### 2. Get Task by ID
**GET** `/tasks/:id`

**Example Request:**
```bash
GET /tasks/1
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "low",
  "createdAt": "2026-01-25"
}
```

**Error Response (404):**
```json
{
  "message": "Task not found"
}
```

### 3. Get Tasks by Priority
**GET** `/tasks/priority/:priority`

**Example Request:**
```bash
GET /tasks/priority/high
```

**Response:**
```json
[
  {
    "id": 2,
    "title": "Create a new project",
    "description": "Create a new project with a new place",
    "completed": true,
    "priority": "high",
    "createdAt": "2026-02-02"
  }
]
```

### 4. Create a New Task
**POST** `/tasks`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "New Task Description",
  "completed": false
}
```

**Required Fields:**
- `title` (string): Task title
- `description` (string): Task description
- `completed` (boolean): Completion status

**Response (201):**
```json
{
  "id": 4,
  "title": "New Task",
  "description": "New Task Description",
  "completed": false
}
```

**Error Response (400):**
```json
{
  "message": "Missing required fields: title, description, and completed are required"
}
```
or
```json
{
  "message": "Invalid data types: title and description must be strings, completed must be a boolean"
}
```

### 5. Update a Task
**PUT** `/tasks/:id`

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated Task Description",
  "completed": true
}
```

**Required Fields:**
- `title` (string): Task title
- `description` (string): Task description
- `completed` (boolean): Completion status

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated Task Description",
  "completed": true,
  "priority": "low",
  "createdAt": "2026-01-25"
}
```

**Error Responses:**
- **404**: Task not found
- **400**: Missing required fields or invalid data types

### 6. Delete a Task
**DELETE** `/tasks/:id`

**Example Request:**
```bash
DELETE /tasks/1
```

**Response (200):**
```json
{
  "message": "Task deleted"
}
```

**Error Response (404):**
```json
{
  "message": "Task not found"
}
```

## How to Test the API

### Running Automated Tests

Run the test suite:
```bash
npm test
```

This will execute all tests defined in the `test/server.test.js` file.

### Manual Testing with Postman or Similar Tools

1. Import the endpoints into Postman
2. Set the base URL to `http://localhost:3000/tasks`
3. Test each endpoint with the appropriate HTTP method and request body (for POST and PUT requests)
