# Task Manager API

A simple Express.js REST API for managing tasks. Built as an assignment for the Airtribe Backend Engineering Launchpad.

## Overview

This project provides a basic in-memory task management API. You can create, read, update, and delete tasks. Each task has an `id`, `title`, `description`, and `completed` status.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000` (or the port set in `PORT` environment variable).

4. **Run tests**
   ```bash
   npm test
   ```

## API Endpoints

### 1. Get All Tasks
- **Endpoint:** `GET /tasks`
- **Description:** Returns a list of all tasks.
- **Postman:**
  - Method: GET
  - URL: `http://localhost:3000/tasks`

### 2. Get Task by ID
- **Endpoint:** `GET /tasks/:id`
- **Description:** Returns a single task by its ID.
- **Postman:**
  - Method: GET
  - URL: `http://localhost:3000/tasks/1`


### 3. Create a New Task
- **Endpoint:** `POST /tasks`
- **Description:** Creates a new task. Requires `title`, `description`, and `completed` (boolean).
- **Postman:**
  - Method: POST
  - URL: `http://localhost:3000/tasks`
  - Body: raw, JSON
    ```json
    {
      "title": "New Task",
      "description": "New Task Description",
      "completed": false
    }
    ```



### 4. Update a Task
- **Endpoint:** `PUT /tasks/:id`
- **Description:** Updates an existing task by ID. Accepts any of the fields: `title`, `description`, `completed`.
- **Postman:**
  - Method: PUT
  - URL: `http://localhost:3000/tasks/1`
  - Body: raw, JSON
    ```json
    {
      "title": "Updated Task",
      "description": "Updated Task Description",
      "completed": true
    }
    ```



### 5. Delete a Task
- **Endpoint:** `DELETE /tasks/:id`
- **Description:** Deletes a task by ID.
- **Postman:**
  - Method: DELETE
  - URL: `http://localhost:3000/tasks/1`

## Notes
- All data is stored in-memory and will reset when the server restarts.
- Make sure to use valid JSON and required fields for POST/PUT requests.
- For testing, see the included test suite in `test/server.test.js`.
