## Task Manager (Express) by [Aryan](https://aryank.space)

Simple JSON-file task API with CRUD, validation, filtering, sorting, and priority.

### Setup

-   Prereq: Node 18+
-   Install: `pnpm install`
-   Run: `node app.js`
-   Test: `pnpm test`

### Data Model

Task: `{ id, title, description, completed, priority, createdAt }`

-   `priority`: `low|medium|high` (default: `low`)

### Endpoints

-   GET `/tasks` — list
    -   Query: `completed=true|false`, `sort=createdAt&order=asc|desc`
-   GET `/tasks/:id` — get by id
-   POST `/tasks` — create (title, description, completed[, priority])
-   PUT `/tasks/:id` — update (title, description, completed[, priority])
-   DELETE `/tasks/:id` — delete
-   GET `/tasks/priority/:level` — by priority

### Curl Examples

List:

```bash
curl 'http://localhost:3000/tasks?completed=true&sort=createdAt&order=desc'
```

Create:

```bash
curl -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' \
  -d '{"title":"Demo","description":"Desc","completed":false,"priority":"high"}'
```

Get by id:

```bash
curl http://localhost:3000/tasks/1
```

Update:

```bash
curl -X PUT http://localhost:3000/tasks/1 -H 'Content-Type: application/json' \
  -d '{"title":"Up","description":"Up desc","completed":true,"priority":"medium"}'
```

Delete:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

By priority:

```bash
curl http://localhost:3000/tasks/priority/high
```
