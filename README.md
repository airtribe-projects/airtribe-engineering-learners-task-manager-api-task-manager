# Task Manager API

A RESTful API for managing tasks with advanced filtering, sorting, and priority features.

## Overview

This Task Manager API provides a complete solution for task management with the following capabilities:

- **CRUD Operations**: Create, read, update, and delete tasks
- **Advanced Filtering**: Filter tasks by completion status and priority level
- **Sorting**: Sort tasks by creation date in ascending or descending order
- **Priority Management**: Support for low, medium, and high priority levels
- **Data Validation**: Robust input validation using Zod schemas
- **Error Handling**: Comprehensive error handling with meaningful messages

## Features

### Core Features
- ✅ CRUD operations for tasks
- ✅ Task validation using Zod
- ✅ Error handling middleware
- ✅ Priority levels (low, medium, high)
- ✅ Creation date tracking
- ✅ Completion status tracking

### Advanced Features
- ✅ Filter tasks by completion status
- ✅ Sort tasks by creation date
- ✅ Filter tasks by priority level
- ✅ Support for priority in task creation and updates

## Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone or navigate to the project directory:**
```bash
cd task-manager-api-nik-1207
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run tests:**
```bash
npm test
```

## API Endpoints

### GET /tasks
Retrieve all tasks with optional filtering and sorting.

**Query Parameters:**
- `completed` (boolean): Filter by completion status
  - `?completed=true` - Get only completed tasks
  - `?completed=false` - Get only pending tasks
- `sortBy` (string): Sort field (currently supports 'createdAt')
- `sortOrder` (string): Sort order ('asc' or 'desc')

**Examples:**
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?completed=true

# Get tasks sorted by creation date (newest first)
curl http://localhost:3000/tasks?sortBy=createdAt&sortOrder=desc

# Get completed tasks sorted by creation date
curl http://localhost:3000/tasks?completed=true&sortBy=createdAt&sortOrder=asc
```

### GET /tasks/priority/:level
Retrieve tasks by priority level.

**Path Parameters:**
- `level` (string): Priority level ('low', 'medium', 'high')

**Examples:**
```bash
# Get high priority tasks
curl http://localhost:3000/tasks/priority/high

# Get medium priority tasks
curl http://localhost:3000/tasks/priority/medium

# Get low priority tasks
curl http://localhost:3000/tasks/priority/low
```

### GET /tasks/:id
Retrieve a specific task by ID.

**Path Parameters:**
- `id` (number): Task ID

**Example:**
```bash
# Get task with ID 1
curl http://localhost:3000/tasks/1
```

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

**Priority Options:**
- `"low"` - Low priority
- `"medium"` - Medium priority (default)
- `"high"` - High priority

**Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "This is a new task",
    "priority": "high",
    "completed": false
  }'
```

### PUT /tasks/:id
Update an existing task.

**Path Parameters:**
- `id` (number): Task ID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "This task has been updated",
    "priority": "medium",
    "completed": true
  }'
```

### DELETE /tasks/:id
Delete a task.

**Path Parameters:**
- `id` (number): Task ID

**Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Testing the API

### Using curl

1. **Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

2. **Filter by completion status:**
```bash
# Get completed tasks
curl http://localhost:3000/tasks?completed=true

# Get pending tasks
curl http://localhost:3000/tasks?completed=false
```

3. **Sort by creation date:**
```bash
# Newest first
curl http://localhost:3000/tasks?sortBy=createdAt&sortOrder=desc

# Oldest first
curl http://localhost:3000/tasks?sortBy=createdAt&sortOrder=asc
```

4. **Get tasks by priority:**
```bash
curl http://localhost:3000/tasks/priority/high
curl http://localhost:3000/tasks/priority/medium
curl http://localhost:3000/tasks/priority/low
```

5. **Create a new task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "high"
  }'
```

6. **Update a task:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true,
    "priority": "medium"
  }'
```

7. **Delete a task:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Task Schema

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
task-manager-api-nik-1207/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── task.json             # Initial task data
├── test-features.js      # Feature demonstration script
├── README.md             # This documentation
├── src/
│   ├── controllers/      # Route controllers
│   │   └── task.js      # Task route handlers
│   ├── dao/             # Data Access Objects
│   │   └── tasks.js     # Task data access layer
│   ├── database/        # Database layer
│   │   └── index.js     # In-memory database
│   ├── dto/            # Data Transfer Objects
│   │   └── tasks.js    # Task validation schemas
│   ├── middleware/      # Express middleware
│   │   ├── post.js     # POST request validation
│   │   └── task.js     # Error handling middleware
│   └── services/       # Business logic layer
│       └── task.js     # Task business logic
└── test/               # Test files
    └── server.test.js  # API tests
```

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Zod** - Schema validation
- **http-errors** - HTTP error handling
- **tap** - Testing framework

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request** - Invalid input data (e.g., invalid priority level)
- **404 Not Found** - Task not found
- **500 Internal Server Error** - Server errors

All errors return a consistent format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Development

### Running Tests

```bash
npm test
```

### Available Scripts
- `npm test` - Run all tests
