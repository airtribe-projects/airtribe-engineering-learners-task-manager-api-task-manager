# Task Management API

This is a simple API for managing tasks. It allows you to create, read, update, and delete tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

- [API Endpoints](#api-endpoints)
- [Data Structure](#data-structure)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   ```
   (You can change the port number if needed)
4. Start the server:
   ```
   npm run dev
   ```

## Usage

The API will be available at `http://localhost:3000` (or whatever port you specified in the `.env` file).

## API Endpoints

### GET /api/v1/tasks
- Retrieves all tasks
- Response: Array of task objects

### GET /api/v1/tasks/:id
- Retrieves a specific task by ID
- Response: Task object or 404 if not found

### POST /api/v1/tasks
- Creates a new task
- Request body: { title, description, completed }
- Response: Created task object

### PUT /api/v1/tasks/:id
- Updates an existing task
- Request body: { title, description, completed }
- Response: Updated task object or 404 if not found

### DELETE /api/v1/tasks/:id
- Deletes a task
- Response: Success message or 404 if not found

## Data Structure - An array of objects with the following structure:

```
{
  "tasks": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description 1",
      "completed": false
    },
    {
      "id": 2,
      "title": "Task 2",
      "description": "Description 2",
      "completed": true
    },
    ...
  ]
}
```

## Middleware

The `validateTaskInput` middleware is used to validate the request body for creating and updating tasks. It ensures that the title and description are not empty strings and that the completed field is a boolean value.

## Error Handling

The API uses custom error handlers to handle errors and send appropriate responses.

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `body-parser`: Middleware to parse request bodies
- `dotenv`: Middleware to load environment variables from a `.env` file

