const Task = require("../models/task.model");
const { validateTask, validatePartialTask } = require("../utils/validateTask");

const getNextId = async () => {
  const last = await Task.findOne().sort({ id: -1 });
  return last ? last.id + 1 : 1;
};

exports.createTask = async (data) => {
  if (!validateTask(data)) {
    const err = new Error("Invalid input");
    err.code = "INVALID_INPUT";
    throw err;
  }

  try {
    const id = await getNextId();
    return await Task.create({ id, ...data });
  } catch (error) {
    // Future-safe: handle duplicate key errors if uniqueness is added
    if (error.code === 11000) {
      const err = new Error("Duplicate task");
      err.code = "DUPLICATE";
      throw err;
    }
    throw error; // unknown/internal error
  }
};

exports.getAllTasks = async (query) => {
  const filter = {};
  const sort = {};

  // Filter by completion status
  if (query.completed !== undefined) {
    if (query.completed === "true") {
      filter.completed = true;
    } else if (query.completed === "false") {
      filter.completed = false;
    } else {
      const err = new Error("Invalid completed value");
      err.code = "INVALID_INPUT";
      throw err;
    }
  }

  // Sorting by creation date
  if (query.sort === "createdAt") {
    if (query.order === undefined) {
      sort.createdAt = -1; // default: newest first
    } else if (query.order === "asc") {
      sort.createdAt = 1;
    } else if (query.order === "desc") {
      sort.createdAt = -1;
    } else {
      const err = new Error("Invalid order value");
      err.code = "INVALID_INPUT";
      throw err;
    }
  }

  return Task.find(filter, { _id: 0, __v: 0 }).sort(sort);
};

exports.getTaskById = async (id) => {
  const numId = Number(id);
  if (Number.isNaN(numId)) return null;

  return Task.findOne({ id: numId }, { _id: 0, __v: 0 });
};

exports.getTasksByPriority = async (priority) => {
  return Task.find(
    { priority },
    { _id: 0, __v: 0 }
  );
};

exports.updateTask = async (id, data) => {
  // Input validation
  if (!validatePartialTask(data)) {
    const err = new Error("Invalid input");
    err.code = "INVALID_INPUT";
    throw err;
  }

  const updatedTask = await Task.findOneAndUpdate(
    { id: Number(id) },
    data,
    { new: true, projection: { _id: 0, __v: 0 } }
  );

  // Task not found
  if (!updatedTask) {
    const err = new Error("Task not found");
    err.code = "NOT_FOUND";
    throw err;
  }

  return updatedTask;
};

exports.deleteTask = async (id) => {
  const result = await Task.findOneAndDelete({ id: Number(id) });
  return !!result;
};
