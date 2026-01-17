# Task Management REST API

A RESTful API built using Node.js and Express.js for managing tasks.
Supports CRUD operations, input validation, error handling,
filtering, sorting, and priority-based queries.

---

## Setup Instructions

1. Install dependencies:
   npm install
2. Start server:
   npm start
3. Server runs at:
   http://localhost:3000

---

## Task Schema

{
  "id": 1,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false,
  "priority": "medium"
}

---

## API Endpoints

GET /tasks  
GET /tasks/:id  
POST /tasks  
PUT /tasks/:id  
DELETE /tasks/:id  
GET /tasks?completed=true  
GET /tasks/priority/:level  

---

## Testing

Use Postman or curl.

Example:
curl http://localhost:3000/tasks
