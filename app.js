const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory task storage
let tasks = [
  {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using Magic",
    completed: false,
    priority: "medium",       // optional, default priority
    createdAt: new Date()     // optional, for sorting
  }
];
let nextId = 3; // next task ID

// GET all tasks with optional filtering and sorting
app.get('/tasks', (req, res) => {
  let result = tasks;

  // Filter by completion status
  if (req.query.completed) {
    const completed = req.query.completed === 'true';
    result = result.filter(t => t.completed === completed);
  }

  // Sort by creation date
  if (req.query.sortBy === 'createdAt') {
    result = result.sort((a, b) => a.createdAt - b.createdAt);
  }

  res.status(200).json(result);
});

// GET tasks by priority
app.get('/tasks/priority/:level', (req, res) => {
  const level = req.params.level.toLowerCase();
  const result = tasks.filter(t => t.priority === level);
  res.status(200).json(result);
});

// GET task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(task);
});

// POST new task
app.post('/tasks', (req, res) => {
  const { title, description, completed, priority } = req.body;
  if (!title || !description || typeof completed !== 'boolean') {
    return res.status(400).json({ error: "Invalid task data" });
  }

  const newTask = {
    id: nextId++,
    title,
    description,
    completed,
    priority: priority || "medium",
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  const { title, description, completed, priority } = req.body;
  if (!title || !description || typeof completed !== 'boolean') {
    return res.status(400).json({ error: "Invalid task data" });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority || task.priority;

  res.status(200).json(task);
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
