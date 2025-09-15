# Task Management API

A RESTful API for managing tasks built with Node.js and Express. This API allows you to create, read, update, and delete tasks with additional filtering and sorting capabilities.

## Setup Instructions

### Prerequisites
- Node.js (v12 or higher)
- npm (Node Package Manager)

### Installation
1. Save the provided code as `app.js`
2. Create a `task.json` file with initial content: `{"tasks": []}`
3. Navigate to the project directory
4. Install dependencies:
   npm install express
5. Start the server:
   node app.js
6. The server will run on `http://localhost:3000`

### File Structure
project-directory/
├── app.js          # Main server file
├── task.json       # JSON file for storing tasks
└── README.md       # This file

## API Endpoints

### 1. Get All Tasks
Endpoint: GET /tasks

Retrieves all tasks with optional filtering and sorting.

Query Parameters:
- completed (optional): Filter by completion status (true/false)
- sort (optional): Sort by creation date ('asc' or 'desc')

Example Requests:
# Get all tasks
curl http://localhost:3000/tasks

# Get completed tasks
curl http://localhost:3000/tasks?completed=true

# Get tasks sorted by creation date (descending)
curl http://localhost:3000/tasks?sort=desc

### 2. Get Tasks by Priority
Endpoint: GET /tasks/priority/:level

Retrieves tasks filtered by priority level.

Path Parameter:
- level: Priority level ('low', 'medium', or 'high')

Example Request:
# Get high priority tasks
curl http://localhost:3000/tasks/priority/high

### 3. Get Task by ID
Endpoint: GET /tasks/:id

Retrieves a specific task by its ID.

Path Parameter:
- id: Task ID (integer)

Example Request:
# Get task with ID 1
curl http://localhost:3000/tasks/1

### 4. Create a New Task
Endpoint: POST /tasks

Creates a new task.

Request Body (JSON):
{
  "title": "Task title",
  "description": "Task description",
  "completed": false
}

Required Fields:
- title: String (required)
- description: String (required)
- completed: Boolean (required)

Example Request:
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "This is a new task", "completed": false}'

### 5. Update a Task
Endpoint: PUT /tasks/:id

Updates an existing task.

Path Parameter:
- id: Task ID (integer)

Request Body (JSON):
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}

Example Request:
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "description": "This task has been updated", "completed": true}'

### 6. Delete a Task
Endpoint: DELETE /tasks/:id

Deletes a task.

Path Parameter:
- id: Task ID (integer)

Example Request:
curl -X DELETE http://localhost:3000/tasks/1

## Testing the API

You can test the API using:
1. cURL commands (examples provided above)
2. Postman or similar API testing tools
3. Web browsers for GET requests
4. JavaScript fetch API or similar HTTP clients

### Sample Testing Workflow:
1. Create a new task using POST /tasks
2. Retrieve all tasks using GET /tasks
3. Filter tasks by completion status
4. Update a task using PUT /tasks/:id
5. Delete a task using DELETE /tasks/:id

## Data Structure

Tasks are stored with the following structure:
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2023-05-15T10:30:00.000Z"
}

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Resource created successfully
- 400: Bad request (invalid input)
- 404: Resource not found

Error responses include descriptive messages to help identify issues.