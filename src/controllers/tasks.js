const { tasks } = require("../../task.json");

const filterTasks = (req, res) => {
    const query = req.query;
    let filteredTasks = tasks;
    if (query.completed !== undefined) {
        filteredTasks = filteredTasks.filter(
            (task) => task.completed.toString() === query.completed
        );
    }
    return res.status(200).send(filteredTasks);
};

const getTasks = (req, res) => {
    const id = req.params.id;
    const task = tasks.find((task) => task.id === parseInt(id));
    if (!task) {
        return res.status(404).send("Task not found");
    }
    return res.status(200).send(task);
};

const addTasks = (req, res) => {
    try {
        const task = req.body;
        console.log(task);

        if (!task.title || !task.description || task.completed === undefined) {
            return res.status(400).json({ error: "Task name is required" });
        }

        task.id = tasks.length + 1;
        tasks.push(task);

        return res.status(201).json({ message: "Task added", task });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateTask = (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).send("Task not found");
    }

    const { title, description, completed, priority } = req.body;

    if (
        title !== undefined && typeof title !== "string" ||
        description !== undefined && typeof description !== "string" ||
        completed !== undefined && typeof completed !== "boolean" ||
        priority !== undefined && typeof priority !== "string"
    ) {
        return res.status(400).send("Bad request: Invalid input data");
    }

    // Update only valid fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;

    return res.status(200).send("Task updated");
};

const deleteTask = (req, res) => {
    const id = req.params.id;
    const task = tasks.find((task) => task.id === parseInt(id));
    if (!task) {
        return res.status(404).send("Task not found");
    }
    tasks.splice(tasks.indexOf(task), 1);
    return res.status(200).send("Task deleted");
};

const filterByPriority = (req, res) => {
    const level = req.params.level;

    let filteredTasks = tasks;
    filteredTasks = tasks.filter(
        (task) => task.priority === level
    );
    return res.status(200).send(filteredTasks);
}

module.exports = {
    getTasks,
    addTasks,
    updateTask,
    deleteTask,
    filterTasks,
    filterByPriority
};
