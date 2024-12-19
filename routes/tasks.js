const express = require('express');
const router = express.Router();

const tasks = [];
let idCount = 1;

router.post('/tasks', (req, res)=>{
    const { title, description, completed } = req.body;

    if (!title || typeof title!=='string'){
        return res
        .status(400)
        .send({message:'Title should be a string'});
    }

    if (!description || typeof description!=='string'){
        return res
        .status(400)
        .send({message:'Description is mandatory and should be a string'});
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res
        .status(400)
        .send({ error: 'Completed must be a boolean.' });
    }

    newTask = {
        title,
        description,
        completed: completed || false,
        id: idCount++
    };

    tasks.push(newTask);
    res.status(201).send(newTask);
});

router.get('/tasks', (req, res)=>{
    res.send(tasks);
});

router.get('/tasks/:id', (req, res)=>{
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex((t)=>t.id===taskId);

    if (index===-1){
        return res
        .status(404)
        .send({message:"Task with id not found"});
    }
    res.send(tasks[index]);
});

router.delete("/tasks/:id", (req, res)=>{
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex((t)=>t.id===taskId);

    if (index===-1){
        return res
        .status(404)
        .send({message:"Task with given id not found"});
    }
    tasks.splice(index, 1);
    res.send({message:"Task deleted successfully"})
});

router.put("/tasks/:id", (req, res)=>{
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex((t)=>t.id===taskId);

    if (index===-1){
        return res
        .status(404)
        .send({message:"Task with given id not found"});
    }

    const { title, description, completed } = req.body;
    const task = tasks[index];


    if (title && typeof title !== 'string') {
        return res.status(400).send({ message: 'Title must be a string.' });
    }
    if (description && typeof description !== 'string') {
        return res.status(400).send({ message: 'Description must be a string.' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send({ message: 'Completed must be a boolean.' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (completed !== undefined) task.completed = completed;

    res.send(task);
});

module.exports = router;