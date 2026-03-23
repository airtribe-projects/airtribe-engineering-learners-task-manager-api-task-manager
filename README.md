# Task Manager API

A simple and efficient RESTful API for managing tasks, built with Express.js and Node.js.

## Description

Task Manager API is a backend service that allows you to create, read, update, and delete tasks. Tasks are persisted in a JSON file, making it a lightweight solution for task management without requiring a database.

## Features

- ✅ **Create tasks** - Add new tasks with title, description, and completion status
- ✅ **Retrieve tasks** - Get all tasks or fetch a specific task by ID
- ✅ **Update tasks** - Modify existing task details
- ✅ **Delete tasks** - Remove tasks from the system
- ✅ **Data validation** - Ensures all tasks have required fields with correct types
- ✅ **Persistent storage** - Tasks are saved to `task.json` file

## Requirements

- **Node.js**: Version 18 or higher
- **npm**: Node Package Manager

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Starting the Server

```bash
node app.js
```

The server will start on port 3000 and display:
```
Server is listening on 3000
```

### API Endpoints

#### Create a New Task
**POST** `/tasks`

Request body:
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

Response (201 Created):
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

#### Get All Tasks
**GET** `/tasks`

Response (200 OK):
```json
[
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "completed": false
  }
]
```

#### Get Single Task
**GET** `/tasks/:id`

Response (200 OK):
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

#### Update a Task
**PUT** `/tasks/:id`

Request body:
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

Response (200 OK):
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

#### Delete a Task
**DELETE** `/tasks/:id`

Response (200 OK): Empty response with status 200

### Error Responses

- **400 Bad Request**: Invalid task data (missing required fields or invalid types)
- **404 Not Found**: Task ID does not exist

## Testing

Run all tests:
```bash
npm run test
```

Tests include:
- Creating new tasks
- Validating task data
- Retrieving all tasks
- Retrieving individual tasks
- Updating tasks
- Deleting tasks

The test suite uses [Tap](https://node-tap.org/) for testing and [Supertest](https://github.com/visionmedia/supertest) for HTTP assertions.

## Project Structure

```
.
├── app.js              # Main Express application and route handlers
├── package.json        # Project dependencies and scripts
├── task.json          # Task data storage file
├── test/
│   └── server.test.js # Test suite
└── README.md          # This file
```

## Development

This project is built with:
- **Express.js** - Web framework for Node.js
- **Node.js fs module** - File system operations for data persistence
- **Tap** - Testing framework
- **Supertest** - HTTP assertion library

## License

ISC
