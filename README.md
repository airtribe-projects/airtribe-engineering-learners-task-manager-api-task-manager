# Task Management API

## Overview

This is a Task Management REST API built using Node.js and Express.  
It supports basic CRUD operations along with filtering, sorting, and task priority management.

The project follows a layered architecture:

Controller → Service → Repository

---

## Setup Instructions

### Prerequisites
- Node.js
- npm 

### Steps to Run

1. Clone the repository
```bash
git clone <repository-url>
cd task-management-api

####EndPoints:
1. GET /tasks?completed=false&priority=high&sortBy=createdAt

[
  {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Understand Express framework",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-02-06T12:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Write APIs",
    "description": "CRUD operations",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-02-05T10:20:00.000Z"
  }
]
POST /tasks
### Request Body
```json
{
  "title": "Learn Node.js",
  "description": "Understand Express framework",
  "completed": false,
  "priority": "medium"
}
RESPONSE:
{
  "id": 1,
  "title": "Learn Node.js",
  "description": "Understand Express framework",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-02-06T12:30:00.000Z"
}


3. Get Task by ID

GET /tasks/:id

Example Request
GET /tasks/1

Success Response – 200 OK
{
  "id": 1,
  "title": "Learn Node.js",
  "description": "Understand Express framework",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-02-06T12:30:00.000Z"
}

Error Response – 404 Not Found
{
  "message": "Task not found"
}

4. Get Tasks by Priority

GET /tasks/priority/:level

Example Request
GET /tasks/priority/high

Success Response – 200 OK
[
  {
    "id": 3,
    "title": "Deploy App",
    "description": "Deploy to server",
    "completed": false,
    "priority": "high",
    "createdAt": "2024-02-06T09:00:00.000Z"
  }
]

5. Update Task

PUT /tasks/:id

Request Body
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}

Success Response – 200 OK
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "high",
  "createdAt": "2024-02-06T12:30:00.000Z"
}

### Error Responses

400 Bad Request

{
  "message": "Invalid input"
}


404 Not Found

{
  "message": "Task not found"
}

6. Delete Task

DELETE /tasks/:id

Example Request
DELETE /tasks/1

Success Response – 200 OK
{
  "message": "Task deleted successfully"
}

Error Response – 404 Not Found
{
  "message": "Task not found"
}




