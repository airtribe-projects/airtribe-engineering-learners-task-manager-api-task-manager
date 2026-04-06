# Task Manager API

A simple RESTful API for managing tasks, built with **Node.js** and **Express.js**. This API allows you to create, retrieve, update, and delete tasks.

Data is stored in-memory using a local JSON file (`task.json`) upon initialization.

## Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** (Node Package Manager)

## Installation

1. Clone or download the repository.
2. Navigate to the project directory:
   ```bash
   cd task-manager-api-2001Aswin89
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Getting Started

### Start the Development Server

To start the server using `nodemon` (auto-reloads on file changes):

```bash
npm run dev
```

The server will start on port `3000` (by default) and you will see:
`Server running on port 3000`

### Run Tests

To execute the test suite (uses `tap` and `supertest`):

```bash
npm test
```

*Note: The test script checks if the minimum required Node.js version is satisfied (>= 18).*

## API Endpoints

The API base URL for tasks is `/tasks`.

### `GET /tasks`
Retrieves a list of all tasks. 
- **Response**: `200 OK`, JSON array of task objects.

### `GET /tasks/:id`
Retrieves details of a specific task by its integer ID.
- **Path Parameter**: `id` - The numeric ID of the task.
- **Success Response**: `200 OK`, JSON object of the requested task.
- **Error Response**: `404 Not Found` if the task does not exist.

### `POST /tasks`
Creates a newly formatted task.
- **Request Body (JSON)**:
  ```json
  {
    "title": "String (required)",
    "description": "String (required)",
    "completed": "Boolean (required)"
  }
  ```
- **Success Response**: `201 Created`, JSON object of the newly created task including the generated `id`.
- **Error Response**: `400 Bad Request` if data validates incorrectly.

### `PUT /tasks/:id`
Updates an existing task corresponding to the specific integer ID.
- **Path Parameter**: `id` - The numeric ID of the task to update.
- **Request Body (JSON)**:
  ```json
  {
    "title": "String (required)",
    "description": "String (required)",
    "completed": "Boolean (required)"
  }
  ```
- **Success Response**: `200 OK`, JSON object representing the newly updated task.
- **Error Responses**: 
  - `400 Bad Request` for invalid data structures.
  - `404 Not Found` if the task does not exist.

### `DELETE /tasks/:id`
Deletes a specific task permanently by its integer ID.
- **Path Parameter**: `id` - The numeric ID of the task to delete.
- **Success Response**: `200 OK`, with a `{"message": "Task deleted successfully"}`.
- **Error Response**: `404 Not Found` if the task does not exist.

## Project Structure
- `src/app.js`: Express application configuration and middleware execution.
- `src/index.js`: Server entry file connecting the app on the designated port.
- `src/routes/`: Express router containing specific routes for tasks.
- `src/controllers/`: Handle logical flow for requests and responses.
- `src/data/`: Simple module to initialize dataset loading from `task.json`.
- `test/`: Contains comprehensive automated endpoint integration tests using `tap` and `supertest`.
