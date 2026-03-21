# 📝 Task Manager API

## 📌 Overview

This is a simple RESTful API built using **Node.js** and **Express.js** for managing tasks.

The API allows users to:

* Create tasks
* Retrieve all tasks or a specific task
* Update tasks
* Delete tasks
* Filter, sort, and categorize tasks

Each task contains:

* `id`
* `title`
* `description`
* `completed`
* `priority` (low, medium, high)
* `createdAt`

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd task-manager-api
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the server

```bash
node app.js
```

OR (if using nodemon):

```bash
npx nodemon app.js
```

### 4️⃣ Server will start at:

```
http://localhost:3000
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📡 API Endpoints

---

### 🔹 1. Get all tasks

**GET /tasks**

#### Optional Query:

* Filter by completion:

```
/tasks?completed=true
/tasks?completed=false
```

* Sort by creation date:

```
/tasks?sort=asc
/tasks?sort=desc
```

#### Response:

```json
[
  {
    "id": 1,
    "title": "Task",
    "description": "Description",
    "completed": true,
    "priority": "high",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 🔹 2. Get task by ID

**GET /tasks/:taskID**

#### Example:

```
/tasks/1
```

#### Responses:

* ✅ 200 → Task found
* ❌ 404 → Task not found

---

### 🔹 3. Create a task

**POST /tasks**

#### Body:

```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "low"
}
```

#### Notes:

* `priority` is optional (default: low)

#### Responses:

* ✅ 201 → Created
* ❌ 400 → Invalid input

---

### 🔹 4. Update a task

**PUT /tasks/:taskID**

#### Example:

```
/tasks/1
```

#### Body:

```json
{
  "title": "Updated Task",
  "completed": true,
  "priority": "high"
}
```

#### Responses:

* ✅ 200 → Updated
* ❌ 400 → Invalid data
* ❌ 404 → Task not found

---

### 🔹 5. Delete a task

**DELETE /tasks/:taskID**

#### Example:

```
/tasks/1
```

#### Responses:

* ✅ 200 → Deleted
* ❌ 404 → Task not found

---

### 🔹 6. Get tasks by priority

**GET /tasks/priority/:level**

#### Example:

```
/tasks/priority/high
```

#### Valid values:

* `low`
* `medium`
* `high`

#### Responses:

* ✅ 200 → List of tasks
* ❌ 400 → Invalid priority

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* File System (fs module)
* TAP (for testing)

---

## 📂 Project Structure

```
project/
│── controllers/
│── models/
│── routes/
│── middlewares/
│── task.json
│── app.js
│── server.test.js
```

---

## 👨‍💻 Author

Mohankumar Maruli Chandrayigowda
