# TASK Management App

A simple RESTful Task Management API built using Nodejs and Expressjs. This API allows you to create, read, update, delete, filter, and sort tasks. Tasks can also be managed by priority levels and completion status.

# Features

Create a new task with a title, description, completed status, and priority.
Update existing tasks.
Delete tasks by ID.
Retrieve all tasks.
Filter tasks by completion status (`completed=true/false`).
Sort tasks by creation date (`sort=asc/desc`).
Retrieve tasks by priority (`low`, `medium`, `high`).

# Setup

1. Clone the repository
   git clone https://github.com/your-username/task-manager-api.git
   cd task-manager-api
2. Install dependency
   npm install
3. Run App
   npm start
   It will run the app on port 4001
   If port is needed to be changed, than it can be using .env file

# API Endpoints

1. Get all tasks - GET /tasks
   Query Parameters:
   completed=true|false → Filter by completion status
   sort=asc|desc → Sort by creation date
2. Get task by ID - GET /tasks/:taskId
3. Get tasks by priority - GET /tasks/priority/:level
   :level can be low, medium, or high.
4. Create a task - POST /tasks
   Request Body: {
   "title": "Buy groceries", (required)
   "description": "Milk, Bread, Eggs", (required)
   "completed": false,
   "priority": "medium"
   }
5. Update a task - PUT /tasks/:taskId
   Request Body (any field optional): {
   "title": "Buy groceries and snacks",
   "description": "Milk, Bread, Eggs, Chips",
   "completed": true,
   "priority": "high"
   }
6. Delete a task - DELETE /tasks/:taskId

# Testing the API

You can test the endpoints using tools like:
Postman
cURL
Thunderclient
