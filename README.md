# Task Manager API

A simple yet powerful RESTful API for managing tasks with features like filtering, sorting, and priority-based organization.

## Features

- ✅ CRUD operations for tasks
- 🎯 Priority levels (low, medium, high)
- 📅 Automatic timestamp tracking
- 🔍 Filter tasks by completion status
- 📊 Sort tasks by creation date
- 🏷️ Retrieve tasks by priority level
- ✔️ Input validation and error handling

## Installation

### Prerequisites

- Node.js (v12 or higher)
- npm

### Setup

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Get All Tasks

**Request:**

```
GET /tasks
```

**Query Parameters:**

- `completed` (optional): Filter by completion status (`true` or `false`)

**Example:**

```bash
GET /tasks
GET /tasks?completed=true
GET /tasks?completed=false
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Create a new project",
      "description": "Create a new project using Magic",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-06-12T10:30:00.000Z"
    }
  ],
  "message": "Tasks fetched successfully"
}
```

### Get Task by ID

**Request:**

```
GET /tasks/:id
```

**Example:**

```bash
GET /tasks/1
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "title": "Create a new project",
    "description": "Create a new project using Magic",
    "completed": false,
    "priority": "medium",
    "createdAt": "2026-06-12T10:30:00.000Z"
  },
  "message": "Task fetched successfully"
}
```

### Get Tasks by Priority

**Request:**

```
GET /tasks/priority/:level
```

**Parameters:**

- `level`: Priority level (`low`, `medium`, or `high`)

**Example:**

```bash
GET /tasks/priority/high
GET /tasks/priority/medium
GET /tasks/priority/low
```

**Response:**

```json
{
  "data": [
    {
      "id": 2,
      "title": "Important task",
      "description": "Complete this urgently",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-06-12T11:00:00.000Z"
    }
  ],
  "message": "Tasks with high priority fetched successfully"
}
```

### Create a Task

**Request:**

```
POST /tasks
```

**Request Body:**

```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

**Required Fields:**

- `title` (string, 1-100 characters)
- `description` (string, 1-500 characters)

**Optional Fields:**

- `completed` (boolean, defaults to `false`)
- `priority` (string: `low`, `medium`, or `high`, defaults to `medium`)

**Example:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design API",
    "description": "Design the REST API for the task manager",
    "completed": false,
    "priority": "high"
  }'
```

**Response:**

```json
{
  "data": {
    "id": 3,
    "title": "Design API",
    "description": "Design the REST API for the task manager",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-06-12T12:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Update a Task

**Request:**

```
PUT /tasks/:id
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true,
  "priority": "low"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Example:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "high"
  }'
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "title": "Create a new project",
    "description": "Create a new project using Magic",
    "completed": true,
    "priority": "high",
    "createdAt": "2026-06-12T10:30:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Delete a Task

**Request:**

```
DELETE /tasks/:id
```

**Example:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:**

```json
{
  "message": "Task deleted successfully"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### 400 Bad Request

- Missing required fields
- Invalid data types
- Invalid ID format
- Unknown fields in request body

**Example Response:**

```json
{
  "message": "Validation failed",
  "errors": ["title is required", "priority must be one of: low, medium, high"]
}
```

### 404 Not Found

- Task ID doesn't exist
- No tasks found with given filters

**Example Response:**

```json
{
  "message": "Task with id 999 not found"
}
```

### 500 Internal Server Error

- Server-side error

**Example Response:**

```json
{
  "message": "Internal server error"
}
```

## Usage Examples

### Create a high-priority task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Urgent Bug Fix",
    "description": "Fix critical production bug",
    "priority": "high"
  }'
```

### Get all incomplete tasks

```bash
curl http://localhost:3000/tasks?completed=false
```

### Get all completed tasks

```bash
curl http://localhost:3000/tasks?completed=true
```

### Get all high-priority tasks

```bash
curl http://localhost:3000/tasks/priority/high
```

### Update a task to completed

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a task

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Project Structure

```
task-manager-api/
├── app.js           # Main application file
├── package.json     # Project dependencies and scripts
├── README.md        # This file
└── test/
    └── server.test.js  # Test file
```

## Scripts

- `npm run dev` - Start the development server
- `npm test` - Run tests (if available)

## Validation Rules

### Title

- Required for POST requests
- Must be a non-empty string
- Maximum 100 characters
- Automatically trimmed

### Description

- Required for POST requests
- Must be a non-empty string
- Maximum 500 characters
- Automatically trimmed

### Completed

- Must be a boolean (`true` or `false`)
- Defaults to `false` for new tasks

### Priority

- Must be one of: `low`, `medium`, `high`
- Defaults to `medium` for new tasks
- Can be updated via PUT requests

### ID

- Must be a positive integer
- Auto-generated for new tasks

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Body Parser:** Express built-in JSON parser

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
