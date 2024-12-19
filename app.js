const express = require('express');
const app = express();
const port = 3000;
const allData = require("./task.json");

const tasks = allData["tasks"];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


app.get("/tasks", (req, res) => {
    res.status(200).send(tasks);
});

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Success"
    });
})

//* Get a task
app.get("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const isValid = !isNaN(id) && id <= tasks.length;

    if(isValid) {
        res.status(200).send(tasks[id - 1]);
    }
});

//* Update a task
app.put("/tasks/:id", (req, res) => {
    const body = req.body;
    const isValid = !isNaN(id) && id <= tasks.length;

    if(isValid) {
        const taskToUpdate = tasks[id - 1];
        for(const key in body) {
            if(taskToUpdate.hasOwnProperty(key)) {
                taskToUpdate[key] = body[key];
            }
        }

        return res.status(200).send({
            message: "Success",
            updatedTask: taskToUpdate
        });
    }
});

console.log("TASKS UPDATED: ", tasks);


//* Add a new task
app.post("/tasks", (req, res) => {
    const body = req.body;

    const id = tasks.length + 1;
    const newTask = { id, ...body }; 
    tasks.push(newTask);
    res.status(201).send({
        message: "Success",
        task: newTask
    });
});


//* Delete a task
app.delete("/tasks/:id", (req, res) =>{
    const isValid = !isNaN(id) && id <= tasks.length;
    
    if(isValid) {
        delete tasks[id-1];
        res.status(200).send({
            message: "Success"
        });
    }
});

module.exports = app;