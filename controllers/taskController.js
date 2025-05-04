const tasksData = require('../task.json');
let tasks = tasksData.tasks;

// Retrieve all tasks
const getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

// Retrieve a task by ID
const getTaskById = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
};

// Create a new task
const createTask = (req, res) => {
    const { title, description, completed } = req.body;

    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Title, description, and boolean completed are required' });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        completed
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
};

// Update an existing task
const updateTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed } = req.body;

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ message: "'completed' must be a boolean" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    if (completed !== undefined) task.completed = completed;

    res.status(200).json(task);
};

// Delete a task by ID
const deleteTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex(t => t.id === taskId);

    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(index, 1);
    res.status(200).json({ message: 'Task deleted' });
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
