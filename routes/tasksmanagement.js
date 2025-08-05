const express = require('express');
const router = express.Router();
const tasks = require('../models/tasks'); // Import the tasks model

router.get('/tasks',(req,res)=>{
    res.status(200);
    res.send(tasks);
})

router.post('/tasks',(req,res)=>{
    const newTask=req.body;
    
    // Validation: check required fields
    if (!newTask.title || !newTask.description || typeof newTask.completed !== 'boolean') {
        return res.status(400).send({ error: "Invalid task data" });
    }
    
    // Generate new ID
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    newTask.id = newId;
    
    tasks.push(newTask);
    res.status(201).send(newTask);
})

router.get('/tasks/:id',(req,res)=>{
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        res.status(200).send(task);
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});

router.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).send({ error: "Task not found" });
    }
    
    const updateData = req.body;
    
    // Validation: check data types if fields are provided
    if (updateData.title && typeof updateData.title !== 'string') {
        return res.status(400).send({ error: "Invalid task data" });
    }
    if (updateData.description && typeof updateData.description !== 'string') {
        return res.status(400).send({ error: "Invalid task data" });
    }
    if (updateData.completed !== undefined && typeof updateData.completed !== 'boolean') {
        return res.status(400).send({ error: "Invalid task data" });
    }
    
    const updatedTask = { ...tasks[taskIndex], ...updateData };
    tasks[taskIndex] = updatedTask;
    res.status(200).send(updatedTask);
});

router.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(200).send({ message: "Task deleted successfully" });
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});

module.exports = router;
