const initialTasks = require('../../task.json')

// In-memory database
let tasks = [
    ...initialTasks.tasks
];

module.exports = tasks;
