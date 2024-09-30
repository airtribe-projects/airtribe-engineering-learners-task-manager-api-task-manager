const express = require('express');
const router = express.Router();
const tasksData = require('../data/tasks.json');
// let tasks = tasksData.tasks; 
let tasks = JSON.parse(JSON.stringify(tasksData.tasks)); // Access the tasks array from the JSON data
const { validateTaskInput } = require('../middleware');

router.get('/', (req, res) => {
    res.send(tasks);
});


router.get('/:id', (req, res) => {
    if (!Array.isArray(tasks)) {
        return res.status(500).send({ message: 'Internal Server Error: tasks is not in array' }); // If tasks is not an array, return a 500 error
    }
    const task = tasks.find(task => task.id === parseInt(req.params.id)); // Find the task with the given ID
    if (!task) {
        return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
});

router.post('/', validateTaskInput, (req, res) => {
    const { title, description, completed } = req.body;

    // Generate a new task ID based on the length of tasks or max existing id
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    // Create the new task
    const task = {
        id: newId,
        title: title,
        description: description,
        completed: !!completed // Ensure completed is treated as boolean
    };
    tasks.push(task);  // Add task to the tasks array
    res.status(201).send(task);
});

router.put('/:id', validateTaskInput, (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = tasks.find(task => task.id === parseInt(id));
    if (!task) {
        return res.status(404).send({ message: 'Task not found' });     // If the task is not found, return a 404 error
    }
    task.title = title;
    task.description = description;
    task.completed = completed;

    res.status(200).send(task);
});

router.delete('/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id)); 
    if (!task) return res.status(404).send({message: 'Task not found'});
    const index = tasks.indexOf(task); // Find the index of the task to be deleted
    tasks.splice(index, 1); // Remove the task from the tasks array
    res.send({message: 'Task deleted successfully'});
});

module.exports = router;
