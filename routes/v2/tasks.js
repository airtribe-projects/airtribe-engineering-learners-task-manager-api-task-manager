const express = require("express");
const router = express.Router();
const tasks = require("../../models/task");

router.get("/", (req, res) => {
  let filteredTasks = tasks;
  if (req.query.priority) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority && task.priority === req.query.priority
    );
  }

  res.json(filteredTasks);
});

router.get("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found.");
  res.json(task);
});

router.post("/", (req, res) => {
  const { title, description, completed, priority } = req.body;
  if (
    !title ||
    !description ||
    typeof completed !== "boolean" ||
    !["low", "medium", "high"].includes(priority)
  ) {
    return res
      .status(400)
      .send("Invalid input. Ensure priority is 'low', 'medium', or 'high'.");
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed,
    priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found.");

  const { title, description, completed, priority } = req.body;

  if (
    !title ||
    !description ||
    typeof completed !== "boolean" ||
    !["low", "medium", "high"].includes(priority)
  ) {
    return res
      .status(400)
      .send("Invalid input. Ensure priority is 'low', 'medium', or 'high'.");
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority;

  res.json(task);
});

router.delete("/:id", (req, res) => {
  const index = tasks.findIndex((task) => task.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Task not found.");

  tasks.splice(index, 1);
  res.status(204).send();
});

router.get("/priority/:level", (req, res) => {
  const { level } = req.params;
  if (!["low", "medium", "high"].includes(level)) {
    return res.status(400).send("Invalid priority level.");
  }

  const filteredTasks = tasks.filter((task) => task.priority === level);
  res.json(filteredTasks);
});

module.exports = router;
