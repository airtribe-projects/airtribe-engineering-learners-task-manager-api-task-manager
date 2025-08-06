const express = require('express');
var fs = require('fs');
var inMemoryData = JSON.parse(fs.readFileSync('task.json', 'utf8'));


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  res.status(200)
        .json(inMemoryData.tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
    if (!newTask.title || !newTask.description) {
        return res.status(400).json({ error: "Title and description are required" });
    }
    newTask.id = inMemoryData.tasks.length + 1;
    inMemoryData.tasks.push(newTask);
    // fs.writeFileSync('task.json', JSON.stringify(inMemoryData, null, 2));
    res.status(201).json(newTask);
});

app.get("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = inMemoryData.tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    res.status(200).json(task);
});

app.put("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = inMemoryData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    const updatedTask = req.body;
    
    // Validate required fields and data types
    if (!updatedTask.title || !updatedTask.description || typeof updatedTask.completed !== 'boolean') {
        return res.status(400).json({ error: "Title, description are required and completed must be a boolean" });
    }
    
    // Update the task
    inMemoryData.tasks[taskIndex] = {
        id: taskId,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed
    };
    
    res.status(200).json(inMemoryData.tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = inMemoryData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    const deletedTask = inMemoryData.tasks.splice(taskIndex, 1)[0];
    res.status(200).json(deletedTask);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;