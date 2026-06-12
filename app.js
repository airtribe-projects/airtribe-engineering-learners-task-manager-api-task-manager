const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
    priority: "high",
    createdAt: new Date(),
  },
];

// GET ALL TASKS
app.get("/tasks", (req, res) => {
  let result = [...tasks];
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === "true";

    result = result.filter((task) => task.completed === completed);
  }

  if (req.query.sort === "asc") {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (req.query.sort === "desc") {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.status(200).json(result);
});

// GET TASK BY ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(200).json(task);
});

// CREATE TASK
app.post("/tasks", (req, res) => {
  const { title, description, completed, priority } = req.body;

  const validPriorities = ["low", "medium", "high"];

  if (
    !title ||
    !description ||
    typeof completed !== "boolean" ||
    !validPriorities.includes(priority)
  ) {
    return res.status(400).json({
      message: "Invalid task data",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed,
    priority,
    createdAt: new Date(),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, description, completed, priority } = req.body;

  const validPriorities = ["low", "medium", "high"];

  if (
    !title ||
    !description ||
    typeof completed !== "boolean" ||
    !validPriorities.includes(priority)
  ) {
    return res.status(400).json({
      message: "Invalid task data",
    });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority;

  res.status(200).json(task);
});

// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted successfully",
  });
});

app.get("/tasks/priority/:level", (req, res) => {
  const { level } = req.params;

  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(level)) {
    return res.status(400).json({
      message: "Invalid priority level",
    });
  }

  const filteredTasks = tasks.filter((task) => task.priority === level);

  res.status(200).json(filteredTasks);
});

module.exports = app;
