const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.join(__dirname, '../task.json');

let tasks = [];
let idSet = new Set();

const initIds = async () => {
    tasks = await readTasks();
    idSet = new Set(tasks.map(task => task.id));
};


// load tasks
const readTasks = async () => {
    try {
        const data = await fs.readFile(tasksFilePath, 'utf-8');
        return JSON.parse(data).tasks;
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
};

// save tasks
const writeTasks = async (tasks) => {
    await fs.writeFile(tasksFilePath, JSON.stringify({ tasks }, null, 2))
};

const generateId = (tasks) => {
    let id;
    do {
        id = Math.floor(Math.random() * 1000000); // between 0 and 999999
    } while (idSet.has(id));
    idSet.add(id);
    return id;
};

initIds();

module.exports = { readTasks, writeTasks, generateId };
