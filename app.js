const express = require('express');
const { z } = require('zod');

const app = express();
const port = 3000;
const tasks = require('./task.json').tasks;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Zod Schema for Task Input Validation
const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty'),
  description: z.string().trim().min(1, 'Description cannot be empty'),
  completed: z.boolean({ required_error: 'Completed must be a boolean value' })
});

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(task);
});

// POST /tasks - Create a new task with Zod validation
app.post('/tasks', (req, res) => {
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input data',
      errors: result.error.errors
    });
  }

  const { title, description, completed } = result.data;
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    completed
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update an existing task by ID with Zod validation
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input data',
      errors: result.error.errors
    });
  }

  const { title, description, completed } = result.data;
  task.title = title;
  task.description = description;
  task.completed = completed;

  res.status(200).json(task);
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;