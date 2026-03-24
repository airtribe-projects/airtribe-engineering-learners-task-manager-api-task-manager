const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = require('./task.json').tasks;

const validPriorities = ['low', 'medium', 'high'];

// GET all tasks with optional filtering and sorting
app.get('/tasks', (req, res) => {
    let result = tasks;

    // Filter by completion status
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(t => t.completed === completed);
    }

    // Sort by creation date
    if (req.query.sort === 'createdAt') {
        if (req.query.order && req.query.order !== 'asc' && req.query.order !== 'desc') {
            return res.status(400).json({ error: 'Invalid order parameter. Use asc or desc.' });
        }
        const order = req.query.order === 'desc' ? -1 : 1;
        result = [...result].sort((a, b) => {
            if (!a.createdAt && !b.createdAt) return 0;
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return order * (new Date(a.createdAt) - new Date(b.createdAt));
        });
    }

    res.json(result);
});

// GET tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level;
    if (!validPriorities.includes(level)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    const result = tasks.filter(t => t.priority === level);
    res.json(result);
});

// GET a task by id
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid task data. title, description, and completed are required.' });
    }
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        completed,
        priority: priority || 'low',
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT update a task by id
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed, priority } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid task data. title, description, and completed are required.' });
    }
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    tasks[index] = {
        id,
        title,
        description,
        completed,
        priority: priority || tasks[index].priority
    };
    res.json(tasks[index]);
});

// DELETE a task by id
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(index, 1);
    res.json({ message: 'Task deleted successfully' });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
