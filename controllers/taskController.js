const { readTasks, writeTasks, generateId } = require('../utils/tasksUtil');

const getAllTasks = async (req, res) => {
    let tasks = await readTasks();

    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        tasks = tasks.filter(task => task.completed === completed);
    }

    if (req.query.sort === 'createdAt') {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.status(200).json(tasks);
};

const getTaskById = async (req, res) => {
    const tasks = await readTasks();
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
};

const createTask = async (req, res) => {
    const { title, description, completed, priority } = req.body;


    const taskPriority = priority || 'low';

    const tasks = await readTasks();
    const newTask = {
        id: generateId(tasks),
        title,
        description,
        completed,
        priority: taskPriority, //  default : 'low'
        createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
};


const updateTask = async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed, priority } = req.body;


    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    if (priority !== undefined) tasks[taskIndex].priority = priority;

    await writeTasks(tasks);

    res.status(200).json(tasks[taskIndex]);
};


const deleteTask = async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    // idSet.delete(taskId);
    await writeTasks(tasks);

    res.status(200).json({ message: 'Task deleted successfully' });
};


const getTasksByPriority = async (req, res) => {
    const { level } = req.params;
    const tasks = await readTasks();

    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).json({ message: 'Invalid priority level. Must be one of: low, medium, high' });
    }

    const filteredTasks = tasks.filter(task => task.priority === level);
    res.status(200).json(filteredTasks);
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByPriority,
};
