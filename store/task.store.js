const fs = require("fs/promises");
const path = require("path");

/**
 * Configurable task data file path
 * Defaults to ../task.js
 */
const dataPath =
  process.env.TASKS_FILE_PATH ||
  path.join(__dirname, "../task.js");

/**
 * Parse and validate task JSON structure
 */
function parseTasks(raw) {
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Task data file contains invalid JSON");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray(parsed.tasks)
  ) {
    throw new Error("Task data file must contain a 'tasks' array");
  }

  return parsed.tasks;
}

/**
 * Read tasks from storage
 */
async function readTasks() {
  const raw = await fs.readFile(dataPath, "utf-8");
  return parseTasks(raw);
}

/**
 * Write tasks back to storage
 */
async function writeTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new Error("Tasks must be an array");
  }

  const payload = JSON.stringify({ tasks }, null, 2);

  await fs.writeFile(dataPath, payload, "utf-8");
}

module.exports = {
  readTasks,
  writeTasks,
};