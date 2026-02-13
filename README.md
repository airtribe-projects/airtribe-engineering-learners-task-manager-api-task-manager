## Overview

This project is a simple RESTful API for managing tasks. It allows users to create, read, update, and delete tasks stored in a JSON file. Each task has an `id`, `title`, `description`, and a `completed` status. The API supports filtering and sorting tasks when retrieving the list.

Built using Node.js and Express, with data persistence handled via a JSON file (`task.json`).

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Ensure `task.json` file exists:**

   The project expects a `task.json` file at the root or specified path with the following structure:

   ```json
   {
     "tasks": []
   }
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`.

---

## API Endpoints

### 1. Get All Tasks

- **URL:** `/tasks`
- **Method:** `GET`
- **Query Parameters:**
  - `completed` (optional): Filter tasks by completion status (`true` or `false`).
  - `sort` (optional): Sort tasks by `id`. Values: `asc` (ascending), `desc` (descending).
- **Response:** Returns an array of task objects.

**Example Request:**

```bash
curl "http://localhost:3000/tasks?completed=true&sort=asc"
```

---

### 2. Get Task by ID

- **URL:** `/tasks/:id`
- **Method:** `GET`
- **URL Params:**
  - `id` (required): The ID of the task to retrieve.
- **Response:** Returns the task object with the specified ID.
- **Error:** Returns 404 if task not found.

**Example Request:**

```bash
curl http://localhost:3000/tasks/1
```

---

### 3. Create a New Task

- **URL:** `/tasks`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
  - `title` (string, required)
  - `description` (string, required)
  - `completed` (boolean, required)
- **Response:** Returns the newly created task object with assigned `id`.
- **Error:** Returns 400 if required fields are missing or invalid.

**Example Request:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task details","completed":false}'
```

---

### 4. Update an Existing Task

- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **URL Params:**
  - `id` (required): The ID of the task to update.
- **Headers:** `Content-Type: application/json`
- **Body Parameters:**
  - `title` (string, required)
  - `description` (string, required)
  - `completed` (boolean, required)
- **Response:** Returns the updated task object.
- **Error:** Returns 400 if required fields are missing or invalid, 404 if task not found.

**Example Request:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated details","completed":true}'
```

---

### 5. Delete a Task

- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **URL Params:**
  - `id` (required): The ID of the task to delete.
- **Response:** Returns status 200 on successful deletion.
- **Error:** Returns 404 if task not found.

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## Notes

- The API uses a JSON file (`task.json`) for data storage. Ensure the file is writable by the server.
- The `completed` field must be a boolean (`true` or `false`).
- The server listens on port `3000` by default.
- CORS is enabled to allow cross-origin requests.

## License

This project is open source and available under the MIT License.





































<!-- # 📝 Task Manager API

A simple **Task Manager REST API** built with **Node.js** and **Express**.  
It allows you to **create, read, update, and delete tasks (CRUD)** stored in a local JSON file.  
The API also supports **filtering, sorting, and validation**.

---

## 🚀 Features
- Create, read, update, and delete tasks
- Filter tasks by completion status (`completed=true/false`)
- Sort tasks by ID (`asc` or `desc`)
- JSON-based storage (`task.json`)
- Error handling with proper HTTP status codes

---

## 📂 Project Structure
project/
│
├── server.js # Entry point: starts Express server & routes
├── src/
│ └── controller/
│ └── taskController.js # Handles CRUD logic for tasks
├── task.json # Local JSON database for tasks
└── package.json # Project metadata & dependencies
---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone <your-repo-url>
cd <project-folder>

2️⃣ Install Dependencies
bash
Copy code
npm install

3️⃣ Run the Server
bash
Copy code
node server.js

# By default, the server runs on: http://localhost:3000

### 🔗 API Endpoints
1. Get All Tasks

# GET /tasks
Returns all tasks.

Query params:

completed=true|false → filter by completion status

sort=asc|desc → sort tasks by ID

✅ Example:

# GET /tasks?completed=false&sort=asc

2. Get Task by ID

# GET /tasks/:id
Returns a single task by its id.

✅ Example:

GET /tasks/3

3. Create a Task
bash
Copy code
POST /tasks
Creates a new task.

Request body:

{
  "title": "Install Express",
  "description": "Set up Express for the project",
  "completed": false
}
4. Update a Task
bash
Copy code
PUT /tasks/:id
Updates an existing task by id.

Request body (all fields required):

{
  "title": "Learn Express",
  "description": "Practice Express routing",
  "completed": true
}
5. Delete a Task

DELETE /tasks/:id
Deletes a task by its id.

✅ Example:


DELETE /tasks/2
🧪 Testing the API

curl http://localhost:3000/tasks
Using Postman
Open Postman

Create a new request

Choose the HTTP method (GET, POST, PUT, DELETE)

For POST and PUT, set body type to raw JSON

Send request and view the response

✅ Example task.json

```{
  "tasks": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Generate project using Express generator",
      "completed": false
    }
  ]
}```


📜 License
# This project is open-source and available under the MIT License.
 -->
