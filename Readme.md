# 📌 Task Manager Application

**Assignment for Airtribe – Backend Development**

---

## 📖 Project Overview

**Project Name:** Task Manager Application

This project is a simple **Task Manager REST API** built using **Node.js**, **Express.js**, and **Zod** for request validation.
The API allows users to create, update, delete, and fetch tasks with proper input validation and structured error handling.

This assignment demonstrates:

* REST API design
* Middleware-based validation using Zod
* Strict input validation
* Clean request → validation → controller flow
* Proper API test cases for documentation

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **Zod** (for request validation)
* **Nodemon** (for development)
* **ES Modules (ESM)**

---

## 🚀 Base URL

```
http://localhost:3000/api/v1/
```

---

## 🔐 Request Headers (Mandatory)

All API requests **must include** the following header:

```
Content-Type: application/json
```

---

## 📂 API Endpoints

### ➕ Create Task

**Endpoint**

```
POST /tasks
```

Creates a new task after validating the request body using Zod.

---

### 📄 GET All Tasks

**Endpoint**git checkout master


```
GET /tasks
```

Retrieves all tasks in memory.

---

Based on the date filer the task

http://localhost:3000/api/v1/tasks?sort=asc
http://localhost:3000/api/v1/tasks?sort=desc 

### 📄 GET Task by ID

**Endpoint**

```
GET /tasks/:id
```

Fetches a single task by its `id`.

---

### 🔄 Update Task

**Endpoint**

```
PUT /tasks/:id
```

Updates a task by `id`. Validation ensures **title is min 3 chars, description ≤ 500 chars, completed boolean**.

---

### ❌ Delete Task

**Endpoint**

```
DELETE /tasks/:id
```

Deletes a task by its `id`.

---

## 🧪 API Test Cases (Task Manager API)

---

### ✅ Test Case 1: Create Task (Valid – Minimal Data)

**Request**

```json
{
  "title": "Learn Node.js"
}
```

**Expected Response**

```json
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "Learn Node.js",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### ✅ Test Case 2: Create Task (Valid – Full Data)

**Request**

```json
{
  "title": "Build Task Manager API",
  "description": "Create CRUD APIs using Express and Zod",
  "completed": false
}
```

**Expected Response**

```json
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "Build Task Manager API",
    "description": "Create CRUD APIs using Express and Zod",
    "completed": false,
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### ❌ Test Case 3: Validation Error – Title Too Short

**Request**

```json
{
  "title": "Hi"
}
```

**Expected Response (400 Bad Request)**

```json
{
  "message": "validation failed",
  "errors": [
    {
      "path": ["body", "title"],
      "message": "Title must be at least 3 characters"
    }
  ]
}
```

---

### ❌ Test Case 4: Validation Error – Wrong Completed Type

**Request**

```json
{
  "title": "Valid Title",
  "completed": "yes"
}
```

**Expected Response**

```json
{
  "message": "validation failed",
  "errors": [
    {
      "path": ["body", "completed"],
      "message": "Completed must be a boolean"
    }
  ]
}
```

---

### ❌ Test Case 5: Validation Error – Description Too Long

**Request**

```json
{
  "title": "Task Title",
  "description": "a".repeat(600)
}
```

**Expected Response**

```json
{
  "message": "validation failed",
  "errors": [
    {
      "path": ["body", "description"],
      "message": "Description too long"
    }
  ]
}
```

---

### ❌ Test Case 6: Validation Error – Empty Description

**Request**

```json
{
  "title": "Learn Node.js",
  "description": ""
}
```

**Expected Response**

```json
{
  "message": "validation failed",
  "errors": [
    {
      "path": ["body", "description"],
      "message": "Description cannot be empty"
    }
  ]
}
```

---

### ✅ Test Case 7: GET All Tasks

**Request**

```
GET /tasks
```

**Expected Response**

```json
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "id": "uuid",
      "title": "Learn Node.js",
      "description": "Build a simple API",
      "completed": false,
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### ⚠️ Test Case 8: Missing Content-Type Header

**Request**

```
POST /tasks
```

*(Without `Content-Type: application/json` header)*

**Expected Result**

* `req.body` becomes `{}`
* Validation fails or task creation behaves unexpectedly (depending on middleware)

👉 **Always include:**

```
Content-Type: application/json
```

---

## 📋 Validation Rules Summary

| Field         | Requirement                                                    |
| ------------- | -------------------------------------------------------------- |
| `title`       | Required, minimum **3 characters**, string                     |
| `description` | Optional, max **500 characters**, non-empty if present, string |
| `completed`   | Optional, must be **boolean**                                  |

Validation is handled using **Zod middleware** before the controller logic executes.

---

## 🔄 Request Flow

```
Client Request
   ↓
Route
   ↓
Zod Validation Middleware (strict)
   ↓
Controller
   ↓
Response
```

❗ If validation fails, the **controller is never executed** and a `400 Bad Request` response is returned.

---

## ▶️ How to Run the Project

```bash
npm install
npm run dev
```

Server will start on:

```
http://localhost:3000
```

---

## 📌 Notes

* This project currently uses **in-memory storage** for tasks.
* Database integration (MongoDB) can be added in future iterations.
* The project follows **strict input validation + middleware architecture**.
* Both **create and update tasks** are validated with title, description, and completed rules.

---

## 👨‍💻 Author

**Neeraj Khalkar**
Assignment Submission – **Airtribe**

---
