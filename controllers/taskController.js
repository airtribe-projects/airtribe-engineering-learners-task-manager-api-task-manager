const tasks = require("../models/task");

function validateTaskInput(data) {
  const errors = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (data.completed !== undefined && typeof data.completed !== "boolean") {
    errors.push("Completed must be a boolean.");
  }

  if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, or high.");
  }

  return errors;
}

exports.getAllTasks = (req, res) => {
  let filteredTasks = [...tasks];
  if (req.query.completed !== undefined) {
    const completedFilter = req.query.completed === "true";
    filteredTasks = filteredTasks.filter(
      (task) => task.completed === completedFilter
    );
  }
  filteredTasks.sort((taskA, taskB) => taskB.id - taskA.id);
  res.json(filteredTasks);
};

exports.getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
};

exports.createTask = (req, res) => {
  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description, completed, priority } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed: completed || false,
    priority: priority || "medium",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description, completed, priority } = req.body;
  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority;

  res.json(task);
};

exports.deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const deleted = tasks.splice(index, 1);
  res.json(deleted[0]);
};

exports.getTasksByPriority = (req, res) => {
  const level = req.params.level;
  if (!["low", "medium", "high"].includes(level)) {
    return res
      .status(400)
      .json({ error: "Invalid priority level. Must be low, medium, or high." });
  }

  const filteredByPriority = tasks.filter((task) => task.priority === level);
  res.json(filteredByPriority);
};
