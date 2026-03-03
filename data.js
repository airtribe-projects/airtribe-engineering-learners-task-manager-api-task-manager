const { tasks: initialTasks } = require("./task.json");

const tasks = [...initialTasks];
let nextTaskId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

const users = [];
let nextUserId = 1;

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function getNextTaskId() {
  return nextTaskId++;
}

function getNextUserId() {
  return nextUserId++;
}

module.exports = {
  tasks,
  getNextTaskId,
  users,
  getNextUserId,
  JWT_SECRET,
};
