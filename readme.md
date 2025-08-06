# Task Manager API

This is a simple RESTful API built using **Node.js** and **Express** that allows users to manage a list of tasks. You can create, read, update, and delete tasks through HTTP requests. The API also includes basic input validation and error handling.

---

## 📦 Features

- Retrieve all tasks
- Get a specific task by ID
- Create new tasks
- Update existing tasks
- Delete tasks
- Input validation and error handling

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager-api.git
   cd task-manager-api
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
npm start
The server will start on http://localhost:3000

🧪 Testing the API
You can use Postman, Insomnia, or curl to test the endpoints.

Base URL
arduino
Copy
Edit
http://localhost:3000
📘 API Endpoints
1. Get All Tasks
Endpoint: GET /tasks

Description: Retrieves all tasks.

Response: List of task objects.

2. Get Task by ID
Endpoint: GET /tasks/:id

Description: Retrieves a task by its ID.

Response: Task object if found, or 404 if not.

3. Create a New Task
Endpoint: POST /tasks

Description: Creates a new task.

Body:

json
Copy
Edit
{
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
Response: Created task object, or 400 for invalid input.

4. Update a Task
Endpoint: PUT /tasks/:id

Description: Updates an existing task.

Body:

json
Copy
Edit
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
Response: Updated task object, or 404 if not found, or 400 for invalid input.

5. Delete a Task
Endpoint: DELETE /tasks/:id

Description: Deletes a task by ID.

Response: Success message or 404 if not found.

⚠️ Error Handling
400 Bad Request: Invalid input (e.g. empty title, description, or invalid completed value).

404 Not Found: Task not found for given ID.

🛠️ Future Improvements
Persistent storage with MongoDB

User authentication

Filtering and pagination

📄 License
This project is open source and free to use under the MIT License.

yaml
Copy
Edit

---

Just copy and paste this into a `README.md` file in your project folder. Let me know if you want to genera