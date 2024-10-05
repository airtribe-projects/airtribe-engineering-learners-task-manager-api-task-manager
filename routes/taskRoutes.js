const express = require("express");
const router = express.Router();
const fs = require("fs");

let tasks = JSON.parse(fs.readFileSync("task.json", "utf8")).tasks;

const findTask = (id) => tasks.find((task) => task.id === id);

router.get("/", (req, res) => {
  const { completed } = req.query;
  if (completed !== undefined) {
    const filteredTasks = tasks.filter(
      (task) => task.completed === (completed === "true")
    );
    return res.json(filteredTasks);
  }
  res.json(tasks);
});

router.get("/:id", (req, res) => {
  const task = findTask(parseInt(req.params.id));
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

router.post("/", (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  const { title, description, completed } = req.body;
  const taskId = parseInt(req.params.id);
  const task = findTask(taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid input" });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;

  res.json(task);
});

router.delete("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;
