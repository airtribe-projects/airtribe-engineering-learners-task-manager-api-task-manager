const express = require("express");
const router = express.Router();
const tasks = require("../../models/task");

router.get("/", (req, res) => {
  res.json(tasks);
});

router.get("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found.");
  res.json(task);
});

router.post("/", (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).send("Invalid input.");
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
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found.");

  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).send("Invalid input.");
  }

  task.title = title;
  task.description = description;
  task.completed = completed;

  res.json(task);
});

router.delete("/:id", (req, res) => {
  const index = tasks.findIndex((task) => task.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Task not found.");

  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
