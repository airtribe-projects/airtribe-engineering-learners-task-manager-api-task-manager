const { tasks, getNextId } = require("../data/tasks");

const getAllTasks = (req, res) => {
  const { completed, sort } = req.query;

  let filteredTasks = [...tasks];

  if (completed !== undefined) {
    const status = completed === "true";

    filteredTasks = filteredTasks.filter((task) => task.completed === status);
  }

  if (sort === "asc") {
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (sort === "desc") {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(filteredTasks);
};

const getTasksByPriority = (req, res) => {
  const { level } = req.params;

  const priorities = ["low", "medium", "high"];

  if (!priorities.includes(level)) {
    return res.status(400).json({
      message: "Invalid priority level",
    });
  }

  const filteredTasks = tasks.filter((task) => task.priority === level);

  res.json(filteredTasks);
};

const getTaskById = (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
};

const createTask = (req, res) => {
  const { title, description, completed, priority } = req.body;

  const newTask = {
    id: getNextId(),
    title,
    description,
    completed,
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, description, completed, priority } = req.body;

  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority;

  res.json(task);
};
const deleteTask = (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks.splice(index, 1);

  res.json({
    message: "Task deleted successfully",
  });
};

module.exports = {
  getAllTasks,
  getTasksByPriority,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
