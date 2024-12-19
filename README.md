# Task Manager API

This is a RESTful API for managing tasks, built using Node.js, Express.js, and file-based data storage with a `tasks.json` file. The API supports basic CRUD operations, error handling, input validation, and task filtering.

## Features
- Create, retrieve, update, and delete tasks.
- Input validation for required fields.
- Persistent data storage using a `tasks.json` file.
- Filter tasks by title using query parameters.

## Technologies Used
- **Node.js**
- **Express.js**
- **File System (fs)** for data storage

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

4. The server will start at `http://localhost:3000`.

## API Endpoints

### Base URL
`http://localhost:3000`

### 1. Create a Task
- **POST** `/tasks`
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description"
  }
  ```

### 2. Get All Tasks
- **GET** `/tasks`
- **Query Parameters**:
  - `title` (optional): Filter tasks by title.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description"
    }
  ]
  ```

### 3. Get a Task by ID
- **GET** `/tasks/:id`
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description"
  }
  ```

### 4. Update a Task
- **PUT** `/tasks/:id`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```

### 5. Delete a Task
- **DELETE** `/tasks/:id`
- **Response**: HTTP 204 (No Content)

## Testing Instructions
1. Use [Postman](https://www.postman.com/) or `curl` to test the endpoints.
2. Example `curl` commands:
   - **Create a Task**:
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"title": "New Task", "description": "Task Details"}' http://localhost:3000/tasks
     ```
   - **Get All Tasks**:
     ```bash
     curl -X GET http://localhost:3000/tasks
     ```
   - **Update a Task**:
     ```bash
     curl -X PUT -H "Content-Type: application/json" -d '{"title": "Updated Task"}' http://localhost:3000/tasks/1
     ```
   - **Delete a Task**:
     ```bash
     curl -X DELETE http://localhost:3000/tasks/1
     ```

## Project Submission
1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Initial API implementation"
   git push origin main
   ```
2. Create a Pull Request to the `feedback` branch.
3. Submit the PR link for review.

## License
This project is licensed under the MIT License.

