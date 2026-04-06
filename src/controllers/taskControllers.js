const { tasks } = require("../data/tasks");

const getAllTasks = (req, res) => {
    let result = [...tasks];

    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === "true";
        result = result.filter(t => t.completed === isCompleted);
    }

    res.status(200).json(result);
};

const getTasksById = (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    res.status(200).json(task);
}

const validPriorities = ["low", "medium", "high"];

const createTask = (req, res) => {
    const { title, description, completed, priority } = req.body;

    if (
        !title ||
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof completed !== "boolean" ||
        (priority && !validPriorities.includes(priority))
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const maxId = tasks.length > 0
        ? Math.max(...tasks.map(t => t.id))
        : 0;

    const newTask = {
        id: maxId + 1,
        title,
        description,
        completed,
        priority: priority || "low", // default
        createdAt: new Date()
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
};

const updateTask = (req, res) => {
    const id = Number(req.params.id);
    const { title, description, completed, priority } = req.body;

    const validPriorities = ["low", "medium", "high"];

    if (
        !title ||
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof completed !== "boolean" ||
        (priority && !validPriorities.includes(priority))
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        completed,
        priority: priority || tasks[taskIndex].priority
    };

    res.status(200).json(tasks[taskIndex]);
};

const deleteTask = (req, res) => {
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({
        message: "Task deleted successfully"
    });

}

const getTasksByPriority = (req, res) => {
    const { level } = req.params;

    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(level)) {
        return res.status(400).json({ message: "Invalid priority level" });
    }

    const filtered = tasks.filter(t => t.priority === level);

    res.status(200).json(filtered);
};

module.exports = {
    getAllTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByPriority
};