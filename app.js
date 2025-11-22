const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Path to task.json file
const taskFilePath = path.join(__dirname, 'task.json');

// Helper function to read tasks from file
function getTasks() {
    try {
        const data = fs.readFileSync(taskFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.tasks || [];
    } catch (err) {
        console.error('Error reading tasks:', err);
        return [];
    }
}

// Helper function to write tasks to file
function saveTasks(tasks) {
    try {
        const jsonData = { tasks };
        fs.writeFileSync(taskFilePath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.error('Error saving tasks:', err);
    }
}

// GET /tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = getTasks();
    res.json({ success: true, data: tasks });
});

// Alternative: GET /tasks (original endpoint)
app.get('/tasks', (req, res) => {
    const tasks = getTasks();
    res.json({ success: true, data: tasks });
});

// GET /tasks/:id - Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;

    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (description === undefined || description === null) {
        return res.status(400).json({ success: false, message: 'Description is required' });
    }
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Completed must be a boolean' });
    }

    const tasks = getTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask = {
        id: newId,
        title: title.trim(),
        description: description.trim(),
        completed
    };

    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) {
        if (title.trim() === '') {
            return res.status(400).json({ success: false, message: 'Title cannot be empty' });
        }
        tasks[taskIndex].title = title.trim();
    }

    if (description !== undefined) {
        tasks[taskIndex].description = description.trim();
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Completed must be a boolean' });
        }
        tasks[taskIndex].completed = completed;
    }

    saveTasks(tasks);

    res.json({ success: true, message: 'Task updated successfully', data: tasks[taskIndex] });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const tasks = getTasks();

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    saveTasks(tasks);

    res.json({ success: true, message: 'Task deleted successfully', data: deletedTask[0] });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;