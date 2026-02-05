const fs = require("fs");
const path = require("path");

const DATA_DATA = path.join(__dirname, "../task.json");

const getTaskFromFile = () => {
  try {
    if (!fs.existsSync(DATA_DATA)) {
      return [];
    }

    const data = fs.readFileSync(DATA_DATA, "utf-8");
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.tasks || [];
  } catch {
    return [];
  }
};

const saveTasksToFile = (tasks) => {
  fs.writeFileSync(DATA_DATA, JSON.stringify({ tasks }, null, 2));
};

const getTask = (req, res) => {
  const tasks = getTaskFromFile();
  return res.status(200).json(tasks);
};

const getTaskById = (req, res) => {
  const tasks = getTaskFromFile();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json("Task not Found for this ID");
  }
  res.status(200).json(task);
};

const createTask = (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json("Please provide valid data");
  }

  const tasks = getTaskFromFile();

  const newTask = {
    id: getNextId(tasks),
    title,
    description,
    completed,
  };

  tasks.push(newTask);
  saveTasksToFile(tasks);

  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({
      message: "Please provide valid data",
    });
  }

  let tasks = getTaskFromFile();
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      message: "Task not Found",
    });
  }

  tasks[index] = {
    id: tasks[index].id,
    title,
    description,
    completed,
  };

  saveTasksToFile(tasks);
  res.status(200).json(tasks[index]);
};

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  let tasks = getTaskFromFile();

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json("Task not found");
  }

  tasks.splice(index, 1);
  saveTasksToFile(tasks);

  res.status(200).json({ message: "Task deleted successfully" });
};

const getNextId = (tasks) => {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
};

module.exports = { getTask, getTaskById, createTask, updateTask, deleteTask };
