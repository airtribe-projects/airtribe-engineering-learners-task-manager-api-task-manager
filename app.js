const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksFilePath = path.join(__dirname, 'task.json');
let tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
let tasks = [...tasksData.tasks];

const validateTask = (body) => {

    if(!body.title || !body.description || body.completed === undefined) {
        return false;
    }

    if(typeof body.completed !== 'boolean'){
        return false;
    }
    return true;
}

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});


app.post("/tasks", (req, res) => {
    if(!validateTask(req.body)){
        return res.status(400).json({ error: "Invalid task data" });
    }
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    if(!validateTask(req.body)){
        return res.status(400).json({ error: "Invalid task data" });
    }
    task.title = req.body.title;
    task.description = req.body.description;
    task.completed = req.body.completed;
    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
    res.json(task);
});

module.exports = app;