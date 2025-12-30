const connectDB = require("./db");
const seedTasks = require("./seed");
const Task = require("./models/task.model");

let initializationPromise;

async function init({ reset = false } = {}) {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        await connectDB(process.env.MONGO_URI);

        if (reset) {
          await Task.deleteMany({});
        }

        await seedTasks();
      } catch (err) {
        console.error("Application initialization failed:", err.message);
        throw err;
      }
    })();
  }

  return initializationPromise;
}

module.exports = init;
