# Task Manager API

A simple RESTful API built with **Node.js** and **Express** for managing a list of tasks. It supports task creation, retrieval, updating, deletion, filtering, sorting, and managing task priorities.

---

## Features

- Create, read, update, and delete tasks
- Filter tasks by completion status (`true` or `false`)
- Sort tasks by creation date (`asc` or `desc`)
- Filter tasks by priority (`low`, `medium`, `high`)
- Validate request payloads
- JSON-based persistent storage (`task.json`)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/task-manager-api.git
   cd task-manager-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server using nodemon**:
   ```bash
   npm run dev
   ```

   Or using plain node:

   ```bash
   node index.js
   ```

---

## Project Structure

```
├── index.js          # Main Express app
├── task.json         # JSON file storing task data
├── package.json
└── README.md
```

---

## Sample task.json

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Set up project",
      "description": "Initialize Node.js and install dependencies",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-08-07T10:00:00.000Z"
    }
  ]
}
```

---

## API Endpoints

### 🔹 GET /tasks

- **Description**: Get all tasks
- **Query Parameters**:
  - `completed=true|false` – filter by completion status
  - `sort=asc|desc` – sort by creation date

**Example**:
```
GET /tasks?completed=true&sort=desc
```

---

### 🔹 GET /tasks/:id

- **Description**: Get a task by ID

**Example**:
```
GET /tasks/2
```

---

### 🔹 GET /tasks/priority/:level

- **Description**: Get tasks by priority level (`low`, `medium`, `high`)

**Example**:
```
GET /tasks/priority/high
```

---

### 🔹 POST /tasks

- **Description**: Create a new task
- **Required Fields**:
  - `title` (string)
  - `description` (string)
  - `completed` (boolean)
- **Optional**:
  - `priority` (defaults to `"medium"`)

**Request Body**:
```json
{
  "title": "Write README",
  "description": "Document the API endpoints",
  "completed": false,
  "priority": "low"
}
```

---

### 🔹 PUT /tasks/:id

- **Description**: Update an existing task
- **At least one of the following required**:
  - `title`, `description`, `completed`, `priority`

**Request Body Example**:
```json
{
  "completed": true,
  "priority": "high"
}
```

---

### 🔹 DELETE /tasks/:id

- **Description**: Delete a task by its ID

**Example**:
```
DELETE /tasks/1
```

---

## Testing the API

You can test endpoints using:

- Postman
- Insomnia
- curl
- JavaScript (e.g., fetch, axios)

---

## Example cURL Commands

```bash
# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test cURL","completed":false,"priority":"medium"}'

# Get all tasks
curl http://localhost:3000/tasks

# Get tasks with priority "high"
curl http://localhost:3000/tasks/priority/high

# Delete task with ID 3
curl -X DELETE http://localhost:3000/tasks/3
```

---

## 🧑‍💻 Author

**Amal Kannery**
---
