const express = require('express');
const router = express.Router();
const taskData = require('./task.json');
const { PRIORITIES, validateTask } = require('./validate');

let tasks = taskData.tasks;
let nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

router.get('/', (req, res) => {
    let result = [...tasks];

    if (req.query.completed !== undefined) {
        const val = req.query.completed;
        if (val !== 'true' && val !== 'false') {
            return res.status(400).json({ error: 'completed must be true or false' });
        }
        result = result.filter(t => t.completed === (val === 'true'));
    }

    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json(result);
});

router.get('/priority/:level', (req, res) => {
    const { level } = req.params;
    if (!PRIORITIES.includes(level)) {
        return res.status(400).json({ error: 'priority must be low, medium or high' });
    }
    res.status(200).json(tasks.filter(t => t.priority === level));
});

router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

router.post('/', (req, res) => {
    const errors = validateTask(req.body, true);
    if (Object.keys(errors).length) return res.status(400).json({ errors });

    const { title, description, completed, priority } = req.body;
    const task = {
        id: nextId++,
        title,
        description,
        completed,
        priority: priority || 'low',
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    res.status(201).json(task);
});

router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const errors = validateTask(req.body, false);
    if (Object.keys(errors).length) return res.status(400).json({ errors });

    const { title, description, completed, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    res.status(200).json(task);
});

router.delete('/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id, 10));
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(tasks.splice(index, 1)[0]);
});

module.exports = router;
