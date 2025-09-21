# Task Manager API - TypeScript

A comprehensive RESTful API for managing tasks, built with Node.js, Express, and TypeScript. This API provides full CRUD operations for task management with advanced features like filtering, sorting, and priority-based task organization.

## Project Overview

This Task Manager API is designed as a backend service for task management applications. It provides a robust foundation for building todo apps, project management tools, or any application requiring task tracking capabilities.

### Key Features

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Priority Management**: Tasks can have low, medium, or high priority levels
- **Advanced Filtering**: Filter tasks by completion status and priority
- **Sorting Options**: Sort tasks by creation date in ascending or descending order
- **TypeScript**: Fully typed for better development experience and code reliability
- **RESTful Design**: Follows REST principles for intuitive API usage
- **Error Handling**: Comprehensive error handling with meaningful responses
- **Input Validation**: Robust validation for all input parameters

### Architecture

The project follows a clean, layered architecture:

```
┌─────────────────┐
│   Controllers   │ ← Handle HTTP requests/responses
├─────────────────┤
│    Services     │ ← Business logic layer
├─────────────────┤
│      Data       │ ← Data management layer
├─────────────────┤
│      Types      │ ← TypeScript definitions
└─────────────────┘
```

## 📁 Project Structure

```
src/
├── types/           # TypeScript interfaces and types
│   └── Task.ts      # Task-related type definitions
├── data/            # Data layer
│   └── tasks.ts     # Task data and initial tasks
├── services/        # Business logic layer
│   └── taskService.ts # Task service with CRUD operations
├── controllers/     # Request/response handling
│   └── taskController.ts # Task controller functions
├── routes/          # Route definitions
│   ├── index.ts     # Main router
│   └── taskRoutes.ts # Task-specific routes
└── app.ts           # Express application setup
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}
```

### Task Model

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}
```

## 🔗 API Endpoints

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieve all tasks with optional filtering and sorting.

**Query Parameters:**
- `completed` (boolean, optional): Filter by completion status
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`)
- `sortBy` (string, optional): Sort field (currently only `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/tasks?completed=false&priority=high&sortBy=createdAt&sortOrder=desc"
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Tasks by Priority

**Endpoint:** `GET /tasks/priority/:level`

**Description:** Retrieve all tasks with a specific priority level.

**Path Parameters:**
- `level` (string, required): Priority level (`low`, `medium`, `high`)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/tasks/priority/high"
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Tasks with high priority retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Task by ID

**Endpoint:** `GET /tasks/:id`

**Description:** Retrieve a specific task by its ID.

** Path Parameters:**
- `id` (number, required): Task ID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/tasks/1"
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Create Task

**Endpoint:** `POST /tasks`

**Description:** Create a new task.

**Request Body:**
```typescript
interface CreateTaskRequest {
  title: string;           // Required
  description: string;     // Required
  completed?: boolean;     // Optional, defaults to false
  priority?: 'low' | 'medium' | 'high';  // Optional, defaults to 'medium'
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code changes",
    "description": "Review and test all recent code changes",
    "completed": false,
    "priority": "medium"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Task created successfully",
  "data": {
    "id": 2,
    "title": "Review code changes",
    "description": "Review and test all recent code changes",
    "completed": false,
    "priority": "medium",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5. Update Task

**Endpoint:** `PUT /tasks/:id`

**Description:** Update an existing task.

**Path Parameters:**
- `id` (number, required): Task ID

**Request Body:**
```typescript
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": true,
    "priority": "low",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Description:** Delete a task by its ID.

**Path Parameters:**
- `id` (number, required): Task ID

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/tasks/1"
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Task deleted successfully"
}
```

## 🧪 Testing the API

### Using cURL

The examples above show how to test each endpoint using cURL. Make sure your server is running on `http://localhost:3000` before testing.

### Using Postman

1. Import the following collection or create requests manually:
   - **GET** `{{base_url}}/tasks`
   - **GET** `{{base_url}}/tasks/priority/high`
   - **GET** `{{base_url}}/tasks/1`
   - **POST** `{{base_url}}/tasks`
   - **PUT** `{{base_url}}/tasks/1`
   - **DELETE** `{{base_url}}/tasks/1`

2. Set `base_url` variable to `http://localhost:3000`

### Using JavaScript/Fetch

```javascript
// Get all tasks
const response = await fetch('http://localhost:3000/tasks');
const data = await response.json();
console.log(data);

// Create a new task
const newTask = await fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'medium'
  })
});
const result = await newTask.json();
console.log(result);
```

### Error Responses

The API returns consistent error responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Title and description are required"
}
```



