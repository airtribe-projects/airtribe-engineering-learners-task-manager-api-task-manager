# Task Manager API

An in-memory RESTful Task Manager API built using **Node.js**, **Express**, and **Zod**.

---

## What is Implemented & How APIs are Written

- **Architecture**: Express server (`app.js`) performing in-memory CRUD operations, initialized with task data from `task.json`.
- **Validation**: `Zod` schema enforces required fields:
  - `title`: Non-empty string
  - `description`: Non-empty string
  - `completed`: Boolean (`true`/`false`)
- **Error Handling**: Proper HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`) with JSON messages.

---

## API Endpoints

- **`GET /tasks`**: Retrieve all tasks.
- **`GET /tasks/:id`**: Retrieve a single task by ID (`404` if not found).
- **`POST /tasks`**: Create a new task (`400` if validation fails).
- **`PUT /tasks/:id`**: Update an existing task by ID (`404` if not found, `400` if validation fails).
- **`DELETE /tasks/:id`**: Delete a task by ID (`404` if not found).

---

## How Test Cases are Tested

Automated test cases are written using **Tap** and **Supertest** in `test/server.test.js` to verify all 5 endpoints for both valid inputs and error conditions (`400`/`404`).

### Run Tests Command

```bash
npm test
```
*(Runs all 10 unit test cases instantly)*
