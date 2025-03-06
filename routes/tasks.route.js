const express= require('express');
const { route } = require('../app');
const router = express.Router();
const taskController = require('../controller/task.controller');


const taskList = require('../task.json');

//Middleware
const validateTask = (req,res,next)=>{
    const task = req.body;
    if (!task.title || !task.description) {
        return res.status(400).send({message: "Invalid task data"});
    }

    const type = typeof task.completed;
    if(type !== "boolean"){
        return res.status(400).send({message: "Invalid task data"});
    }
    next();
}

//Middleware
const validateTaskId = (req,res,next)=>{
    const taskId = req.params.id;
    const task = taskList.tasks.find(task => task.id === Number(taskId));
    if (!task) {
        return res.status(404).send({message: "Task not found"});
    }
    next();
}

//Routes
router.post("/", validateTask, taskController.addTask);
router.get("/", taskController.getAllTasks);
router.get("/:id",validateTaskId, taskController.getTask); 
router.put("/:id", validateTaskId, validateTask, taskController.updateTask);
router.delete("/:id",validateTaskId,  taskController.deleteTask);

module.exports = router;