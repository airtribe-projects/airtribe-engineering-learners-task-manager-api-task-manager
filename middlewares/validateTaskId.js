const { getTasks } = require("../models/tasksModel")

const validateTaskId = (req, res, next) => {
    const id = parseInt(req.params.taskID);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid task ID"

        });
    }

    const tasks = getTasks();

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    // attack task to request
    req.task = task;
    req.tasks = tasks;
    req.taskID = id;

    next();     // move the controller
}

module.exports = validateTaskId;