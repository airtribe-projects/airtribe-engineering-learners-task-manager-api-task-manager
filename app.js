const express = require('express');
const app = express();
const port = 3000;
const data = require('./task.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks', (req, res) => {
  res.status(200).json(data.tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = data.tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

  if (typeof title !== 'string' || title.trim() === '' ||
      typeof description !== 'string' || description.trim() === '' ||
      typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const newTask = {
    id: data.tasks.length ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    completed
  };

  data.tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, completed } = req.body;

  if (typeof title !== 'string' || title.trim() === '' ||
      typeof description !== 'string' || description.trim() === '' ||
      typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  data.tasks[index] = { id, title, description, completed };
  res.status(200).json(data.tasks[index]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deleted = data.tasks.splice(index, 1)[0];
  res.status(200).json(deleted);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;