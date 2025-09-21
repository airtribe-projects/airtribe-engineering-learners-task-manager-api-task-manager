# Task Manager API

A RESTful API for managing tasks using **Node.js** and **Express.js** with in-memory storage.  
Supports CRUD operations, input validation, error handling, and optional extensions like **priority**, **filtering**, and **sorting**.

---

## Table of Contents

- [Installation](#installation)  
- [Running the Server](#running-the-server)  
- [API Endpoints](#api-endpoints)  
- [Testing](#testing)  
- [Optional Extensions](#optional-extensions)  

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd task-manager-api-Lokesh-Varkala

2. Install dependencies:
```bash
npm install

Running the Server

Start the server on port 3000:

node app.js
The server will be accessible at:

http://localhost:3000

API Endpoints
1. Get all tasks
GET /tasks


Response:

[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": "2025-09-21T00:00:00.000Z"
  }
]


Supports optional filtering by completion status:

GET /tasks?completed=true

2. Get a task by ID
GET /tasks/:id


Response:

{
  "id": 2,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false,
  "priority": "medium"
}

3. Create a new task
POST /tasks


Request Body:

{
  "title": "New Task",
  "description": "New Task Description",
  "completed": false,
  "priority": "low"
}


Response: 201 Created

4. Update a task
PUT /tasks/:id


Request Body:

{
  "title": "Updated Task",
  "description": "Updated Description",
  "completed": true,
  "priority": "high"
}


Response: 200 OK

5. Delete a task
DELETE /tasks/:id


Response:

{
  "message": "Task deleted successfully"
}

Testing

Run the test suite using tap:

npx tap test/server.test.js


All tests should pass if your API is working correctly.

Optional Extensions

Filter tasks by completion status:

GET /tasks?completed=true


Sort tasks by creation date.

Add and manage priority (low, medium, high):

GET /tasks/priority/:level

Author

Lokesh Varkala

<!-- PR submission -->
---
