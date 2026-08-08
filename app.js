const express = require('express');
const app = express();
const port = 3000;
const seed = require('./task.json');

let tasks = seed.tasks.map(t => ({
  ...t,
  priority: t.priority ?? 'medium',
  createdAt: t.createdAt ?? new Date().toISOString(),
}));

let nextId = Math.max(...tasks.map(t => t.id)) + 1;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PRIORITIES = ['low', 'medium', 'high'];

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function validateTask({ title, description, completed, priority }) {
  if (typeof title !== 'string' || title.trim() === '') return 'Invalid task data';
  if (typeof description !== 'string' || description.trim() === '') return 'Invalid task data';
  if (typeof completed !== 'boolean') return 'Invalid task data';
  if (priority !== undefined && !PRIORITIES.includes(priority)) return 'Invalid task data';
  return null;
}

app.get('/tasks', (req, res) => {
  let result = [...tasks];

  if (req.query.completed !== undefined) {
    if (req.query.completed !== 'true' && req.query.completed !== 'false') {
      return res.status(400).json({ error: 'completed must be true or false' });
    }
    const wanted = req.query.completed === 'true';
    result = result.filter(t => t.completed === wanted);
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.status(200).json(result);
});

app.get('/tasks/priority/:level', (req, res) => {
  const level = req.params.level.toLowerCase();
  if (!PRIORITIES.includes(level)) {
    return res.status(400).json({ error: `priority must be one of: ${PRIORITIES.join(', ')}` });
  }
  const result = tasks
    .filter(t => t.priority === level)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.status(200).json(result);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Invalid task id' });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title, description, completed, priority } = req.body;

  const error = validateTask(req.body);
  if (error) return res.status(400).json({ error });

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority: priority ?? 'medium',
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Invalid task id' });

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed, priority } = req.body;

  const error = validateTask(req.body);
  if (error) return res.status(400).json({ error });

  tasks[index] = {
    id,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority: priority ?? tasks[index].priority,
    createdAt: tasks[index].createdAt,
  };

  res.status(200).json(tasks[index]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Invalid task id' });

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const deleted = tasks.splice(index, 1)[0];
  res.status(200).json(deleted);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;