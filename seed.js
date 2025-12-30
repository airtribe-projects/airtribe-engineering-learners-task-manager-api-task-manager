const Task = require("./models/task.model");

async function seedTasks() {
  const count = await Task.countDocuments();

  if (count === 0) {
    await Task.insertMany([
      {
        id: 1,
        title: "Set up environment",
        description: "Install Node.js, npm, and git",
        completed: true
      },
      {
        id: 2,
        title: "Create a new project",
        description: "Create a new project using the Express application generator",
        completed: true
      }
    ]);
  }
}

module.exports = seedTasks;
