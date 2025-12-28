const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data", "data.json");

const readTasks = () => {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
};

const writeTasks = (tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
};

module.exports = {
  readTasks,
  writeTasks,
};
