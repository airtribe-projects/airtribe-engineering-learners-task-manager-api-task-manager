const express = require("express");
const { tasks } = require("./task.json");
const { postRequestValidator, putRequestValidator } = require("./validator");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all tasks
app.get("/v1/tasks", (req, res) => {
  const { completed, sort } = req.query; // optional query parameters

  let tasksToSend = tasks;

  if (completed === undefined && sort === undefined) {
    res.send({ tasks: tasksToSend, total: tasksToSend.length });
  }

  if (completed === "true" || completed === "false") {
    tasksToSend = tasksToSend.filter(
      (task) => task.completed.toString() === completed
    );
  } else {
    res.status(400).send({ message: "Invalid query parameter" });
    return;
  }

  if (sort === "asc" || sort === "desc") {
    if (sort === "asc") {
      tasksToSend = tasksToSend.sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
      );
    } else {
      tasksToSend = tasksToSend.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
    }
  } else {
    res.status(400).send({ message: "Invalid query parameter" });
    return;
  }

  res.send({ tasks: tasksToSend, total: tasksToSend.length });
});

// Get all tasks by priority
app.get("/v1/tasks/priority/:priority", (req, res) => {
  const priority = req.params.priority;
  const tasksToSend = tasks.filter((task) => task.priority === priority);
  res.send({ tasks: tasksToSend, total: tasksToSend.length });
});

// Get a task by id
app.get("/v1/tasks/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    return res.status(404).send({ message: "Task not found" });
  }
  res.send(task);
});

// Create a new task
app.post("/v1/tasks", postRequestValidator, (req, res) => {
  const newTask = req.body;

  if (newTask.priority === undefined) {
    return res.status(400).send({ message: "Priority is required" });
  }

  if (PRIORITIES.includes(newTask.priority)) {
    return res.status(400).send({ message: "Invalid priority" });
  }

  newTask.id = Math.floor(Math.random() * 1000000);
  newTask.createdAt = new Date().toISOString();

  tasks.push(newTask);

  res.send({ message: "Task created successfully", task: newTask });
});

// Update a task
app.put("/v1/tasks/:taskId", putRequestValidator, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const updatedTask = req.body;

  const taskToUpdateIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskToUpdateIndex === -1) {
    return res.status(404).send({ message: "Task not found" });
  }

  tasks[taskToUpdateIndex] = { ...tasks[taskToUpdateIndex], ...updatedTask };
  res.send({
    message: "Task updated successfully",
    task: tasks[taskToUpdateIndex],
  });
});

// Delete a task
app.delete("/v1/tasks/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskToDeleteIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskToDeleteIndex === -1) {
    return res.status(404).send({ message: "Task not found" });
  }

  tasks.splice(taskToDeleteIndex, 1);
  res.send({ message: "Task deleted successfully" });
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something went wrong", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
