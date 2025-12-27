# Assignment 1 : Task Manager API

A small RESTful API for managing tasks built with Node.js and Express. The project uses a JSON file (`models/task.json`) for storage and `zod` for request validation (`models/task.schema.js`). It's intended as a learning/demo project for CRUD operations and simple filtering.

**Tech stack:** Node.js, Express, Zod

**Key features:**

- Create, read, update, and delete tasks
- File-based JSON storage (`models/task.json`)
- Validation with `zod` (`models/task.schema.js`)
- Query filtering by `completed` and `priority`

## Prerequisites

- Node.js >= 18.0.0

## Installation

Install dependencies:

```bash
npm install
```

## Running the app

Start the server:

```bash
npm start
```

Development mode (auto-reload):

```bash
npm run dev
```

The server listens on port `3000` by default, so the base URL is:

```
http://localhost:3000
```

There is also a simple health endpoint at `/health`.

## Storage & Validation

- Data is persisted in [models/task.json](models/task.json).
- Request payloads are validated by [models/task.schema.js](models/task.schema.js). `priority` accepts one of: `low`, `medium`, `high`.

## API Endpoints

All examples assume the server is running at `http://localhost:3000`.

- **List tasks**
  - Method: `GET`
  - Endpoint: `/tasks`
  - Query parameters (optional):
    - `completed` — filter by completion status (`true` or `false`)
    - `priority` — filter by priority (`low`, `medium`, `high`)
  - Example curl:

```bash
curl "http://localhost:3000/tasks?completed=false&priority=high"
```

- **Get task by ID**
  - Method: `GET`
  - Endpoint: `/tasks/:id`
  - Example curl:

```bash
curl http://localhost:3000/tasks/3
```

- **Create a new task**
  - Method: `POST`
  - Endpoint: `/tasks`
  - Request body (JSON):

```json
{
  "title": "My task",
  "description": "Describe the task",
  "completed": false,
  "priority": "medium"
}
```

    - Example curl:

```bash
curl -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"My task","description":"Describe the task","completed":false,"priority":"medium"}'
```

    - Note: `creationDate` is set automatically by the server when creating a task.

- **Update a task**
  - Method: `PUT`
  - Endpoint: `/tasks/:id`
  - Request body: same shape as create (validated by Zod). Example:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}
```

    - Example curl:

```bash
curl -X PUT http://localhost:3000/tasks/3 \
	-H "Content-Type: application/json" \
	-d '{"title":"Updated title","description":"Updated description","completed":true,"priority":"high"}'
```

- **Delete a task**
  - Method: `DELETE`
  - Endpoint: `/tasks/:id`
  - Example curl:

```bash
curl -X DELETE http://localhost:3000/tasks/3
```

## Running tests

Run the test suite with:

```bash
npm test
```

The `pretest` script enforces Node.js >= 18.

## Notes & troubleshooting

- The API stores data in `models/task.json` — if multiple processes write simultaneously this can cause race conditions. For production use, switch to a proper database.
- Validation errors return HTTP 400 with a message about the invalid payload.
- Invalid IDs return HTTP 400; non-existent IDs return HTTP 404.

## Project structure

```
├── app.js              # Express app configuration
├── server.js           # Server entry point (port 3000)
├── controllers/        # Request handlers (CRUD + filtering)
├── models/             # Data models and schemas (task.json, task.schema.js)
├── routes/             # API routes
└── test/               # Test files
```

## License

MIT © 2025 Ahsas Sharma
