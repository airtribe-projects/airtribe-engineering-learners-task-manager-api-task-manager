const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { validateTask } = require('../utils');
let tasks = require('../models/taskModels');

router.get('', (req, res) => {
    const { completed } = req.query;
    if (completed) {
        tasks = tasks.filter(task => task.completed === completed);
    }
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(tasks);
});

router.get('/:id', (req, res) => {
    const task = tasks.find(task => task.id == req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

router.post('', (req, res) => {
    const { title, description, completed } = req.body;
    if (!validateTask(title, description, completed)) {
        return res.status(400).json({ error: 'Invalid task data' });
    }
    const id = uuidv4();
    const newTask = {
        id,
        title,
        description,
        completed
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
    const { title, description, completed } = req.body;
    if (!validateTask(title, description, completed)) {
        return res.status(400).json({ error: 'Invalid task data' });
    }
    const task = tasks.find(task => task.id == req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    task.title = title;
    task.description = description;
    task.completed = completed;
    res.json(task);
})

router.delete('/:id', (req, res) => {
    const task = tasks.find(task => task.id == req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks = tasks.filter(task => task.id != req.params.id);
    res.status(200).send();
});


module.exports = router;

