Task Management REST API
A simple RESTful API built with Node.js and Express.js for managing tasks. The API supports CRUD operations, input validation, error handling, filtering, sorting, and task prioritization using in-memory data storage.

Features
Create, Read, Update, and Delete tasks
Input validation for task creation and updates
Error handling for invalid requests
Filter tasks by completion status
Sort tasks by creation date
Manage task priorities (low, medium, high)
Retrieve tasks by priority level


Tech Stack
Node.js
Express.js


Project Structure
.
├── app.js
├── package.json
└── README.md


Installation
Clone the repository
git clone <repository-url>
cd <repository-name>

Install dependencies
npm install

Start the server
node app.js

Server runs on:
http://localhost:3000
Task Schema
{
  "id": 1,
  "title": "Build REST API",
  "description": "Complete Express.js assignment",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-06-12T10:00:00.000Z"
}

API Endpoints

Get All Tasks
Retrieve all tasks.

Request
GET /tasks

Response

[
  {
    "id": 1,
    "title": "Build REST API",
    "description": "Complete Express.js assignment",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-06-12T10:00:00.000Z"
  }
]


Get Task By ID
Retrieve a specific task by its ID.

Request

GET /tasks/:id
Example

GET /tasks/1
Create Task
Create a new task.

Request

POST /tasks
Body

{
  "title": "Build API",
  "description": "Implement CRUD operations",
  "completed": false,
  "priority": "high"
}

Response

{
  "id": 2,
  "title": "Build API",
  "description": "Implement CRUD operations",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-06-12T10:00:00.000Z"
}
Update Task
Update an existing task.

Request

PUT /tasks/:id
Example

PUT /tasks/1

Body

{
  "title": "Updated Task",
  "description": "Updated Description",
  "completed": true,
  "priority": "medium"
}
Delete Task
Delete a task by ID.

Request

DELETE /tasks/:id
Example

DELETE /tasks/1
Response

{
  "message": "Task deleted successfully"
}

Filtering

Retrieve tasks based on completion status.

Completed Tasks

GET /tasks?completed=true
Pending Tasks

GET /tasks?completed=false
Sorting

Sort tasks by creation date.

Oldest First

GET /tasks?sort=asc

Newest First

GET /tasks?sort=desc

Filtering and Sorting Together
GET /tasks?completed=true&sort=desc

Get Tasks By Priority
Retrieve tasks by priority level.

High Priority
GET /tasks/priority/high

Medium Priority
GET /tasks/priority/medium

Low Priority
GET /tasks/priority/low

Validation Rules

Title
Required
Must be a non-empty string

Description
Required
Must be a non-empty string

Completed
Required
Must be a boolean value

Priority
Required

Allowed values:
low
medium
high

Error Responses

Invalid Input
Status: 400 Bad Request

{
  "message": "Title is required"
}
{
  "message": "Description is required"
}
{
  "message": "Completed must be a boolean value"
}
{
  "message": "Priority must be low, medium or high"
}
Task Not Found
Status: 404 Not Found

{
  "message": "Task not found"
}
Route Not Found
Status: 404 Not Found

{
  "message": "Route not found"
}
