const fs = require("fs").promises;
const path = require("path");
const tasksFilePath = path.join(__dirname, "..", "task.json");
const writeTasksToFile = async (tasksArray) => {
  const dataObject = { tasks: tasksArray };
  await fs.writeFile(tasksFilePath, JSON.stringify(dataObject, null, 2));
};

const Task = {
  findAll: async () => {
  const fileData = await fs.readFile(tasksFilePath, "utf8");
  const dataObject = JSON.parse(fileData);
  return dataObject.tasks;
},
  findById: async (id) => {
    const tasks = await Task.findAll();
    const task = tasks.find((t) => t.id == id);
    return task;
  },

  create: async (newTaskData) => {
    const tasks = await Task.findAll();
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const task = {
      id: newId,
      title: newTaskData.title,
      description: newTaskData.description,
      completed: newTaskData.completed || false,
    };

    tasks.push(task);
    await writeTasksToFile(tasks);
    return task;
  },

  update: async (id, updates) => {
    const tasks = await Task.findAll();
    const taskIndex = tasks.findIndex((t) => t.id == id);

    if (taskIndex === -1) {
      return null;
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };

    await writeTasksToFile(tasks);
    return tasks[taskIndex];
  },

  remove: async (id) => {
    const tasks = await Task.findAll();
    const taskToDelete = tasks.find((t) => t.id == id);

    if (!taskToDelete) {
      return null;
    }

    const remainingTasks = tasks.filter((t) => t.id != id);

    await writeTasksToFile(remainingTasks);
    return taskToDelete;
  },
};
module.exports = Task;