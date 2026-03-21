const { getTasks } = require("../models/tasksModel")

const validateTask = (req, res, next) => {

    const { title, description, completed, priority } = req.body

    if (!title || !description || completed === undefined) {
        return res.status(400).json({
            message: 'Title, description and completed status are required'
        });
    }

    if (typeof completed !== "boolean") {
        return res.status(400).json({
            message: 'completed must be boolean'
        });
    }

    if (
        priority !== "low" &&
        priority !== "medium" &&
        priority !== "high"
    ) {
        return res.status(400).json({
            message: 'invalid priority'
        });
    }

    req.title = title;
    req.description = description;
    req.completed = completed;
    req.priority = priority;

    next();
}

module.exports = validateTask;