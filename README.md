# Task Manager API

A small REST API for managing tasks. Built with Express as part of the Airtribe backend cohort.

Tasks live in memory — they're loaded from `task.json` when the server boots, and any changes you make are lost on restart. That's intentional for this stage; no database yet.

## Getting it running

```bash
git clone https://github.com/airtribe-projects/task-manager-api-vishal-tech-7.git
cd task-manager-api-vishal-tech-7
npm install
node app.js
```

The server listens on port 3000.

To run the test suite:

```bash
npm test
```

Note that the tests take a while to finish — the server keeps listening after the assertions pass, so tap waits for the process. That's expected.

## What a task looks like

```json
{
  "id": 1,
  "title": "Install Express",
  "description": "Install Express and set up the server",
  "completed": false
}
```

## Endpoints

### `GET /tasks`

Returns every task.

```bash
curl http://localhost:3000/tasks
```

Always returns 200 with an array.

### `GET /tasks/:id`

Returns one task.

```bash
curl http://localhost:3000/tasks/1
```

Returns 200 with the task, or 404 if there's no task with that id.

### `POST /tasks`

Creates a task. You need to send `title`, `description`, and `completed`.

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write the README","description":"Document the endpoints","completed":false}'
```

Returns 201 with the created task, including its new id.

Returns 400 if `title` or `description` is missing, not a string, or empty (whitespace-only counts as empty), or if `completed` isn't a boolean.

The id is assigned for you — it's one higher than the largest existing id, so deleting a task in the middle won't cause a collision later.

### `PUT /tasks/:id`

Replaces a task. Same three fields are required, same validation rules as POST.

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description","completed":true}'
```

Returns 200 with the updated task, 404 if the id doesn't exist, or 400 if the body is invalid.

This is a full replace, not a patch — send all three fields.

### `DELETE /tasks/:id`

Deletes a task and returns it.

```bash
curl -X DELETE http://localhost:3000/tasks/3
```

Returns 200 with the deleted task, or 404 if it wasn't there.

## Trying it out

Start the server in one terminal and run curl in another. A few cases worth checking beyond the happy path:

```bash
# empty title — should be 400
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","description":"x","completed":false}'

# whitespace-only title — also 400
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   ","description":"x","completed":false}'

# task that doesn't exist — 404
curl -i http://localhost:3000/tasks/999
```

Postman works just as well if you'd rather click than type — point it at `http://localhost:3000` and set the body type to raw JSON.

## Errors

Everything that goes wrong comes back as JSON:

| Status | Body | When |
|---|---|---|
| 400 | `{"error":"Invalid task data"}` | Missing, wrongly typed, or empty fields |
| 404 | `{"error":"Task not found"}` | No task with that id |
