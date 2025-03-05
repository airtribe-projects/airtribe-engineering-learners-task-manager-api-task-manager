const express = require('express');
const app = express();
const port = 3000;
const tasks = require("./task.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(tasks.tasks[0])

app.get("/tasks", (req, res) =>{

    res.send(tasks.tasks)
})


app.get("/tasks/:id", (req, res) =>{

    const id = parseInt(req.params.id)
    const task = tasks.tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" }); // ✅ Proper 404 response
    }

    res.json(task);
})

app.post("/tasks", (req, res) =>{

    const {title, description, completed= false} = req.body

    if(!title || !description){
        return res.status(400).json({error:"Title and description are required."})
    }

    if(typeof completed !== "boolean"){
        return res.status(400).json({ error: "Completed status must be a boolean." });
    }
    
    const newTask = {
        id: tasks.tasks.length +1,
        title,
        description,
        completed
    }
    tasks.tasks.push(newTask)
    res.status(201).json(newTask);
})

app.put("/tasks/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    const task = tasks.tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" }); // ✅ Proper 404 response
    }
    const { title, description, completed } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
    }
    if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed status must be a boolean." });
    }
    task.title = req.body.title
    task.description = req.body.description
    task.completed = req.body.completed


    res.send(task)
})

app.delete("/tasks/:id" , (req, res) =>{
    const id = parseInt(req.params.id);
    const task = tasks.tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" }); // ✅ Proper 404 response
    }
    const taskIndex = tasks.tasks.indexOf(task)
    tasks.tasks.splice(taskIndex, 1)
    res.send("deleted successfully")
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;