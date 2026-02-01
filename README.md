# Task Management API

## Overview

This project is a simple **Task Management REST API** built with **Node.js** and **Express.js**. It allows users to create, read, update, delete, and filter tasks. Tasks are stored locally in a `task.json` file.
Each task includes:

* `id` – unique identifier
* `title` – task title
* `description` – task details
* `completed` – boolean status
* `priority` – task priority ("medium", "low", "high")
* `createdAt` – ISO timestamp of creation

---
## Setup Instructions

### 1. Clone the repository

### 2. Install dependencies


npm install


### 3. Environment variables

Create a `.env` file in the root directory:

PORT=3000

### 4. Create data file

Create a `task.json` file in the root directory:

```json
{
  "tasks": []
}
```

### 5. Start the server

```bash
node app.js
```
## API Endpoints

### 1. Get all tasks

**GET** `/tasks`

#### Query Parameters (optional)

| Parameter    | Type    | Description                                 |
| ------------ | ------- | ------------------------------------------- |
| `completed`  | boolean | Filter tasks by completion status           |
| `sortOnDate` | boolean | Sort by `createdAt` (`true` = newest first) |

#### Example

```http
GET /tasks?completed=true&sortOnDate=true
```

#### Response

```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "Example",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-01-01T10:00:00.000Z"
  }
]
```

---

### 2. Get a task by ID

**GET** `/tasks/:id`


---

### 3. Create a new task

**POST** `/tasks`

#### Request Body
{
  "title": "New Task",
  "description": "Task details",
  "completed": false,
  "priority": "medium"
}

### 4. Update a task

**PUT** `/tasks/:id`

#### Request Body

```json
{
  "title": "Updated Task",
  "description": "Updated details",
  "completed": true,
  "priority": "low"
}
```


### 5. Delete a task

**DELETE** `/tasks/:id`

#### Example

```http
DELETE /tasks/1
```

## How to Test the API

### Option 1: Using Postman

1. Open Postman
2. Set the request method (GET, POST, PUT, DELETE)
3. Enter URL (e.g. `http://localhost:3000/tasks`)
4. For POST/PUT, select **Body → raw → JSON**
5. Send request and view response

## Notes

* Data is persisted in `task.json`

---


