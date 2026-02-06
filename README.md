# Task Manager API

A RESTful API for managing tasks built with Node.js and Express. This project is part of the Airtribe Backend Engineering Launchpad assignment.

## Overview

This Task Manager API provides a simple yet powerful backend for managing tasks with CRUD (Create, Read, Update, Delete) operations. Tasks can be created, retrieved, updated, and deleted through HTTP endpoints. The API also supports filtering tasks by their completion status.

### Features

- Create new tasks with title, description, and completion status
- Retrieve all tasks or filter by completion status
- Get individual tasks by ID
- Update existing tasks
- Delete tasks
- Input validation and error handling
- RESTful API design

## Technology Stack

- **Node.js** (>=18.0.0)
- **Express.js** (4.22.1)
- **Testing**: Tap and Supertest

## Setup Instructions

### Prerequisites

- Node.js version 18 or higher
- npm (Node Package Manager)

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd task-manager-api-Apurva-Shethia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

4. **Run tests** (optional):
   ```bash
   npm test
   ```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieves all tasks. Optionally filter by completion status.

**Query Parameters:**
- `completed` (optional): `true` or `false` - Filter tasks by completion status

**Success Response:**
- **Code:** 200 OK
- **Content:** Array of task objects

**Example Request:**
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?completed=true

# Get only incomplete tasks
curl http://localhost:3000/tasks?completed=false
```

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task manager API",
    "completed": false
  },
  {
    "id": 2,
    "title": "Write documentation",
    "description": "Create README file",
    "completed": true
  }
]
```

---

### 2. Get Task by ID

**Endpoint:** `GET /tasks/:id`

**Description:** Retrieves a specific task by its ID.

**URL Parameters:**
- `id` (required): Task ID (number)

**Success Response:**
- **Code:** 200 OK
- **Content:** Task object

**Error Response:**
- **Code:** 400 Bad Request - Invalid task ID
- **Code:** 404 Not Found - Task doesn't exist

**Example Request:**
```bash
curl http://localhost:3000/tasks/1
```

**Example Response:**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task manager API",
  "completed": false
}
```

---

### 3. Create a New Task

**Endpoint:** `POST /tasks`

**Description:** Creates a new task.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

**Required Fields:**
- `title` (string): Task title
- `description` (string): Task description
- `completed` (boolean): Task completion status

**Success Response:**
- **Code:** 201 Created
- **Content:** Success message

**Error Response:**
- **Code:** 400 Bad Request - Invalid or missing task details

**Example Request:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Buy milk, eggs, and bread",
    "completed": false
  }'
```

**Example Response:**
```json
"Task created successfully!"
```

---

### 4. Update a Task

**Endpoint:** `PUT /tasks/:id`

**Description:** Updates an existing task. You can update any field(s).

**URL Parameters:**
- `id` (required): Task ID (number)

**Request Headers:**
- `Content-Type: application/json`

**Request Body:** (at least one field required)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:** Success message

**Error Response:**
- **Code:** 400 Bad Request - Invalid task details or missing ID
- **Code:** 404 Not Found - Task doesn't exist

**Example Request:**
```bash
# Update all fields
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true
  }'

# Update only completion status
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Example Response:**
```json
"Task saved successfully!"
```

---

### 5. Delete a Task

**Endpoint:** `DELETE /tasks/:id`

**Description:** Deletes a task by ID.

**URL Parameters:**
- `id` (required): Task ID (number)

**Success Response:**
- **Code:** 200 OK
- **Content:** Success message

**Error Response:**
- **Code:** 400 Bad Request - Missing task ID
- **Code:** 404 Not Found - Task doesn't exist

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Example Response:**
```json
"Task deleted successfully!"
```

---

## Testing the API

### Using cURL (Command Line)

The examples above demonstrate how to use cURL for each endpoint. cURL is a command-line tool for transferring data using various protocols.

### Using Postman

1. **Download and install** [Postman](https://www.postman.com/downloads/)
2. **Import the collection** or create requests manually
3. **Set the base URL:** `http://localhost:3000`
4. **Create requests** for each endpoint following the documentation above

### Using the Test Suite

Run the automated test suite:

```bash
npm test
```

This will run all unit tests using the Tap testing framework.

### Manual Testing Steps

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Create a task:**
   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Task","description":"Testing the API","completed":false}'
   ```

3. **Get all tasks:**
   ```bash
   curl http://localhost:3000/tasks
   ```

4. **Get a specific task (use ID from step 3):**
   ```bash
   curl http://localhost:3000/tasks/1
   ```

5. **Update the task:**
   ```bash
   curl -X PUT http://localhost:3000/tasks/1 \
     -H "Content-Type: application/json" \
     -d '{"completed":true}'
   ```

6. **Filter completed tasks:**
   ```bash
   curl http://localhost:3000/tasks?completed=true
   ```

7. **Delete the task:**
   ```bash
   curl -X DELETE http://localhost:3000/tasks/1
   ```

## Project Structure

```
task-manager-api/
├── app.js                    # Main application entry point
├── package.json              # Project dependencies and scripts
├── task.json                 # Configuration file
├── controllers/
│   └── tasksController.js    # Business logic for task operations
├── models/
│   └── tasks.json            # Task data storage
├── routes/
│   └── tasksRoute.js         # API route definitions
├── test/
│   └── server.test.js        # Test suite
└── utils/
    └── util.js               # Helper functions
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input or missing required fields
- **404 Not Found**: Resource (task) not found
- **500 Internal Server Error**: Server-side errors

All error responses follow a consistent format:
```json
{
  "error": "Error message description"
}
```

## Data Model

### Task Object

```json
{
  "id": 1,                    // Auto-generated unique identifier
  "title": "string",          // Task title (required)
  "description": "string",    // Task description (required)
  "completed": boolean        // Task completion status (required)
}
```

## License

ISC

## Author

Airtribe

---

## Notes

- This is an in-memory API. Data will be reset when the server restarts.
- Task IDs are auto-incremented starting from 1.
- All endpoints return JSON responses.
- The API validates all input data before processing.
