const { tasks } = require("../models/tasksModel");

const getAllTasks = (req, res) => {
  const { completed, sort } = req.query;
  filteredTasks = tasks;
  if (completed !== undefined) {
    if (completed === "true" || completed === "false") {
      const completedBool = completed === "true";
      filteredTasks = tasks.filter((task) => task.completed === completedBool);
    } else {
      return res.status(400).json({
        error:
          "Invalid value for 'completed' query parameter. Use 'true' or 'false'.",
      });
    }
  }

  if (sort) {
    if (sort === "asc" || sort === "desc") {
      filteredTasks = filteredTasks.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sort === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else {
      return res.status(400).json({
        error: "Invalid value for 'sort' query parameter. Use 'asc' or 'desc'.",
      });
    }
  }

  if (filteredTasks.length === 0) {
    return res.status(200).json({ msg: "No tasks available" });
  }
  res.send(filteredTasks);
};

const getTaskById = (req, res) => {
  id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found", "task-id": id });
  }
  res.status(200).json(task);
};

const createTask = (req, res) => {
  const { title, description, completed, priority } = req.body;

  const errors = [];

  if (typeof title !== "string" || title.trim() === "") {
    errors.push({
      field: "title",
      message: "Title is required and must be a non-empty string",
    });
  }

  if (typeof description !== "string" || description.trim() === "") {
    errors.push({
      field: "description",
      message: "Description is required and must be a non-empty string",
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push({
      field: "completed",
      message: "Completed must be a boolean value",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  let newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title: title.trim(),
    description: description.trim(),
    completed: completed ?? false,
    createdAt: new Date().toISOString(),
    priority: priority !== undefined ? priority : 'low',
  };

  tasks.push(newTask);

  res.status(201).json({ msg: "Task created", details: newTask });
};

const updateTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ msg: "Task not found", "task-id": id });
  }

  const errors = [];

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    errors.push({ field: "title", message: "Title must be a non-empty string" });
  }

  if (description !== undefined && (typeof description !== "string" || description.trim() === "")) {
    errors.push({ field: "description", message: "Description must be a non-empty string" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push({ field: "completed", message: "Completed must be a boolean value" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (typeof title === "string") {
    tasks[taskIndex].title = title.trim();
  }

  if (typeof description === "string") {
    tasks[taskIndex].description = description.trim();
  }

  if (typeof completed === "boolean") {
    tasks[taskIndex].completed = completed;
  }

  res.status(200).json({ msg: "Task updated", task: tasks[taskIndex] });
};

const deleteTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ msg: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.send({ msg: "task deleted", "task-details": deletedTask });
};


const getTaskByPriority = (req, res) => {
  const { level } = req.params;
  const allowedLevels = ['low', 'medium', 'high'];

  if (!allowedLevels.includes(level)) {
    return res.status(400).json({ msg: "Invalid priority level. Use 'low', 'medium', or 'high'." });
  }

  const filteredTasks = tasks.filter(task => task.priority === level);

  if (filteredTasks.length === 0) {
    return res.status(200).json({ msg: `No tasks found with priority '${level}'` });
  }

  res.status(200).json(filteredTasks);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
  getTaskByPriority,
};
