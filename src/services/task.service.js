
const repo = require("../repositories/task.repo");

const getAllTasks = async ({ completed, sortBy, priority }) => {
    let allTasks = await repo.getAllTasks(); // use let so we can reassign

    // Filter by completion status
    if (completed !== undefined) {
        const isCompleted = completed === 'true'; // req.query gives strings
        allTasks = allTasks.filter(task => task.completed === isCompleted);
    }

    // Filter by priority
    if (priority) {
        allTasks = allTasks.filter(task => task.priority.toLowerCase() === priority.toLowerCase());
    }

    // Sort by creation date
    if (sortBy === 'createdAt') {
        allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
    }

    console.log("Service layer - getAllTasks", allTasks);
    return allTasks;
};


const getTask = async (id) => {
    const data = await repo.getTask(id);
    console.log("Service layer - getTask", data);
    return data;
};

const createTask = async (task) => {
    const data = await repo.createTask(task);
    console.log("Service layer - createTask", data);
    return data;
};

const updateTask = async (id, task) => {
    const data = await repo.updateTask(id, task);
    console.log("Service layer - updateTask", data);
    return data;
};

const deleteTask = async (id) => {
    const data = await repo.deleteTask(id);
    console.log("Service layer - deleteTask", data);
    return data;
};

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,  
}