const tasksStore = require("../models/task.json");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../models/task.json");
const TaskSchema = require("../models/task.schema");

function CreateTask(req, res) {
  try {
    const parsedTask = TaskSchema.parse(req.body);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    const nextId = data.tasks[data.tasks.length - 1]?.id + 1 || 1;
    const newTask = {
      id: nextId,
      ...parsedTask,
      creationDate: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res
      .status(201)
      .json({ message: "New task created successfully!", task: newTask });
  } catch (error) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error:
          "Invalid Payload. Please fix the task object in request body and try again.",
      });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  }
}

function GetAllTasks(req, res) {
  let data = [...tasksStore.tasks];
  const { completed, priority } = req.query;

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      return res.status(400).json({
        error: "completed must be 'true' or 'false'",
      });
    }

    const completedBool = completed === "true";
    data = data.filter((task) => task.completed === completedBool);
  }

  if (priority !== undefined) {
    data = data.filter((task) => task.priority === priority);
  }

  data = data.sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  );

  res.send(data);
}

function GetTaskById(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = tasksStore.tasks.find((task) => task.id === id);
    if (task === undefined) {
      throw Error("TASK_NOT_FOUND");
    }
    res.json(task);
  } catch (error) {
    if (error.message === "TASK_NOT_FOUND") {
      res
        .status(404)
        .json({ error: "Task not found. Please check the ID and try again." });
    }
  }
}

function UpdateTaskById(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    const existingTaskIndex = data.tasks.findIndex((task) => task.id === id);
    if (existingTaskIndex === -1) {
      throw Error("TASK_NOT_FOUND");
    }
    const parsedBody = TaskSchema.parse(req.body);
    const updatedTask = {
      id: id,
      ...parsedBody,
    };

    data.tasks[existingTaskIndex] = updatedTask;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    if (error.message === "TASK_NOT_FOUND") {
      res
        .status(404)
        .json({ error: "Task not found. Please check the ID and try again." });
    } else if (error.name === "ZodError") {
      res.status(400).json({
        message:
          "Invalid payload. Please check the request body and try again.",
      });
    } else {
      res.status(500).json({ message: "Server Error", task: updatedTask });
    }
  }
}

function DeleteTaskById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    const taskIndex = data.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw Error("TASK_NOT_FOUND");
    }
    let taskToDelete = data.tasks[taskIndex];
    data.tasks.splice(taskIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({
      message: "Task deleted successfully!",
      deletedTask: taskToDelete,
    });
  } catch (error) {
    if (error.message === "TASK_NOT_FOUND") {
      res
        .status(404)
        .json({ error: "Task not found. Please check the ID and try again." });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
}

module.exports = {
  CreateTask,
  GetAllTasks,
  GetTaskById,
  UpdateTaskById,
  DeleteTaskById,
};
