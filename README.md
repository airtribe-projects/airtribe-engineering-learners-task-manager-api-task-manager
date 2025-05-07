# Task Manager API

A RESTful API for managing tasks built with Express.js. This API allows you to create, read, update, and delete tasks with features like priority levels and completion status.

## Features

- Create, read, update, and delete tasks
- Filter tasks by completion status
- Filter tasks by priority level
- Sort tasks by creation date
- Task properties include title, description, priority, and completion status

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node app.js
```

The server will start running on `http://localhost:3000`

## API Documentation

### Get All Tasks
- **Endpoint:** `GET /tasks`
- **Query Parameters:**
  - `completed`: Filter tasks by completion status (true/false)
- **Response:** Returns a list of tasks sorted by creation date (newest first)
- **Example:**
```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks?completed=true
```

### Get Tasks by Priority
- **Endpoint:** `GET /tasks/priority/:level`
- **Parameters:**
  - `level`: Priority level (0, 1, 2, etc.)
- **Response:** Returns tasks matching the specified priority level
- **Example:**
```bash
curl http://localhost:3000/tasks/priority/1
```

### Get Task by ID
- **Endpoint:** `GET /tasks/:id`
- **Parameters:**
  - `id`: Task ID
- **Response:** Returns the task with the specified ID
- **Example:**
```bash
curl http://localhost:3000/tasks/1
```

### Create New Task
- **Endpoint:** `POST /tasks`
- **Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "priority": 1,
    "completed": false
  }
  ```
- **Required Fields:** title, description
- **Optional Fields:** priority (defaults to 0), completed (must be boolean)
- **Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description","priority":1,"completed":false}'
```

### Update Task
- **Endpoint:** `PUT /tasks/:id`
- **Parameters:**
  - `id`: Task ID
- **Body:** Same as POST request
- **Required Fields:** title, description
- **Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated description","priority":2,"completed":true}'
```

### Delete Task
- **Endpoint:** `DELETE /tasks/:id`
- **Parameters:**
  - `id`: Task ID
- **Response:** Returns the deleted task
- **Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Testing the API

You can test the API using any of the following methods:

1. **cURL** commands as shown in the examples above
2. **Postman** or similar API testing tools
3. **Web browser** for GET requests
4. **JavaScript fetch API** or **Axios** for frontend applications

Example using JavaScript fetch:
```javascript
// Get all tasks
fetch('http://localhost:3000/tasks')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a new task
fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    priority: 1,
    completed: false
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
``` 