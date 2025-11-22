# Task Manager API

A RESTful API for managing tasks built with Express.js. The API stores tasks in a JSON file and provides full CRUD operations.

## Features

✅ **GET /tasks** - Retrieve all tasks
✅ **GET /tasks/:id** - Retrieve a specific task by ID
✅ **POST /tasks** - Create a new task
✅ **PUT /tasks/:id** - Update an existing task
✅ **DELETE /tasks/:id** - Delete a task
✅ **Interactive Web UI** - Test all endpoints in your browser
✅ **Validation** - Input validation on all endpoints
✅ **Persistent Storage** - Tasks stored in task.json

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd task-manager-api-kknsrn
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

### 1. GET /tasks
Retrieve all tasks from the system.

**Request:**
```bash
curl -X GET http://localhost:3000/tasks
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using the Express application generator",
      "completed": true
    }
  ]
}
```

---

### 2. GET /tasks/:id
Retrieve a specific task by its ID.

**Request:**
```bash
curl -X GET http://localhost:3000/tasks/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 3. POST /tasks
Create a new task with the required fields.

**Request:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Express.js",
    "description": "Build a REST API with Express",
    "completed": false
  }'
```

**Required Fields:**
- `title` (string, non-empty): Task title
- `description` (string): Task description
- `completed` (boolean): Whether the task is completed

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 9,
    "title": "Learn Express.js",
    "description": "Build a REST API with Express",
    "completed": false
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Title is required"
}
```

---

### 4. PUT /tasks/:id
Update an existing task. You can update one or more fields.

**Request:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "completed": true
  }'
```

**Optional Fields:**
- `title` (string): Update task title
- `description` (string): Update task description
- `completed` (boolean): Update completion status

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 5. DELETE /tasks/:id
Delete a task by its ID.

**Request:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

## Testing

### Option 1: Interactive Web UI (Easiest!)
Open your browser and navigate to:
```
http://localhost:3000/test.html
```

This provides an interactive interface to test all endpoints with a beautiful UI.

### Option 2: Using PowerShell (Windows)
```powershell
# Get all tasks
$response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method Get
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Create a task
$body = @{
    title = "New Task"
    description = "Task description"
    completed = $false
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Option 3: Using curl (Linux/Mac/Windows with Git Bash)
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get specific task
curl http://localhost:3000/tasks/1

# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Description","completed":false}'

# Update task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete task
curl -X DELETE http://localhost:3000/tasks/1
```

### Option 4: Using Postman
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint
3. Set the method (GET, POST, PUT, DELETE)
4. Set the URL (http://localhost:3000/tasks)
5. For POST/PUT, set Body as JSON and add your data

## Project Structure

```
task-manager-api-kknsrn/
├── app.js                 # Main Express application
├── task.json             # JSON file storing tasks (persistent storage)
├── package.json          # Project dependencies and scripts
├── test.html             # Interactive web-based API tester
├── test-api.js           # Node.js based test script
├── test-endpoints.bat    # Windows batch script for testing
├── README.md             # This file
└── test/
    └── server.test.js    # Unit tests (if present)
```

## Data Validation

The API validates all input:

### Title Validation
- Required field
- Cannot be empty or just whitespace
- Will be trimmed of leading/trailing spaces

### Description Validation
- Required for POST requests
- Optional for PUT requests
- Will be trimmed of leading/trailing spaces

### Completed Validation
- Required for POST requests
- Must be a boolean (true or false)
- Optional for PUT requests

## Error Handling

All errors return appropriate HTTP status codes:

- **200 OK** - Successful GET, PUT, DELETE
- **201 Created** - Successful POST
- **400 Bad Request** - Invalid input (validation error)
- **404 Not Found** - Task not found
- **500 Internal Server Error** - Server error (rare)

## Files Storage

Tasks are stored in `task.json` in the following format:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "completed": false
    }
  ]
}
```

**Note:** The `task.json` file is automatically managed by the API. Do not edit it manually while the server is running.

## Running Tests

To run the provided test script on Windows:
```bash
test-endpoints.bat
```

Or manually using Node.js:
```bash
node test-api.js
```

## Development

### Dependencies
- **express** (^4.21.2) - Web framework
- **tap** (^18.6.1) - Testing framework (dev)
- **supertest** (^6.3.4) - HTTP assertions (dev)

### Scripts
```bash
# Start the server
npm start

# Run tests
npm test

# Check Node.js version
node -v
```

## Common Issues

### Port 3000 is already in use
If port 3000 is already in use, you can either:
1. Kill the process using that port
2. Change the port in `app.js`

### Cannot connect to localhost
- Make sure the server is running
- Check if the URL is correct: `http://localhost:3000`
- Try `http://127.0.0.1:3000` instead

### Tasks not persisting
- Make sure `task.json` exists in the project root
- Check file permissions
- The API should handle this automatically

## License

ISC

## Author

Airtribe

---

**Happy Testing! 🎉**
