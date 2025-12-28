# Task Manager API

The Task Manager API is a simple backend application that allows users to manage tasks. It supports basic CRUD operations and includes input validation and error handling.

## Features

### CRUD Operations
- **GET /tasks**: Retrieve all tasks.
- **GET /tasks/:id**: Retrieve a specific task by its ID.
- **POST /tasks**: Create a new task with the following fields:
  - `title` (string, required)
  - `description` (string, required)
  - `completed` (boolean, default: `false`)
- **PUT /tasks/:id**: Update an existing task's details using its ID.
- **DELETE /tasks/:id**: Delete a task by its ID.
### Additional Features
- **Filtering by Completion Status**:
  - Use the `completed` query parameter in `GET /tasks` to filter tasks by their completion status.
  - Example: `GET /tasks?completed=true`
- **Sorting by Creation Date**:
  - Use the `sort` query parameter in `GET /tasks` to sort tasks by their creation date.
  - Example: `GET /tasks?sort=createdAt`
- **Priority-Based Task Management**:
  - Tasks include a `priority` field with allowed values: `low`, `medium`, `high`.
  - Retrieve tasks by priority level using `GET /tasks/priority/:level`.
  - Example: `GET /tasks/priority/high`

### Input Validation & Error Handling
- **Input Validation**:
  - `title` and `description` must not be empty.
  - `completed` must be a boolean value.
- **Error Handling**:
  - `404 Not Found`: Returned when a task with the specified ID does not exist.
  - `400 Bad Request`: Returned for invalid input data.

