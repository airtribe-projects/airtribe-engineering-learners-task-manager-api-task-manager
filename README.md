# Task Manager API

## Overview

The **Task Manager API** is a simple RESTful API built with **Express.js** for managing tasks. It allows you to perform CRUD (Create, Read, Update, Delete) operations on tasks, along with additional features like filtering, sorting, and priority management. This API is designed to be easy to use and integrates seamlessly with tools like **Postman** or **curl** for testing.

---

## Setup Instructions

### Prerequisites

- **Node.js v18 or higher** (Download from [nodejs.org](https://nodejs.org/)).
    
- **npm** (comes bundled with Node.js).
    

### Installation

1. Clone the repository:
    
```bash
git clone https://github.com/your-repo/task-manager-api.git
cd task-manager-api
```
    
2. Install dependencies:

```bash
npm install
```
    
    
3. Start the server:
    
```bash
node app.
The server will start on `http://localhost:3000`.
```
    
    
    
4. Run tests:
    
```bash
npm test
```
    
    

---

## API Endpoints

### 1. **Get All Tasks**

- **Endpoint**: `GET /tasks`
    
- **Description**: Retrieve all tasks. Supports filtering by completion status and sorting by creation date.
    
- **Query Parameters**:
    
    - `completed`: Filter tasks by completion status (`true` or `false`).
        
    - `sort`: Sort tasks by creation date (`createdAt`).
        
- **Example Request**:
    
```bash
curl-X GET "http://localhost:3000/tasks?completed=true&sort=createdAt"
```
    
- **Response**:
    
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "low",
    "createdAt": "2023-10-01T12:00:00.000Z"
  }
]

```
    
    

---

### 2. **Get a Task by ID**

- **Endpoint**: `GET /tasks/:id`
    
- **Description**: Retrieve a specific task by its ID.
    
- **Example Request**:
        
```bash
curl -X GET http://localhost:3000/tasks/1
```
- **Response**:
    
```    json
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "low",
    "createdAt": "2023-10-01T12:00:00.000Z"
  }
```
    

---

### 3. **Create a Task**

- **Endpoint**: `POST /tasks`
    
- **Description**: Create a new task. The `priority` field is optional and defaults to `low`.
    
- **Request Body**:
    
```json
  {
    "title": "New Task",
    "description": "Task Description",
    "completed": false,
    "priority": "medium" // Optional
  }
```     
    
- **Example Request**:
```bash
  curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{
      "title": "New Task",
      "description": "Task Description",
      "completed": false
    }'
```
- **Response**:
    
```    json
{
  "id": 16,
  "title": "New Task",
  "description": "Task Description",
  "completed": false,
  "priority": "low",
  "createdAt": "2023-10-05T12:00:00.000Z"
}
```
    

---

### 4. **Update a Task**

- **Endpoint**: `PUT /tasks/:id`
    
- **Description**: Update an existing task by its ID.
    
- **Request Body**:
    
```    json
{
  "title": "Updated Task",
  "description": "Updated Description",
  "completed": true,
  "priority": "high" // Optional
}
```
    
- **Example Request**:
    
```    bash
  curl -X PUT http://localhost:3000/tasks/1 \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Updated Task",
      "description": "Updated Description",
      "completed": true
    }'
```
- **Response**:
    
```    json
  {
    "id": 1,
    "title": "Updated Task",
    "description": "Updated Description",
    "completed": true,
    "priority": "high",
    "createdAt": "2023-10-01T12:00:00.000Z"
  }
```
    

---

### 5. **Delete a Task**

- **Endpoint**: `DELETE /tasks/:id`
    
- **Description**: Delete a task by its ID.
    
- **Example Request**:
    
```    bash
curl -X DELETE http://localhost:3000/tasks/1
```
    
- **Response**:
    
```    json
{
  "message": "Task deleted successfully"
}
```
    

---

### 6. **Get Tasks by Priority**

- **Endpoint**: `GET /tasks/priority/:level`
    
- **Description**: Retrieve tasks by priority level (`low`, `medium`, or `high`).
    
- **Example Request**:
    
```    bash
curl -X GET http://localhost:3000/tasks/priority/high
```
    
- **Response**:
    
```    json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": "2023-10-01T12:00:00.000Z"
  }
]
```
    

---

## Testing the API

### Using Postman

1. Import the following collection into Postman:
    
    - Postman Collection JSON (Replace with a link to your collection if available).
        
2. Use the provided requests to test all endpoints.
    

### Using `curl`

- Use the example `curl` commands provided in the **API Endpoints** section above.
    

### Running Automated Tests

- Run the included test suite using:
    
```bash
npm run test
```
    

---

## Data Structure

Tasks are stored in `task.json` with the following schema:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "completed": false,
      "priority": "low",
      "createdAt": "2023-10-01T12:00:00.000Z"
    }
  ]
}
```