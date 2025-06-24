# Task Management API Documentation

## 📘 Overview

This project is a simple **Task Management API** built using **Node.js** and **Express**. It allows users to perform **CRUD operations** on tasks, filter tasks by completion status or priority, and sort them by creation date. The data is stored in-memory (i.e., not persisted to a database).

### Features

* Retrieve all tasks
* Retrieve a task by ID
* Filter tasks by completion status
* Sort tasks by creation date (ascending/descending)
* Filter tasks by priority (low, medium, high)
* Create, update, and delete tasks

## 🧰 Getting Started

### Step-by-Step Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Server**

   ```bash
   node app.js
   ```

   > Server will start on `http://localhost:3000`

4. **Test Using Postman or cURL**

   * Import endpoints in Postman
   * Use `http://localhost:3000/tasks` as base URL

---

## 📌 API Endpoints Documentation

### 1. `GET /tasks`

Retrieve all tasks.

**Query Parameters (optional):**

* `completed=true|false` – Filter tasks based on completion status
* `sort=asc|desc` – Sort by `createdAt` field

**Example:**

```
GET /tasks?completed=true&sort=desc
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "createdAt": "2024-04-29T12:00:00.000Z",
    "priority": "low"
  }
]
```

---

### 2. `GET /tasks/:id`

Retrieve a specific task by its ID.

**Example:**

```
GET /tasks/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

---

### 3. `GET /tasks/priority/:level`

Retrieve tasks based on priority.

**Path Parameter:**

* `level` – Priority level (`low`, `medium`, `high`)

**Example:**

```
GET /tasks/priority/high
```

---

### 4. `POST /tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "Write API docs",
  "description": "Document the REST API",
  "completed": false,
  "priority": "medium"
}
```

**Response:**

```json
{
  "id": 16,
  "title": "Write API docs",
  "description": "Document the REST API",
  "completed": false,
  "createdAt": "2024-04-29T13:00:00.000Z",
  "priority": "medium"
}
```

---

### 5. `PUT /tasks/:id`

Update an existing task by ID.

**Example:**

```
PUT /tasks/1
```

**Request Body:**

```json
{
  "title": "Update Docs",
  "description": "Update the documentation for API",
  "completed": true,
  "priority": "high"
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Update Docs",
  "description": "Update the documentation for API",
  "completed": true,
  "priority": "high"
}
```

---

### 6. `DELETE /tasks/:id`

Delete a task by ID.

**Example:**

```
DELETE /tasks/5
```

**Response:**

* Status: `204 No Content`

---

## 🧪 How to Test the API

You can test this API using [Postman](https://www.postman.com/) or `curl`:

### Example cURL Requests

* **Create a Task:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo","description":"Testing API","completed":false, "priority":"high"}'
```

* **Get Tasks Sorted by Date Descending:**

```bash
curl http://localhost:3000/tasks?sort=desc
```

* **Get Tasks by Completion Status:**

```bash
curl http://localhost:3000/tasks?completed=true
```

* **Get Tasks by Priority:**

```bash
curl http://localhost:3000/tasks/priority/high
```

---

## 📎 Notes

* All data is stored in-memory; restarting the server will reset the tasks.
* Ensure that the `task.json` file exists and is properly formatted if loading from file.
