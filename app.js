const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filePath = path.join(__dirname, 'task.json');
let tasksData = require(filePath);
let tasks = tasksData.tasks || [];

// Helper function to save tasks to file
const saveTasks = () => {
    fs.writeFileSync(filePath, JSON.stringify({ tasks }, null, 2));
};

// GET /tasks → filter by completed, sort by createdAt
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    // Filter by completion status
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(task => task.completed === completed);
    }

    // Sort by creation date
    if (req.query.sort) {
        const sortOrder = req.query.sort.toLowerCase();
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    res.json(result);
});

// GET /tasks/priority/:level → filter by priority
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level.toLowerCase();

    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).send('Invalid priority level. Must be low, medium, or high.');
    }

    const filteredTasks = tasks.filter(task => task.priority === level);
    res.json(filteredTasks);
});

// GET /tasks/:id → get task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');
    res.json(task);
});

// POST /tasks → create new task
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
if (!title || !description) {
    return res.status(400).send('Title and description are required');
}
if (typeof completed !== 'boolean') {
    return res.status(400).send('Completed must be boolean');
}
const newTask = { id: tasks.length + 1, title, description, completed };
tasks.push(newTask);
res.status(201).json(newTask);  // <-- should work

});

// PUT /tasks/:id → update task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    const { title, description, completed } = req.body;

    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    if (typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be boolean');
    }


    task.title = title;
    task.description = description;
    task.completed = completed;

    saveTasks();
    res.json(task);
});

// DELETE /tasks/:id → delete task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return res.status(404).send('The task with the given ID was not found.');

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    saveTasks();
    res.json(deletedTask);
});

// Start server
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
