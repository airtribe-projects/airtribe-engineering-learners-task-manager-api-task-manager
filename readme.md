# 📝 Task Manager API — Node.js + Express + File Storage

A simple RESTful Task Manager API built with **Node.js** and **Express** that stores tasks in a local JSON file. This project supports full CRUD operations and includes automated tests using **tap** and **supertest**.

---

# 🚀 Features

- Create a task
- Get all tasks
- Get task by ID
- Update task
- Delete task
- File-based persistence using `fs`
- Fully tested REST endpoints
- Input validation
- Proper HTTP status codes

---

# 🧱 Tech Stack

- Node.js
- Express.js
- File System (`fs`)
- Path module
- tap (test runner)
- supertest (API testing)

---

# 📂 Project Structure

```
project-root/
│
├── app.js
├── task.json
├── package.json
│
├── routes/
│   └── router.js
│
├── controllers/
│   └── controller.js
│
└── test/
    └── server.test.js
```

---

# ⚙️ Installation

```bash
git clone <repo-url>
cd project
npm install
```

---

# ▶️ Run Server

```bash
node app.js
```

Server runs on:

```
http://localhost:3000
```

---

# 🧪 Run Tests

```bash
npm test
```

or

```bash
tap test/
```

All tests should pass:

```
19/19 passing
```

---

# 📦 task.json Format (Required)

Your `task.json` must exist and start with:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true
    }
  ]
}
```

Tests depend on this initial data.

---

# 📌 API Endpoints

## Get All Tasks

```
GET /tasks
```

**Response — 200**

```json
[
  {
    "id": 1,
    "title": "...",
    "description": "...",
    "completed": true
  }
]
```

---

## Get Task By ID

```
GET /tasks/:id
```

**Success → 200**

**Not Found → 404**

---

## Create Task

```
POST /tasks
```

### Body

```json
{
  "title": "Task",
  "description": "Task details",
  "completed": false
}
```

**Success → 201**

**Invalid Body → 400**

Rules:

- title required
- description required
- completed must be boolean

---

## Update Task

```
PUT /tasks/:id
```

### Body

```json
{
  "title": "Updated",
  "description": "Updated",
  "completed": true
}
```

**Success → 200**
**Invalid Data → 400**
**Invalid ID → 404**

Validation runs **before** ID check to satisfy tests.

---

## Delete Task

```
DELETE /tasks/:id
```

**Success → 200**

```json
{ "message": "Task deleted successfully" }
```

**Invalid ID → 404**

---

# 🔍 Important Implementation Notes

## Safe File Reading

Controller safely reads JSON file:

```js
if (!fs.existsSync(TASK_FILE)) return [];
```

Prevents crash if file missing.

---

## Correct ID Generation

Do NOT use:

```js
tasks.length + 1 ❌
```

Because deletes break IDs.

Correct:

```js
Math.max(...tasks.map((t) => t.id)) + 1;
```

---

## Validation Rule Used

```js
typeof completed === "boolean";
```

String `"true"` is rejected (required by tests).

---

## Why Tests Were Failing Earlier

Fail
