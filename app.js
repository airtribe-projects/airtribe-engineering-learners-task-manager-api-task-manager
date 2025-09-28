const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  },
  {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using Magic",
    completed: false,
  },
  {
    id: 3,
    title: "Build task manager API",
    description: "Implement CRUD APIs with Express",
    completed: false,
  },
];


app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:id',(req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id))
    if (!task) {
        return res.status(404);
    }
    res.json(task);
})

app.post('/tasks', (req, res) => {
    const newtask = req.body;
    newtask.id = tasks.length + 1;
    tasks.push(newtask);
    res.status(201)
});

app.put('/tasks/:id', (req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id))
    if (!task) {
        return res.status(404);
    }
   task.title = req.body.title;
   task.description = req.body.description;
   task.completed = req.body.completed;
   res.json(task);
})

app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id))
    if (taskIndex === -1) {
        return res.status(404);
    }
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.status(204).send();
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;