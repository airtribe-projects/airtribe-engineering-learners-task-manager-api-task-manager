const { tasks } = require("../models/taskModel");

const validPriorities = ["low", "medium", "high"];

const getAllTasks = (req, res) => {
    let result = [...tasks];
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === "true";
        result = result.filter(task => task.completed === completed);
    }
    result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return res.status(200).json(result);
};

const getTaskById = (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const task = tasks.find(task => task.id === taskId);
    if (!task) return res.status(404).json({ error: `Task not found with ID: ${taskId}` });
    return res.status(200).json(task);
};

const createTask = (req, res) => {
    const { title, description, priority } = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required and must be a non-empty string." });
    }
    if (!description || typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ error: "Description is required and must be a non-empty string." });
    }
    if ((priority && typeof priority !== "string") || (priority && priority.trim() === "")) {
        return res.status(400).json({ error: "Priority must be a non-empty string." });
    }
    const priorityValue = priority?.toLowerCase() || "medium";
    if (!validPriorities.includes(priorityValue)) {
        return res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(", ")}` });
    }
    const latestTask = tasks[tasks.length - 1];
    const id = latestTask ? latestTask.id + 1 : 1;
    const task = {
        id,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority: priorityValue,
        createdAt: new Date()
    };
    tasks.push(task);
    return res.status(201).json({ message: `Task created with ID: ${id}`, task });
};

const updateTask = (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { title, description, completed, priority } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: `Task with ID ${taskId} not found.` });
    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Title must be a non-empty string." });
        }
        tasks[taskIndex].title = title.trim();
    }
    if (description !== undefined) {
        if (typeof description !== "string" || description.trim() === "") {
            return res.status(400).json({ error: "Description must be a non-empty string." });
        }
        tasks[taskIndex].description = description.trim();
    }
    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({ error: "Completed must be a boolean value." });
        }
        tasks[taskIndex].completed = completed;
    }
    if (priority !== undefined) {
        const priorityValue = priority.toLowerCase();
        if (!validPriorities.includes(priorityValue)) {
            return res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(", ")}` });
        }
        tasks[taskIndex].priority = priorityValue;
    }
    return res.status(200).json({ message: `Task updated with ID: ${taskId}`, task: tasks[taskIndex] });
};

const deleteTaskById = (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: `Task with ID ${taskId} not found.` });

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    return res.status(200).json({ message: `Task with ID ${taskId} has been deleted.`, task: deletedTask });
};

const getTasksByPriority = (req, res) => {
    const level = req.params.level.toLowerCase();
    if (!validPriorities.includes(level)) {
        return res.status(400).json({ error: `Priority level must be one of: ${validPriorities.join(", ")}` });
    }

    const filtered = tasks.filter(task => task.priority === level);
    return res.status(200).json(filtered);
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTaskById,
    getTasksByPriority
};
