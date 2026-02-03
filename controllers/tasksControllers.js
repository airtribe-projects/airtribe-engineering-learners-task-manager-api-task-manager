const tasks = require('../models/tasksModels');

const getTasks = (req, res) => {
    const { priority, completed, createdAt } = req.query;
    let filteredTasks = tasks;
    if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (completed) {
        filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }
    if (createdAt) {
        filteredTasks = filteredTasks.filter(task => task.createdAt <= createdAt);
    }
    res.json(filteredTasks);
};

const getTasksByPriority = (req, res) => {
    const { priority } = req.params;
    const filteredTasks = tasks.filter(task => task.priority === priority);
    res.json(filteredTasks);
};

const getTaskById = (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
};

const createTask = (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || !description || completed === undefined) {
        return res.status(400).json({ message: 'Missing required fields: title, description, and completed are required' });
    }
    if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid data types: title and description must be strings, completed must be a boolean' });
    }
    
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title,
        description,
        completed
    };
    tasks.push(newTask);
    res.status(201).send(newTask);
};

const updateTask = (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, completed } = req.body;    
    if (!title || !description || completed === undefined) {
        return res.status(400).json({ message: 'Missing required fields: title, description, and completed are required' });
    }
    if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid data types: title and description must be strings, completed must be a boolean' });
    }
    
    task.completed = completed;
    task.title = title;
    task.description = description;
    res.json(task);
};

const deleteTask = (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(tasks.indexOf(task), 1);
    res.json({ message: 'Task deleted' });
};

module.exports = {
    getTasks,
    getTasksByPriority,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};