const { getTasks, saveTasks } = require("../models/tasksModel.js")


// Implementation Retrieve all tasks.
const getAllTasks = (req, res) => {

    const tasks = getTasks();
    let result = tasks;

    // Optional Task 1
    // Implement filtering by completion status for GET /tasks.
    const completedQuery = req.query.completed;
    if (
        completedQuery !== undefined &&
        completedQuery !== "true" &&
        completedQuery !== "false"
    ) {
        return res.status(400).json({
            message: "completed must be true or false",
        });
    }
    if (completedQuery !== undefined) {
        const completed = completedQuery === "true";
        result = tasks.filter((t) => t.completed === completed);
    }

    // Optional Task 2
    // Implementing sorting by creation date for GET /tasks.
    const sortQuery = req.query.sort;
    const orderQuery = req.query.order;

    if (sortQuery === "createdAt") {
        if (orderQuery === "asc") {
            result.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt)
            });
        }
        else {
            result.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });
        }
    }
    res.json(result);
}

// Retrieve tasks by priority level.

const getPriorityTask = (req, res) => {

    const tasks = getTasks();
    let priorityLevel = req.params.level.toLowerCase();;

    if (priorityLevel !== "high" &&
        priorityLevel !== "medium" &&
        priorityLevel !== "low") {
        return res.status(400).json({
            message: "Invalid priority level"
        });
    }

    const result = tasks.filter((t) => t.priority === priorityLevel);
    return res.json(result);
}

// Implementation GET /tasks/:id: Retrieve a specific task by its ID.
const getTaskById = (req, res) => {
    return res.status(200).json(req.task)
}

// Implementation POST /tasks: Create a new task with the required fields (title, description, completed).
const createTask = (req, res) => {

    const tasks = getTasks();
    const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);

    const newTask = {
        id: maxId + 1,
        title: req.title,
        description: req.description,
        completed: req.completed,
        priority: req.priority,
        createdAt: new Date().toDateString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    return res.status(201).json(newTask);
}

// Implementation PUT /tasks/:id: Update an existing task by its ID.
const updateTask = (req, res) => {

    const { title, description, completed, priority } = req.body

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({
            message: "completed must be a boolean",
        });
    }

    if (priority !== undefined &&
        priority !== "low" &&
        priority !== "medium" &&
        priority !== "high") {
        return res.status(400).json({
            message: "Invalid priority"
        });
    }

    if (title !== undefined) req.task.title = title;
    if (description !== undefined) req.task.description = description;
    if (completed !== undefined) req.task.completed = completed;
    if (priority !== undefined) req.task.priority = priority;

    saveTasks(req.tasks);

    return res.status(200).json({ message: "Updated Successful" });
}

// Implementation DELETE /tasks/:id: Delete a task by its ID.
const deleteTaskById = (req, res) => {

    const updatedTasks = req.tasks.filter(
        (t) => t.id !== req.taskID
    );

    saveTasks(updatedTasks);

    return res.status(200).json({
        message: "Deleted Successfully",
    });
}

module.exports = { getAllTasks, getPriorityTask, getTaskById, createTask, updateTask, deleteTaskById };