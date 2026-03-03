const express = require("express");
const router = express.Router();
const data = require("../data");

// GET /tasks
router.get("/", (req, res) => {
  res.json(data.tasks);
});

// GET /tasks/:id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = data.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// POST /tasks
router.post("/", (req, res) => {
  const { title, description, completed } = req.body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid task data" });
  }
  const newTask = {
    id: data.getNextTaskId(),
    title,
    description,
    completed,
  };
  data.tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = data.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  const { title, description, completed } = req.body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid task data" });
  }
  task.title = title;
  task.description = description;
  task.completed = completed;
  res.json(task);
});

// DELETE /tasks/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  data.tasks.splice(idx, 1);
  res.json({});
});

module.exports = router;
