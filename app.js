const express = require("express");
const { tasks } = require("./task.json");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  const params = req.query;

  if (params.completed) {
    const completedTasks = tasks.filter((task) => task.completed === true);
    return res.json(completedTasks);
  }

  const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(sortedTasks);
});

app.get("/tasks/priority/:level", (req, res) => {
  const priorityTasks = tasks.filter((task) => task.priority === parseInt(req.params.level));
  res.json(priorityTasks);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  if (!newTask.title || !newTask.description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  if (!newTask.priority) {
    newTask.priority = 0;
  }

  if (typeof newTask.completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }

  newTask.id = tasks.length + 1;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const newTask = req.body;
  if (!newTask.title || !newTask.description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  if (typeof newTask.completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }


  if (!newTask.priority) {
    newTask.priority = 0;
  }

  task.title = newTask.title;
  task.description = newTask.description;
  task.completed = newTask.completed;
  task.priority = newTask.priority;
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  tasks.splice(tasks.indexOf(task), 1);
  res.json({ message: "Task deleted", task });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
