Task Manager API

Overview

This is a simple Task Manager REST API built using Node.js and Express.
It allows users to create, read, update, delete, and filter tasks.

Features

CRUD operations for tasks
Input validation
Filtering by completion status
Sorting by creation date
Priority support (low, medium, high)
Error handling (400, 404)

Setup Instructions

1. Clone the repository
git clone https://github.com/airtribe-projects/task-manager-api-chaithanyasp.git
cd task-manager-api-chaithanyasp

2. Install dependencies
npm install

3. Run the server
node index.js

Server will start at:

http://localhost:3000

Project Structure
├── index.js
├── task.json
├── utils/
│   └── validateTask.js
├── package.json

API Endpoints

1. Get all tasks
GET /tasks

2. Filter tasks by completion
GET /tasks?completed=true
GET /tasks?completed=false

3. Sort tasks by creation date
GET /tasks?sort=asc
GET /tasks?sort=desc

4. Filter by priority
GET /tasks/priority/high
GET /tasks/priority/medium
GET /tasks/priority/low

5. Get single task
GET /tasks/:id

6. Create a new task
POST /tasks

Request Body
{
  "title": "Setup project",
  "description": "Install dependencies",
  "completed": false,
  "priority": "high"
}

7. Update a task
PUT /tasks/:id
Request Body
{
  "title": "Updated title",
  "completed": true,
  "priority": "medium"
}

8. Delete a task
DELETE /tasks/:id

Validation Rules

title → required, cannot be empty
description → required, cannot be empty
completed → must be boolean
priority → must be low, medium, or high

Error Handling

Status Code	Description
400	Invalid input
404	Task not found
500	Server error

Testing the API
You can test using:

Postman
Thunder Client
curl

Example (curl)
curl http://localhost:3000/tasks
Notes
Data is stored in a local JSON file (task.json)
Changes are not persistent unless manually saved to file
Server must be restarted after code changes

Author
Chaithanya Shetty
