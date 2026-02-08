const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const taskData = require("./task.json");

let tasks = [...taskData.tasks];

// Validation helper
function isValidTask(task) {
  return (
    task &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.completed === "boolean"
  );
}

/**
 * GET /tasks
 */
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

/**
 * GET /tasks/:id
 */
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

/**
 * POST /tasks
 */
app.post("/tasks", (req, res) => {
  if (!isValidTask(req.body)) {
    return res.status(400).json({ error: "Invalid task data" });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    ...req.body,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * PUT /tasks/:id
 */
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (!isValidTask(req.body)) {
    return res.status(400).json({ error: "Invalid task data" });
  }

  tasks[index] = { id, ...req.body };
  res.status(200).json(tasks[index]);
});

/**
 * DELETE /tasks/:id
 */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  res.status(200).json(deletedTask);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
