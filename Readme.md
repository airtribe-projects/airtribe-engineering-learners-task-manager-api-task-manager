# Task Manager API

## Overview
A simple RESTful API to manage tasks with CRUD operations and filtering.

## Endpoints

### 1. Get All Tasks
**GET /tasks**
- `completed` (optional): Filter by completion status.

### 2. Get a Single Task
**GET /tasks/:id**

### 3. Add a New Task
**POST /tasks**
```json
{
    "title": "Complete project",
    "description": "Finish the backend API",
    "completed": false,
    "priority": "medium"
}
```

### 4. Update a Task
**PUT /tasks/:id**
```json
{
    "title": "Setup environment",
    "completed": true
}
```

### 5. Delete a Task
**DELETE /tasks/:id**

### 6. Filter Tasks by Priority
**GET /tasks/priority/:level**

## Setup Instructions
### Prerequisites
- Node.js

### Installation
1. Clone the repo:
     ```sh
     git clone https://github.com/your-repo/task-manager-api.git
     ```
2. Navigate to the directory:
     ```sh
     cd task-manager-api
     ```
3. Install dependencies:
     ```sh
     npm install
     ```

### Running the Server
```sh
npm start
```
Server runs on `http://localhost:3000/`.

## Technologies Used
- Node.js
- Express.js
- JSON (or a database)

## Contributors
- Your Name (@codingraft)
