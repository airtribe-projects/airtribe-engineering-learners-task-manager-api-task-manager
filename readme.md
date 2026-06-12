# Task Management REST API

A simple RESTful API built with Node.js and Express.js for managing tasks. The API supports CRUD operations, input validation, error handling, filtering, sorting, and task prioritization using in-memory data storage.

## Features

- Create, Read, Update, and Delete tasks
- Input validation for task creation and updates
- Error handling for invalid requests
- Filter tasks by completion status
- Sort tasks by creation date
- Manage task priorities (low, medium, high)
- Retrieve tasks by priority level
- Modular project structure using Routes, Controllers, Middleware, and Data layers

## Tech Stack

- Node.js
- Express.js

## Project Structure

```text
.
├── controllers/
│   └── taskController.js
├── data/
│   └── tasks.js
├── middleware/
│   └── validateTask.js
├── routes/
│   └── tasks.js
├── app.js
├── package.json
└── README.md
```

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Install dependencies

```bash
npm install
```

### Start the server

```bash
node app.js
```

Server runs on:

```text
http://localhost:3000
```

## Task Schema

```json
{
  "id": 1,
  "title": "Build REST API",
  "description": "Complete Express.js assignment",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-06-12T10:00:00.000Z"
}
```

## API Endpoints

### Get All Tasks

Retrieve all tasks.

**Request**

```http
GET /tasks
```

**Response**

```json
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
```

---

### Get Task By ID

Retrieve a specific task by its ID.

**Request**

```http
GET /tasks/:id
```

**Example**

```http
GET /tasks/1
```

---

### Create Task

Create a new task.

**Request**

```http
POST /tasks
```

**Body**

```json
{
  "title": "Build API",
  "description": "Implement CRUD operations",
  "completed": false,
  "priority": "high"
}
```

**Response**

```json
{
  "id": 2,
  "title": "Build API",
  "description": "Implement CRUD operations",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-06-12T10:00:00.000Z"
}
```

---

### Update Task

Update an existing task.

**Request**

```http
PUT /tasks/:id
```

**Example**

```http
PUT /tasks/1
```

**Body**

```json
{
  "title": "Updated Task",
  "description": "Updated Description",
  "completed": true,
  "priority": "medium"
}
```

---

### Delete Task

Delete a task by ID.

**Request**

```http
DELETE /tasks/:id
```

**Example**

```http
DELETE /tasks/1
```

**Response**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Filtering

Retrieve tasks based on completion status.

### Completed Tasks

```http
GET /tasks?completed=true
```

### Pending Tasks

```http
GET /tasks?completed=false
```

---

## Sorting

Sort tasks by creation date.

### Oldest First

```http
GET /tasks?sort=asc
```

### Newest First

```http
GET /tasks?sort=desc
```

---

## Filtering and Sorting Together

```http
GET /tasks?completed=true&sort=desc
```

---

## Get Tasks By Priority

Retrieve tasks by priority level.

### High Priority

```http
GET /tasks/priority/high
```

### Medium Priority

```http
GET /tasks/priority/medium
```

### Low Priority

```http
GET /tasks/priority/low
```

---

## Validation Rules

### Title

- Required
- Must be a non-empty string

### Description

- Required
- Must be a non-empty string

### Completed

- Required
- Must be a boolean value

### Priority

- Required
- Allowed values:

  - low
  - medium
  - high

---

## Error Responses

### Invalid Input

**Status:** `400 Bad Request`

```json
{
  "message": "Title is required"
}
```

```json
{
  "message": "Description is required"
}
```

```json
{
  "message": "Completed must be a boolean value"
}
```

```json
{
  "message": "Priority must be low, medium or high"
}
```

### Task Not Found

**Status:** `404 Not Found`

```json
{
  "message": "Task not found"
}
```

### Route Not Found

**Status:** `404 Not Found`

```json
{
  "message": "Route not found"
}
```

## Notes

- Data is stored in memory and will be reset whenever the server restarts.
- No database is used in this project.
- The API is designed to demonstrate Express.js routing, validation, filtering, sorting, and controller-based architecture.

## Submission

Completed GitHub Classroom Task Management API assignment.
