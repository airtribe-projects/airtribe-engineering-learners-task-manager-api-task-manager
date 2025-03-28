# Task Management API

This is a simple **Task Management API** built using **Node.js** and **Express.js**. It allows users to **create, read, update, and delete (CRUD)** tasks with validation.

## Features
- **Create a new task** with title, description, status, and due date.
- **Retrieve all tasks** with optional filtering by status and due date.
- **Retrieve a single task** by its ID.
- **Update a task** (full or partial updates).
- **Delete a task**.
- **Error handling** for invalid requests.

## Technologies Used
- Node.js
- Express.js
- Postman (for API testing)

## Installation

1. **Clone the repository**
```sh
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
```
2. **Install dependencies**
```sh
npm install
```
3. **Start the server**
```sh
node index.js
```
or (if using nodemon for development)
```sh
npx nodemon index.js
```

## API Endpoints

### 1️⃣ Create a New Task
**POST** `/tasks`
```json
{
  "title": "Finish Node.js Project",
  "description": "Complete the task management API with validation",
  "status": "pending",
  "dueDate": "2025-03-10"
}
```

### 2️⃣ Get All Tasks
**GET** `/tasks`

### 3️⃣ Get a Task by ID
**GET** `/tasks/{id}`

### 4️⃣ Update a Task (Full Update)
**PUT** `/tasks/{id}`
```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in progress",
  "dueDate": "2025-03-12"
}
```

### 5️⃣ Update a Task (Partial Update)
**PATCH** `/tasks/{id}`
```json
{
  "status": "completed"
}
```

### 6️⃣ Delete a Task
**DELETE** `/tasks/{id}`

## Notes
- Make sure **Postman** is set to **raw JSON** for sending requests.
- The API runs on **http://localhost:3000** by default.

## License
This project is licensed under the MIT License.



