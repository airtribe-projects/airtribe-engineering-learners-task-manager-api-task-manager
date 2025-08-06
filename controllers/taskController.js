const fs = require("fs");
const path = require("path");

const getTasksData = () => {
  // console.log('directory:', __dirname);
  // console.log('file path:', path.join(__dirname, "../task.json"));
  const data = fs.readFileSync(path.join(__dirname, "../task.json"), "utf-8");
  // console.log('data:', data);
  // console.log('parsed data:', JSON.parse(data));
  return JSON.parse(data).tasks;
};

const handleServerError = (res, error) => {
  res.status(500).json({ error: "Some Error Occurred" });
};

const getTasks = (req, res) => {
  try {
    let tasks = getTasksData();
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found" });
    }

    let result = [...tasks];
    const { completed, sortByCreatedDate } = req.query;

    if (typeof completed !== "undefined") {
      if (completed === "true" || completed === "false") {
        const isCompleted = completed === "true";
        result = result.filter((task) => task.completed === isCompleted);
      } else {
        return res
          .status(400)
          .json({ error: "Invalid value for completed. Use true or false." });
      }
    }

    if (sortByCreatedDate === "asc" || sortByCreatedDate === "desc") {
      result.sort((a, b) => {
        if (!a.createdDate && !b.createdDate) return 0;
        if (!a.createdDate) return 1;
        if (!b.createdDate) return -1;
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return sortByCreatedDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getTaskById = (req, res) => {
  try {
    const tasks = getTasksData();
    const task = tasks.find((task) => task.id === parseInt(req.params.id));

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    handleServerError(res, error);
  }
};

const addTask = (req, res) => {
  try {
    const tasks = getTasksData();
    req.body.id =
      Array.isArray(tasks) && tasks.length ? Number(tasks.at(-1)?.id) + 1 : 1;

    const existingTask = tasks.find((task) => task.title === req.body.title);

    if (existingTask) {
      return res
        .status(400)
        .json({ error: "Task with this title already exists" });
    }

    if (!req.body.priority) {
      req.body.priority = "low";
    }
    req.body.createdDate = new Date().toISOString();
    tasks.push(req.body);
    fs.writeFileSync(
      path.join(__dirname, "../task.json"),
      JSON.stringify({ tasks }, null, 2)
    );
    res.status(201).json(req.body);
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateTaskById = (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "No data provided for update" });
    }
    const tasks = getTasksData();

    const index = tasks.findIndex(
      (task) => task.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = { ...tasks[index], ...req.body };

    tasks[index] = updatedTask;

    fs.writeFileSync(
      path.join(__dirname, "../task.json"),
      JSON.stringify({ tasks }, null, 2)
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteTask = (req, res) => {
  try {
    const tasks = getTasksData();
    const index = tasks.findIndex(
      (task) => task.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(index, 1);
    fs.writeFileSync(
      path.join(__dirname, "../task.json"),
      JSON.stringify({ tasks }, null, 2)
    );
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getTasksByPriority = (req, res) => {
  try {
    const { level } = req.params;
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(level)) {
      return res.status(400).json({ error: "Invalid priority level" });
    }
    const tasks = getTasksData();
    const filteredTasks = tasks.filter((task) => task.priority === level);
    if (!filteredTasks.length) {
      return res
        .status(404)
        .json({ error: "No tasks found with this priority" });
    }
    res.status(200).json(filteredTasks);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTaskById,
  deleteTask,
  getTasksByPriority,
};
