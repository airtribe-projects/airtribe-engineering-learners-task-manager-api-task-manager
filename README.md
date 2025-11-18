# Task Manager API

A RESTful API for managing tasks built with Node.js and Express. This project provides a complete CRUD (Create, Read, Update, Delete) interface for task management.

## 📋 Overview

This Task Manager API allows you to create, retrieve, update, and delete tasks through HTTP endpoints. It's built as part of the Backend Engineering Launchpad assignment.

## 🚀 Recent Updates

### PR #1: Add Task Management API with CRUD Operations and Routing
- Implemented complete CRUD operations for task management
- Created modular routing structure with Express Router
- Added task controller functions with proper HTTP status codes
- Integrated task routes into the main application
- Added dummy data for testing and development

### PR #2: Export Additional Task Management Functions
- Exported `createTask`, `updateTask`, and `deleteTask` functions
- Enhanced module exports for better code reusability
- Completed the task management module interface

## 🛠️ Tech Stack

- **Node.js** (>= 18.0.0)
- **Express.js** (^4.18.2)
- **Nodemon** (^3.1.11) - Development dependency

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-api-akshayk-patel
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node app.js
```

For development with auto-reload:
```bash
npx nodemon app.js
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api/v1/tasks`

### Get All Tasks
```http
GET /api/v1/tasks
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Install Node.js, npm, and git",
    "completed": false,
    "status": "pending",
    "createdAt": "2025-11-18T16:03:15.000Z",
    "updatedAt": "2025-11-18T16:03:15.000Z"
  }
]
```

### Get Task by ID
```http
GET /api/v1/tasks/:id
```
**Response:** `200 OK` or `404 Not Found`
```json
{
  "id": 1,
  "title": "Task 1",
  "description": "Install Node.js, npm, and git",
  "completed": false,
  "status": "pending",
  "createdAt": "2025-11-18T16:03:15.000Z",
  "updatedAt": "2025-11-18T16:03:15.000Z"
}
```

### Create a New Task
```http
POST /api/v1/tasks
```
**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description"
}
```
**Response:** `201 Created`
```json
{
  "id": 5,
  "title": "New Task",
  "description": "Task description",
  "completed": false
}
```

### Update a Task
```http
PUT /api/v1/tasks/:id
```
**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```
**Response:** `200 OK` or `404 Not Found`

### Delete a Task
```http
DELETE /api/v1/tasks/:id
```
**Response:** `200 OK` or `404 Not Found`
```json
{
  "message": "Task deleted successfully"
}
```

## 📁 Project Structure

```
task-manager-api-akshayk-patel/
├── api/
│   └── v1/
│       └── tasks/
│           ├── index.js           # Task controller functions
│           └── index.route.js     # Task route definitions
├── test/
│   └── server.test.js             # API tests
├── app.js                         # Main application entry point
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project uses:
- **Supertest** (^6.3.4) - HTTP assertions
- **Tap** (^18.6.1) - Test framework

## 📝 Task Data Model

Each task contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | Number | Unique identifier |
| `title` | String | Task title |
| `description` | String | Task description |
| `completed` | Boolean | Completion status |
| `status` | String | Task status (e.g., "pending") |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## 🔧 Development

The API currently uses in-memory storage with dummy data. Tasks are stored in an array and will reset when the server restarts.

### Available Scripts

- `npm test` - Run test suite with tap
- `npm run pretest` - Verify Node.js version (>= 18)

## 🌟 Features

- ✅ RESTful API design
- ✅ Full CRUD operations
- ✅ Modular routing structure
- ✅ JSON request/response handling
- ✅ URL-encoded form data support
- ✅ Proper HTTP status codes
- ✅ Error handling for missing resources

## 📄 License

ISC

## 👨‍💻 Author

Airtribe - Backend Engineering Launchpad

---

**Note:** This is a learning project for backend development. The current implementation uses in-memory storage. For production use, consider integrating a database like MongoDB or PostgreSQL.

