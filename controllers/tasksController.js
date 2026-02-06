const tasks = require("../models/tasks.json");
const { sendResponse, sendErrorResponse } = require('../utils/util');

// Get all tasks
const getTasks = (req, res) => {
    // Optional query filter
    if (req.query.completed == 'true' || req.query.completed == 'false') {
        const completedTasks = tasks.filter(_task => _task.completed == req.query.completed);
        return sendResponse(res, 200, completedTasks);
    }

    // Send all tasks
    return sendResponse(res, 200, tasks)
}

// Get task by specific id
const getTaskById = (req, res) => {
    // Validate id param
    if (!req.params.id)
        return sendErrorResponse(res, 400, "Please provide a valid task id.");

    // Find task by id
    const task = tasks.find(_task => _task.id == req.params.id);

    // Return error if not found
    if (!task)
        return sendErrorResponse(res, 404, "Task not found");

    // Return task
    return sendResponse(res, 200, task);
}

// Add new task by specific id
const addTask = (req, res) => {
    const { title, description, completed } = req.body || {};

    // Validate task details
    if (!title || !description || typeof completed !== 'boolean')
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    // Get last task id and create new id
    const lastTask = tasks.length ? tasks[tasks.length - 1] : { id: 0 };
    const newId = lastTask.id + 1;

    // Add new task
    tasks.push({
        id: newId,
        title,
        description,
        completed
    });

    // console.log("New task created", tasks);

    // Return success response
    return sendResponse(res, 201, "Task created successfully!");
}

// Update existing task by specific id
const updateTask = (req, res) => {
    // Validate request body
    const { title, description, completed } = req.body || {};
    const id = req.params.id;

    // Validate id param
    if (!id || !(title || description))
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    // Validate title
    if (req.body.hasOwnProperty('title') && !title)
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    // Validate description
    if (req.body.hasOwnProperty('description') && !description)
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    // Validate completed
    if (req.body.hasOwnProperty('completed') && typeof completed !== 'boolean')
        return sendErrorResponse(res, 400, "Please provide valid task details.");

    const taskIndex = tasks.findIndex(_task => _task.id == id);

    if (taskIndex == -1)
        return sendErrorResponse(res, 404, "Task not found");

    tasks[taskIndex] = Object.assign(tasks[taskIndex], { title, description, completed })

    // console.log("Task updated", tasks[taskIndex]);

    return sendResponse(res, 200, "Task saved successfully!");
}

const deleteTask = (req, res) => {
    const id = req.params.id;
    // console.log('id', id)

    // Validate id param
    if (!id)
        return sendErrorResponse(res, 400, "Please provide task id.");

    // Find task index
    const taskIndex = tasks.findIndex(_task => _task.id == id);

    // Return error if not found
    if (taskIndex == -1)
        return sendErrorResponse(res, 404, "Task not found");

    // Delete task
    tasks.splice(taskIndex, 1)

    // console.log("Task deleted");

    return sendResponse(res, 200, "Task deleted successfully!");
}

module.exports = {
    getTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
}