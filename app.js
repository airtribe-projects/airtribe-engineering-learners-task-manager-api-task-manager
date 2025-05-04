const express = require('express');

// middleware
const {validateTaskId, validateTaskBody} = require("./src/middleware/taskValidations");

// static data
const tasks = require('./task.json').tasks;


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
    const {completed, sort} = req.query;
    let result = tasks;

    if (completed) {
        if (completed !== "true" && completed !== "false") {
            return res.status(400).send({ err: "completed query must be 'true' or 'false'" });
        }
        const completedBool = completed === "true";
        result = result.filter(item => item.completed === completedBool);
    }

    if (sort === "asc" || sort === "desc") {
        result = result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : null;
            const dateB = b.createdAt ? new Date(b.createdAt) : null;
    
            if (!dateA && !dateB) return 0;
            if (!dateA) return sort === "asc" ? 1 : -1;
            if (!dateB) return sort === "asc" ? -1 : 1;
    
            return sort === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    return res.status(200).send(result);
})

app.get("/tasks/:id", validateTaskId, (req, res) => {
    const {taskId} = req;
    const response = tasks.find(task => task.id === taskId);
    if(!response){
        return res.status(404).send({err: "No response found"});
    }
    return res.status(200).send(response);
})

app.get("/tasks/priority/:level", (req, res) => {
    const { level } = req.params;
    const validLevels = ["low", "medium", "high"];

    if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).send({ err: "Invalid priority level. Use low, medium, or high." });
    }

    const filtered = tasks.filter(task => task.priority?.toLowerCase() === level.toLowerCase());
    
    res.status(200).send(filtered);
});

app.post("/tasks", validateTaskBody(true), (req, res) => {
    const { title, description, completed, priority } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title: title.trim(),
        description: description.trim(),
        completed,
        createdAt: new Date().toISOString(),
        priority: priority ? priority : "low"
    };
    tasks.push(newTask);
    return res.status(201).send(newTask);
})

app.put("/tasks/:id", validateTaskId, validateTaskBody(false), (req, res) => {
    const {taskId} = req;

    const task = tasks.find(task => task.id === taskId);
    if(!task) {
        return res.status(404).send({err: "No such task available"})
    }

    const { title, description, completed, priority } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;

    res.status(200).send(task);
})

app.delete('/tasks/:id', validateTaskId, (req, res) => {
    const {taskId} = req;

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).send(deletedTask);
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;