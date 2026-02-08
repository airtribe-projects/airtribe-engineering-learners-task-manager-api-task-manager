# Tasks Manager Service

This is a REST API service for managing tasks.

---

## Routes

| Method | Route       | Description                                                                                        |
| ------ | ----------- | -------------------------------------------------------------------------------------------------- |
| GET    | /tasks      | Get all tasks sorted by date (latest first).                                                       |
| GET    | /tasks/:id  | Get a specific task by id.                                                                         |
| POST   | /task       | Create a new task. Body must have valid title (string), description (string), completed (boolean). |
| PUT    | /tasks/:id  | Update a task by id.                                                                               |
| DELETE | /tasks/:id  | Delete a task by id.                                                                               |

---

## Models

### Tasks Model

| Field       | Type              | Description                                                                 |
| ----------- | ----------------- | --------------------------------------------------------------------------- |
| id          | integer           | Unique id for each task, generated at runtime based on the number of tasks. |
| title       | string            | Title of the task.                                                          |
| description | string            | Description of the task.                                                    |
| completed   | boolean           | Whether the task is completed or not.                                       |
| createdAt   | date-ISO-string   | Timestamp of creation date.                                                 |
| updatedAt   | date-ISO-string   | Timestamp of last update date.                                              |

---

## Prerequisites

Create a `.env` file with a `PORT` variable.

---

## Commands

| Command         | Description   |
| --------------- | ------------- |
| `npm install`   | Install deps  |
| `node app.js`   | Start server  |
| `npm run test`  | Run tests     |
