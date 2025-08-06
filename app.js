const express = require('express');
const data = require('./task.json');
const app = express();
const port = 3000;
const tasks = data.tasks;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks', (req, res) => {
    let result = data.tasks;

    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === 'true';
        result = result.filter(task => task.completed === isCompleted);
    }
    if (req.query.sort === 'desc') {
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        result = result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    res.json(result);
});

app.get('/tasks/priority/:level', (req, res) => {
  const level = req.params.level.toLowerCase();

  // Validate allowed priority levels
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(level)) {
    return res.status(400).json({ error: `Invalid priority level. Use one of: ${validPriorities.join(', ')}` });
  }

  const filteredTasks = data.tasks.filter(task => 
    task.priority && task.priority.toLowerCase() === level
  );

  res.json(filteredTasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }
});

app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;

    const validPriorities = ['low', 'medium', 'high'];

    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Title, description, and completed (boolean) are required.' });
    }

    if (priority && !validPriorities.includes(priority.toLowerCase())) {
        return res.status(400).json({ error: 'Priority must be one of: low, medium, high.' });
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        completed,
        priority: priority ? priority.toLowerCase() : 'medium', // default priority
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, completed, priority } = req.body;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    const hasValidField =
        title !== undefined ||
        description !== undefined ||
        completed !== undefined ||
        priority !== undefined;

    if (!hasValidField) {
        return res.status(400).json({
            error: 'At least one of the fields (title, description, completed, priority) must be provided.'
        });
    }

    if (title !== undefined && typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string.' });
    }

    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ error: 'Description must be a string.' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean.' });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority !== undefined && !validPriorities.includes(priority.toLowerCase())) {
        return res.status(400).json({ error: 'Priority must be one of: low, medium, high.' });
    }

    // Apply updates
    if (title !== undefined && title !== "") task.title = title;
    if (description !== undefined && description !== "") task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority.toLowerCase();

    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json({ message: `Task with ID ${taskId} deleted successfully`, task: deletedTask });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;