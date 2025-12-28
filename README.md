# Task Manager API

## Overview

This project is a simple **Task Manager REST API** built with **Node.js + Express**. It loads an initial list of tasks from `task.json` on startup and exposes CRUD endpoints to create, read, update, and delete tasks.

**Note on persistence:** updates are stored **in-memory** while the server is running. The API currently **does not write changes back** to `task.json`.

## Tech stack

- **Runtime**: Node.js (>= 18)
- **Framework**: Express
- **Tests**: `tap` + `supertest`

## Project structure

- `app.js`: Express app + all routes
- `task.json`: seed data loaded on server start
- `test/server.test.js`: API tests

## Setup

### Prerequisites

- **Node.js 18+**
- **npm**

### Install dependencies

```bash
npm install
```

## Running the server

The API listens on **port 3000**.

```bash
node app.js
```

You should see a log like:

```text
Server is listening on 3000
```

Base URL:

- `http://localhost:3000`

## API endpoints

### Data model

A task has the following shape:

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

### Validation rules (POST/PUT)

Requests to create/update a task must include:

- `title` (required)
- `description` (required)
- `completed` (required, must be a boolean: `true` or `false`)

If validation fails, the API responds with **400**:

```json
{ "error": "Invalid task data" }
```

### GET `/tasks`

- **Description**: Get all tasks
- **Success**: `200 OK`

Example:

```bash
curl http://localhost:3000/tasks
```

### GET `/tasks/:id`

- **Description**: Get a single task by id
- **Success**: `200 OK`
- **Not found**: `404 Not Found`

Example:

```bash
curl http://localhost:3000/tasks/1
```

Not found response:

```json
{ "error": "Task not found" }
```

### POST `/tasks`

- **Description**: Create a new task
- **Success**: `201 Created` (returns created task)
- **Validation error**: `400 Bad Request`

Request body:

```json
{
  "title": "New Task",
  "description": "New Task Description",
  "completed": false
}
```

Example:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"New Task Description","completed":false}'
```

### PUT `/tasks/:id`

- **Description**: Replace an existing task (full update)
- **Success**: `200 OK` (returns updated task)
- **Not found**: `404 Not Found`
- **Validation error**: `400 Bad Request`

Request body (same validation as POST):

```json
{
  "title": "Updated Task",
  "description": "Updated Task Description",
  "completed": true
}
```

Example:

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated Task Description","completed":true}'
```

### DELETE `/tasks/:id`

- **Description**: Delete a task by id
- **Success**: `200 OK` (returns deleted task)
- **Not found**: `404 Not Found`

Example:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## How to test the API

### Automated tests

This repo includes API tests in `test/server.test.js` using `tap` + `supertest`.

```bash
npm test
```

### Manual testing (curl)

1. Start the server:

```bash
node app.js
```

2. Try endpoints using the examples above (GET/POST/PUT/DELETE).

### Manual testing (Postman)

1. Create a new collection.
2. Add requests for each endpoint using base URL `http://localhost:3000`.
3. For POST/PUT, set header `Content-Type: application/json` and provide a JSON body matching the validation rules.


