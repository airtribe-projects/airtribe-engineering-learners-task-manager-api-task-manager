# 🚀 Task Manager API

A **Task Manager REST API** built using **Node.js 18**, **Express**, and **MongoDB**.
This project provides **full CRUD operations**, strong **input validation**, **filtering**, **sorting**, and **priority-based task management**.

🧪 The application is **fully tested** using **tap + supertest** with **51/51 tests passing**.

---

## ✨ Features

* 📝 Create, read, update, and delete tasks
* 🔢 Numeric task IDs (`1, 2, 3, ...`)
* ✅ Input validation for create & update
* 🚫 Proper error handling (`400` / `404`)
* 🔍 Filter tasks by completion status
* 📅 Sort tasks by creation date
* 🚦 Task priority support (`low`, `medium`, `high`)
* 🎯 Retrieve tasks by priority
* 🌱 Automatic database seeding on startup
* ⚡ Indexed queries for better performance
* 🧩 Test-friendly architecture
* 🟢 Node.js 18 compatible

---

## 🧱 Tech Stack

* **Node.js 18**
* **Express**
* **MongoDB**
* **Mongoose**
* **tap** (test runner)
* **supertest** (API testing)
* **dotenv**

---

## 📂 Project Structure

```
task-manager-api/
├── app.js                 # Express app (test-safe)
├── server.js              # Server entry point
├── db.js                  # MongoDB connection helper
├── startup.js             # App startup & readiness gate
├── seed.js                # Initial data seeding
├── models/
│   └── task.model.js      # Task schema + indexes
├── services/
│   └── task.service.js    # Business logic
├── controllers/
│   └── task.controller.js # Request handlers
├── routes/
│   └── task.routes.js     # API routes
├── utils/
│   └── validateTask.js    # Input validation
├── test/
│   └── server.test.js     # API tests (51 tests)
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Requirements

* 🟢 Node.js **v18 or higher**
* 🍃 MongoDB running locally

Check Node version:

```
node -v
```

---

## 🛠️ Setup

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Environment variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
```

### 3️⃣ Start MongoDB

Using Homebrew:

```
brew services start mongodb-community
```

Or manually:

```
mongod
```

---

## 🧪 Running Tests

Run the full automated test suite:

```
npm test
```

### ✅ Expected Output

```
Asserts: 51 pass  0 fail
Suites:  1 pass  0 fail
```

---

## ▶️ Running the Application

Start the API server:

```
npm start
```

Server will run at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 📄 Get all tasks

```
GET /tasks
```

### 🔍 Filter by completion

```
GET /tasks?completed=true
GET /tasks?completed=false
```

### 📅 Sort by creation date

```
GET /tasks?sort=createdAt&order=asc
GET /tasks?sort=createdAt&order=desc
```

### 🎯 Get task by ID

```
GET /tasks/:id
```

### 🚦 Get tasks by priority

```
GET /tasks/priority/:level
```

(level = `low | medium | high`)

### ➕ Create a task

```
POST /tasks
```

### ✏️ Update a task

```
PUT /tasks/:id
```

### ❌ Delete a task

```
DELETE /tasks/:id
```

---

## ✅ Validation Rules

* 📝 `title` must be a **non-empty string**
* 📄 `description` must be a **non-empty string**
* ✔ `completed` must be a **boolean**
* 🚦 `priority` must be one of:

  * `low`
  * `medium`
  * `high`

### Error Handling

* ❌ Invalid input → **400 Bad Request**
* 🔍 Task not found → **404 Not Found**

---

## ⚡ Performance Optimizations

MongoDB indexes are added for:

* `completed`
* `priority`
* `createdAt`

This ensures fast filtering and sorting as the dataset grows.

---

## 📌 Status

* ✅ All features implemented
* 🧪 All tests passing (51/51)
* 🟢 Node.js 18 compatible
* 🍃 MongoDB backed
---

