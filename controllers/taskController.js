const path = require("path");
const fs = require("fs");

const { readTasks, writeTasks } = require("../services/taskupdator");
const { sourceMapsEnabled } = require("process");

// const dataPath = path.join(__dirname, "../data", "data.json");
// const tasks = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const getAllTasks = (req, res) => {
  const { completed } = req.query;
  console.log(typeof completed);
  const tasks = readTasks();
  let filteredTasks = tasks;
  if (completed !== undefined) {
    if (completed != "true" && completed != "false") {
      return res.status(400).json({
        message: "completed must be true or false",
      });
    }
    const completedBoolean = completed === "true";
    filteredTasks = tasks.filter((task) => task.completed === completedBoolean);
  }

  return res.json({
    status: "success",
    data: {
      tasks: filteredTasks,
    },
  });
};

const getATask = (req, res) => {
  const id = req.params.id * 1;
  const tasks = readTasks();
  const task = tasks.find((el) => el.id === id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res.json({
    status: "success",
    data: {
      task,
    },
  });
};

const createANewTask = (req, res) => {
  const tasks = readTasks();
  const newId = tasks[tasks.length - 1].id + 1;
  console.log("inside create new task");
  const newTask = Object.assign({ id: newId }, req.body);
  tasks.push(newTask);

  writeTasks(tasks);

  return res.json({
    status: "success",
    data: {
      tasks: newTask,
    },
  });
};

const updateATask = (req, res) => {
  const tasks = readTasks();
  const taskid = req.params.id * 1;
  const updatedData = req.body;
  const taskIndex = tasks.findIndex((el) => el.id === taskid);
  if (taskIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updatedData,
    id: taskid,
  };
  writeTasks(tasks);
  return res.json({
    status: "success",
    data: {
      tasks: tasks[taskIndex],
    },
  });
};

const deleteATask = (req, res) => {
  const tasks = readTasks();
  const taskId = req.params.id * 1;

  const filteredTasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }
  writeTasks(filteredTasks);
  return res.json({
    status: "success",
    message: "Task deleted successfully",
  });
};
module.exports = {
  getAllTasks,
  getATask,
  createANewTask,
  updateATask,
  deleteATask,
};
