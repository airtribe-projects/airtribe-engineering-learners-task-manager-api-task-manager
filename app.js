const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


const FILE = "task.json";

const readTasks = () =>JSON.parse(fs.readFileSync(FILE, 'utf-8'));

const writeTasks = (tasks) =>fs.writeFileSync(FILE, JSON.stringify(tasks));

const isValidTask = (task) => {
    return task && typeof task.title === 'string' && typeof task.description === 'string'
    && typeof task.completed === "boolean"; 
}

app.post('/tasks', (req, res) => {
    const newtask = req.body;
   if (!isValidTask(newtask)) {
        return res.status(400).json({});
    }
     

    const tasks = readTasks();
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const task = { id : newId , ...newtask };
    tasks.push(task)
    writeTasks(tasks);
    res.status(201).json(task);

});

app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
});


app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const id  =Number( req.params.id);
    const task = tasks.find(t => t.id ===(id));
    if (!task) {
        return res.status(404).json({});
    }
    res.status(200).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
     const id  =Number( req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === (id));
    if(taskIndex === -1){
        return res.status(404).json({})
    }
    if(!isValidTask(req.body)){
        return res.status(400).json({})
    }

    tasks[taskIndex] = { id , ...req.body}
    writeTasks(tasks);
    res.status(200).json(tasks[taskIndex]);

});

app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
     const id  =Number( req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === (id));
    if (taskIndex === -1) {
        return res.status(404).json({ });
    }
    const newTasks = tasks.filter(t => t.id !== parseInt(id));
    writeTasks(newTasks);
    res.status(200).json({});

});



module.exports = app;