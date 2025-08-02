const createHttpError = require("http-errors");
const { DB: Database } = require("../database");

function createTask(taskPayload) {
  return Database.set(taskPayload);
}

function deleteTask(taskID) {
  const item = Database.get(taskID);
  if (item === undefined) {
    throw createHttpError(404, "Task not found");
  }
  Database.delete(taskID);
  return item;
}

function updateTask(taskID, taskPayload) {
  const prevTask = Database.get(taskID);
  if (prevTask === undefined) {
    throw createHttpError(404, "Task not found");
  }
  const updatedTask = Database.update(taskID, taskPayload);
  return updatedTask;
}

function getTaskByID(taskID) {
  const item = Database.get(taskID);
  if (item === undefined) {
    throw createHttpError(404, "Task not found");
  }
  return item;
}

function getTasks(filters = {}) {
  return Database.getTasks(filters);
}

function getTasksByPriority(priority) {
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    throw createHttpError(400, "Invalid priority level. Must be 'low', 'medium', or 'high'");
  }
  return Database.getTasksByPriority(priority);
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getTaskByID,
  getTasks,
  getTasksByPriority
};
