
const service = require("../services/task.service");
const utils = require('../utils/task-validation')

const getAllTasks = async (req, res) => {
    const params ={completed,sortBy,priority}=req.query;
    try {
 const tasks = await service.getAllTasks(params);
 console.log("Controller layer - getAllTasks", tasks);
        res.json(tasks);
    } catch (err) {
      console.error("Controller error - getAllTasks:", err.message);
        res.status(500).json({ message: "Internal Server Error" });  
    }
};

const getTask = async (req, res) => {
    const id =Number(req.params.id);
    const task = await service.getTask(id);
    if(!task){
        return res.status(404).json({message:"task not found"})
    }
    res.json(task);
};

const createTask = async (req, res) => {
    const { title, description, completed } = req.body;

    // Input validation
    if (!utils.isValidTask(title, description, completed)) {
        return res.status(400).json({ message: "Invalid input" });
    }
    const newtask = {
        title,
        description,
        completed
    };
    let task;
    try {
        task = await service.createTask(newtask);
    } catch (err) {
        if (err.message === "Task already exists") {
            return res.status(400).json({ message: "Task already exists" });
        }
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json(task);
};

const updateTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

    if (!utils.isValidTask(title, description, completed)) {
        return res.status(400).json({ message: "Invalid task data" });
    }

    const task = await service.updateTask(req.params.id, req.body);
        res.json(task);
} catch (err) {
    if (err.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
    }
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
}
};

const deleteTask = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await service.deleteTask(id);
    } catch (err) {
        if (err.message === "Task not found") {
            return res.status(404).json({ message: "Task not found" });
        }
        console.error("Error deleting task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
};


module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};