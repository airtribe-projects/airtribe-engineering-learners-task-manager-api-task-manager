const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

// Read tasks from task.json
function readTasks() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'task.json'), 'utf8');
        return JSON.parse(data).tasks;
    } catch (err) {
        console.error('Error reading tasks:', err);
        return [];
    }
}

// Write tasks to task.json
function writeTasks(tasks) {
    try {
        fs.writeFileSync(
            path.join(__dirname, 'task.json'),
            JSON.stringify({ tasks: tasks }, null, 2),
            'utf8'
        );
    } catch (err) {
        console.error('Error writing tasks:', err);
    }
}

// Initialize tasks from file
const tasks = readTasks();
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

app.post("/tasks", (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).send({ error: "Title is required" });
    }
    if (description === undefined || completed === undefined) {
        return res.status(400).send({ error: "Description and completed are required" });
    }
    if (typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).send({ error: "Invalid data types" });
    }
    const newTask = { id: nextId++, title: title.trim(), description, completed };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).send(newTask);
})

app.get("/tasks", (req, res) => {
    const tasks = readTasks();
    const { title, description, completed } = req.query;
    
    let filteredTasks = tasks;
    
    // Filter by title
    if (title) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    
    // Filter by description
    if (description) {
        filteredTasks = filteredTasks.filter(task => 
            task.description.toLowerCase().includes(description.toLowerCase())
        );
    }
    
    // Filter by completed status
    if (completed !== undefined) {
        const isCompleted = completed.toLowerCase() === 'true';
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }
    
    res.send(filteredTasks);
})

app.get("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
})

app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    const { title, description, completed } = req.body;
    if (!title || typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).send({ error: "Invalid data" });
    }
    task.title = title;
    task.description = description;
    task.completed = completed;
    writeTasks(tasks);
    res.send(task);
})

app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).send({ error: "Task not found" });
    }
    tasks.splice(index, 1);
    writeTasks(tasks);
    res.send({ message: "Task deleted" });
})

module.exports = app;