const taskData = require('./task.json');
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/tasks/:id', (req, res) => {
    console.log("id", req.params.id);
    const taskId = req.params.id;
    const task = taskData.tasks.find(t => t.id === parseInt(taskId));
    if (!task) {
        return res.status(404).send({ "message": `Task: ${taskId} not found` })
    }
    res.status(200).send(task);
})

app.post('/tasks', (req, res) => {

    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required',
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required',
        });
    }
    else if (typeof req.body.completed !== 'boolean') {
        return res.status(400).send({
            success: 'false',
            message: 'completed is boolean',
        });
    }
    const task = req.body;
    task.id = taskData.tasks.length + 1;
    taskData.tasks.push(task);
    return res.status(201).send(task);
})

app.put('/tasks/:id', (req, res) => {
    let taskFound;
    let itemIndex;
    let id = req.params.id;
    taskData.tasks.map((task, index) => {

        if (task.id == id) {
            taskFound = task;
            itemIndex = index;
        }
    });

    if (!taskFound) {
        return res.status(404).send({
            success: 'false',
            message: 'task not found',
        });
    }
    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required',
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required',
        });
    } else if (typeof req.body.completed !== 'boolean') {
        return res.status(400).send({
            success: 'false',
            message: 'completed is boolean',
        });
    }

    const newTask = {
        id: taskFound.id,
        title: req.body.title || taskFound.title,
        description: req.body.description || taskFound.description,
    };
    taskData.tasks.splice(itemIndex, 1, newTask);
    
    return res.status(200).send(newTask);
})

app.delete('/tasks/:id', (req, res) => {
    let id = req.params.id;
    let taskFound;
    let itemIndex;
    taskData.tasks.map((task, index) => {
        if (task.id == id) {
            taskFound = task;
            itemIndex = index;
        }
    });

    if (!taskFound) {
        return res.status(404).send({
            success: 'false',
            message: 'task not found',
        });
    }

    taskData.tasks.splice(itemIndex, 1);
    return res.status(200).send({
        success: 'true',
        message: 'Task deleted successfuly',
    });
});

app.get('/tasks', (req, res) => {
    let filteredTasks = taskData.tasks;
    const completedQuery = req.query.completed;

    if (completedQuery !== undefined) {

        const isCompleted = completedQuery === 'true';
        filteredTasks = taskData.tasks.filter(task => task.completed === isCompleted);
    }

    res.status(200).send(filteredTasks);
})

app.get('/tasks/priority/:level', (req, res) => {
    let filteredTasks = taskData.tasks;
    const level = req.params.level;

    if (level !== undefined) {

        filteredTasks = taskData.tasks.filter(task => task.priority === level);
    }

    res.status(200).send(filteredTasks);
})
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;