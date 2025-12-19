# Task Manager API

A simple RESTful Task Manager API built using Node.js and Express.
The API supports basic CRUD operations for managing tasks and stores data in a local JSON file.

---

## Features
- Create a task
- Retrieve all tasks
- Retrieve a task by ID
- Update a task
- Delete a task

---

## Tech Stack
- Node.js
- Express.js
- File-based storage (tasks.json)
- Postman (for testing)

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <https://github.com/airtribe-projects/task-manager-api-Pakhi424.git>
2. Run the 'npm install'
3. Start the server using 'node app.js'
4. Server will run on http://localhost:3000

## API Endpoints

- GET /tasks → Get all tasks
- GET /tasks/:id → Get task by ID
- POST /tasks → Create a new task
- PUT /tasks/:id → Update a task
- DELETE /tasks/:id → Delete a task
