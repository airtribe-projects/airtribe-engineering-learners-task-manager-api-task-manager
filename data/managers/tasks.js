const taskDb = require('../db');
const utils = require('../../utils');

// Get all tasks
module.exports.getTasksList = (searchQuery) => {
    if (Object.keys(searchQuery).length === 0) {
        return Promise.resolve(taskDb);
    }

    const filteredTasks = taskDb.filter((task) => {
        return Object.entries(searchQuery).every(([key, value]) => {
            return task[key] == value;
        });
    });
    return Promise.resolve(filteredTasks);
};

// Get single task by ID
module.exports.getTaskDetails = (searchQuery) => {
    const result = taskDb.find(task => task.id === searchQuery.id);
    return Promise.resolve(result);
};

// Create a new task
module.exports.createTask = (payload) => {
    const newTask = {
        id: utils.generateId(),
        title: payload.title,
        description: payload.description,
        completed: payload.completed || false
    };
    taskDb.push(newTask);
    return Promise.resolve(newTask);
};

// Update a task
module.exports.updateTask = (payload) => {
    const index = taskDb.findIndex(task => task.id === payload.id);
    if (index === -1) return Promise.resolve(null);

    taskDb[index] = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        completed: payload.completed
    };
    return Promise.resolve(taskDb[index]);
};

// Delete a task
module.exports.deleteTask = (payload) => {
    const index = taskDb.findIndex(task => task.id === payload.id);
    if (index === -1) return Promise.resolve(false);

    taskDb.splice(index, 1);
    return Promise.resolve(true);
};