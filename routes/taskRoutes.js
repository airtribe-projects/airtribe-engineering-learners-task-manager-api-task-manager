const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateTask = require('../validations/taskValidation');

// In-memory storage for tasks
let tasks = []; 


// Create Task (POST)
router.post('/', validateTask, (req, res) => {
  const { title, description } = req.body;
  const task = {
    id: tasks.length + 1,
    title,
    description,
    completed: false
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Get All Tasks (GET)
router.get('/', (req, res) => {
  res.json(tasks);
});

// Get Single Task (GET)
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// Update Task (PUT)
router.put('/:id', validateTask, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed } = req.body;
  task.title = title;
  task.description = description;
  task.completed = completed !== undefined ? completed : task.completed;

  res.json(task);
});

// Delete Task (DELETE)
router.delete('/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router;
