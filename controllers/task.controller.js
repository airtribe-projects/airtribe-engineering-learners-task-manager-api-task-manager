const service = require("../services/task.service");


exports.createTask = async (req, res) => {
  try {
    const task = await service.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    if (err.code === "INVALID_INPUT") {
      return res.sendStatus(400);
    }
    if (err.code === "DUPLICATE") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await service.getAllTasks(req.query);
    res.status(200).json(tasks);
  } catch (err) {
    if (err.code === "INVALID_INPUT") {
      return res.sendStatus(400);
    }
    return res.sendStatus(500);
  }
};

exports.getTasksByPriority = async (req, res) => {
  try {
    const { level } = req.params;

    if (!["low", "medium", "high"].includes(level)) {
      return res.sendStatus(400);
    }

    const tasks = await service.getTasksByPriority(level);
    res.status(200).json(tasks);
  } catch {
    res.sendStatus(500);
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await service.getTaskById(req.params.id);
    if (!task) return res.sendStatus(404);
    res.status(200).json(task);
  } catch {
    res.sendStatus(500);
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await service.updateTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (err) {
    if (err.code === "INVALID_INPUT") {
      return res.sendStatus(400);
    }
    if (err.code === "NOT_FOUND") {
      return res.sendStatus(404);
    }
    if (err.code === "DUPLICATE") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const ok = await service.deleteTask(req.params.id);
    if (!ok) return res.sendStatus(404);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

exports.getTaskById = async (id) => {
  const numId = Number(id);
  if (Number.isNaN(numId)) return null;

  return Task.findOne({ id: numId }, { _id: 0, __v: 0 });
};

