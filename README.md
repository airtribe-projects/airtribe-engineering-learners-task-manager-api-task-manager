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
   npm run dev
   npm start
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

---

### 2. `GET /tasks/:id`

Retrieve a specific task by its ID.

**Example:**

```
GET /tasks/1
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
  "title": "title",
  "description": "description",
  "completed": false,
  "priority": "low"
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
  "title": "title",
  "description": "description",
  "completed": false,
  "priority": "low"
}
```

---

### 6. `DELETE /tasks/:id`

Delete a task by ID.

**Example:**

```
DELETE /tasks/5
```

## 🧪 How to Test the API

You can run

   ```bash
   npm run test
   ```