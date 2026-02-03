# Task Manager API

A RESTful API for managing tasks with features like priority levels, task status tracking, and timestamps. Built with Node.js, Express, and MongoDB.

## Features

- **Create, Read, Update, Delete (CRUD)** tasks
- **Sort tasks** by creation date
- **Automatic timestamps** (createdAt, updatedAt)
- **Centralized error handling** with consistent JSON error responses
- **Input validation** middleware for robust data validation
- **Priority levels**: low, medium, high


## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** (if needed for MongoDB connection):
   ```
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   NODE_ENV=development
   PORT=3030
   ```

4. **Update database connection** in `db.js` with your MongoDB URI

5. **Start the server:**
   ```bash
   npm run start
   ```

   Or with nodemon (auto-reload):
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:${PORT}` (default: 3000).

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

Base URL: `http://localhost:3000`  
Tasks base path: `GET/POST/PUT/DELETE /api/v1`

- Get all tasks
   - Method: `GET`
   - Path: `/tasks`
   - Description: Return all tasks sorted by newest first.
   - Response (200):
     ```json
     { "success": true, "data": [ /* array of tasks */ ] }
     ```

- Get task by id
   - Method: `GET`
   - Path: `/tasks/:id`
   - Path params:
      - `id` — Task ObjectId
   - Response (200):
     ```json
     { "success": true, "data": { /* task details*/ } }
     ```

- Get tasks by priority
   - Method: `GET`
   - Path: `/tasks/priority/:priorityLevel`
   - Path params:
      - `priorityLevel` — one of `low`, `medium`, `high`
   - Response (200):
     ```json
     { "success": true, "data": [ /* tasks matching priority */ ] }
     ```

- Search tasks by title or description
   - Method: `GET`
   - Path: `/tasks/search/:searchTerm`
   - Path params:
      - `searchTerm` — substring to match in title or description
   - Response (200):
     ```json
     { "success": true, "data": [ /* matching tasks */ ] }
     ```

- Create a new task
   - Method: `POST`
   - Path: `/tasks`
   - Body (JSON):
     ```json
     {
       "title": "Buy groceries",
       "description": "Milk, eggs",
       "priorityLevel": "LOW"    // allowed: LOW, MEDIUM, HIGH
     }
     ```
   - Response (201):
     ```json
     { "success": true, "data": { /* task details*/ } }
     ```

- Update a task
   - Method: `PUT`
   - Path: `/tasks/:id`
   - Path params:
      - `id` — Task ObjectId
   - Body (JSON): partial or full task fields to update (same shape as create)
   - Response (200):
     ```json
     { "success": true, "data": { /* updated task */ } }
     ```

- Delete a task
   - Method: `DELETE`
   - Path: `/tasks/:id`
   - Path params:
      - `id` — Task ObjectId
   - Response (200):
     ```json
     { "success": true, "data": {} }
     ```

