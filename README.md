# 📝 Task Manager API (In-Memory)

A simple **Node.js + Express** backend application that provides a **Task Management REST API** using an **in-memory data store**.

This project demonstrates:

* CRUD operations
* Input validation
* Error handling
* Filtering & sorting
* Priority-based task retrieval

> ⚠️ Note: Data is stored in memory and will reset when the server restarts.

---

## 🚀 Features

* Create, read, update, and delete tasks
* Filter tasks by completion status
* Sort tasks by creation date
* Assign priorities to tasks (`low`, `medium`, `high`)
* Retrieve tasks by priority
* Robust input validation and error handling

---

## 🧰 Tech Stack

* **Node.js (>=18)**
* **Express.js**
* In-memory JavaScript data store
* Postman / curl for API testing

---

## 📦 Project Setup

### Install dependencies

```bash
npm install
```

### Start the server

```bash
node app.js
```

Server will run at:

```
http://localhost:3000
```

---

## 🧪 Testing the API

You can test the APIs using:

* **Postman** (import the provided collection)
* **curl** (examples below)

---

## 📌 Task Object Schema

```json
{
  "id": 1,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false,
  "priority": "high",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

---

## 📡 API Endpoints

### ➕ Create Task

**POST** `/tasks`

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{
  "title": "Build API",
  "description": "Create Task Manager API",
  "completed": false,
  "priority": "high"
}'
```

---

### 📄 Get All Tasks

**GET** `/tasks`

```bash
curl http://localhost:3000/tasks
```

---

### 🔍 Get Task by ID

**GET** `/tasks/:id`

```bash
curl http://localhost:3000/tasks/1
```

---

### 🔄 Update Task

**PUT** `/tasks/:id`

```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-d '{
  "completed": true,
  "priority": "medium"
}'
```

---

### ❌ Delete Task

**DELETE** `/tasks/:id`

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 🔎 Filtering & Sorting

### Filter by Completion Status

**GET** `/tasks?completed=true`

```bash
curl "http://localhost:3000/tasks?completed=true"
```

---

### Sort by Creation Date

**GET** `/tasks?sortByDate=true`

```bash
curl "http://localhost:3000/tasks?sortByDate=true"
```

---

### Filter + Sort

**GET** `/tasks?completed=false&sortByDate=true`

```bash
curl "http://localhost:3000/tasks?completed=false&sortByDate=true"
```

---

## ⭐ Priority-Based APIs

### Get Tasks by Priority

**GET** `/tasks/priority/:level`

Valid priorities:

* `low`
* `medium`
* `high`

```bash
curl http://localhost:3000/tasks/priority/high
```

---

## ⚠️ Error Handling

### Invalid Priority

```bash
curl http://localhost:3000/tasks/priority/urgent
```

**Response**

```json
{
  "message": "Invalid priority level"
}
```


## ✅ Input Validation Rules

* `title`: required, non-empty string
* `description`: required, non-empty string
* `completed`: must be boolean
* `priority`: must be `low`, `medium`, or `high`

Invalid requests return **400 Bad Request**.

---

## 🧠 Design Notes

* In-memory data store (`Array`)
* Modular architecture:

  * `routes/`
  * `services/`
  * `middlewares/`
  * `constants/`
* Easily extendable to database-backed storage

