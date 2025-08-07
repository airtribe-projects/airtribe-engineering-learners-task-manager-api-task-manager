const fs = require("fs").promises;
const path = require("path");
const tasksFilePath = path.join(__dirname, "..", "task.json");

const writeTasksToFile = async (tasksArray) => {
  const dataObject = { tasks: tasksArray };
  await fs.writeFile(tasksFilePath, JSON.stringify(dataObject, null, 2));
};

const readTasksFromFile = async () => {
  try {
    const fileData = await fs.readFile(tasksFilePath, "utf8");
    const dataObject = JSON.parse(fileData);
    return dataObject.tasks || [];
  } catch (err) {
    if (err.code === "ENOENT") {
      // File does not exist, return empty array
      return [];
    }
    throw err;
  }
};

const Task = {
  findAll: async () => {
    return await readTasksFromFile();
  },

  findById: async (id) => {
    const tasks = await Task.findAll();
    const task = tasks.find((t) => t.id === Number(id));
    return task;
  },

  create: async (newTaskData) => {
    const tasks = await Task.findAll();
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const task = {
      id: newId,
      title: newTaskData.title,
      description: newTaskData.description,
      completed: typeof newTaskData.completed === "boolean" ? newTaskData.completed : false,
    };

    tasks.push(task);
    await writeTasksToFile(tasks);
    return task;
  },

  update: async (id, updates) => {
    const tasks = await Task.findAll();
    const taskIndex = tasks.findIndex((t) => t.id === Number(id));

    if (taskIndex === -1) {
      return null;
    }

    // Only update allowed fields
    const allowedUpdates = ["title", "description", "completed"];
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        tasks[taskIndex][key] = updates[key];
      }
    }

    await writeTasksToFile(tasks);
    return tasks[taskIndex];
  },

  remove: async (id) => {
    const tasks = await Task.findAll();
    const taskToDelete = tasks.find((t) => t.id === Number(id));

    if (!taskToDelete) {
      return null;
    }

    const remainingTasks = tasks.filter((t) => t.id !== Number(id));
    await writeTasksToFile(remainingTasks);
    return taskToDelete;
  },
};

module.exports = Task;