const express = require('express');
const taskDetails = require('/Users/Myra/Desktop/nodeJSRepo/task-manager-api-sairamyaM/task.json');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send('hello world')
});

app.get("/tasks",(req,res)=>{
    res.send(taskDetails.tasks);
});

app.get("/tasks/:id",(req,res)=>{
    const id = req.params.id
    const details = taskDetails.tasks.find((item)=>item.id===parseInt(id))
    if(!details){return res.status(404).send("invalid id")}
    res.status(200).send(details);
});

app.put("/tasks/:id",(req,res)=>{
    const id = req.params.id
    const { title, description, completed } = req.body;

    const task = taskDetails.tasks.find((item)=>item.id===parseInt(id));
    if(!task){
        return res.status(404).send({ error: "Invalid task id" })
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid value for 'completed'" });
    }

    if(title!= undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (typeof completed === "boolean") task.completed = completed;

    res.status(200).send(task);

});



app.post("/tasks",(req,res)=>{
    const {title,description,completed} = req.body;
     if (!title || !description || typeof completed !== "boolean") {
        return res.status(400).send({ error: "Invalid task data" });
    }
   const newTask = req.body;
   newTask.id = taskDetails.tasks.length + 1;
    
    taskDetails.tasks.push(newTask);
    res.status(201).send(newTask);
});

app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = taskDetails.tasks.findIndex((task) => task.id === id);

    if (index == -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const deletedTask = taskDetails.tasks.splice(index, 1)[0];

    res.status(200).json(deletedTask);
});



app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;