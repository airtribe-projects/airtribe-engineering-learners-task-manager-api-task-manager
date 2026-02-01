const express = require('express');
const fs = require('fs/promises');
const app = express();
const path = require('path');
const crypto = require('crypto');

require('dotenv').config()
const port = process.env.PORT || 3000
const TASKS_FILE_PATH = path.join(__dirname, 'task.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks', async (req, res) => {
    const sortOnDate = req.query.sortOnDate;      
    const completed = req.query.completed;   

    try {
        const fileData = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        let data = JSON.parse(fileData);
        let tasks = data.tasks;

        if (completed !== undefined) {
            if (completed !== 'true' && completed !== 'false') {
                return res.status(400).json({
                    msg: "completed must be true or false"
                });
            }

            tasks = tasks.filter(task =>
                task.completed === JSON.parse(completed)
            );
        }

        if (sortOnDate !== undefined) {
            
            
            if (sortOnDate !== 'true' && sortOnDate !== 'false') {
                return res.status(400).json({
                    msg: "sort must be boolean"
                });
            }

            tasks.sort((a, b) => {
                let dateA = new Date(a.createdAt)
                let dateB = new Date(b.createdAt)
                return JSON.parse(sortOnDate) ?  dateB - dateA :dateA - dateB 
            }); 
        }

        res.status(200).json(
            tasks
        );
       

    } catch (error) {
        res.status(500).json({
            msg: "Failed to read tasks",
            error: error.message
        });
    }
});



app.get('/tasks/:id', async (req, res) => {
    let id = +req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({
            msg: "task ID must be a number"
        });
    }
    try {
        let fileData = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        let data = JSON.parse(fileData);
        let task = data.tasks.find((task) => task.id === id);
        if (task) {
            res.status(200).json(task)
        } else {
            res.status(404).json({ msg: "Task with this id dont exists" })
        }

    } catch (error) {
        res.status(500).json({ msg: "Failed to get the tasks", error: error.message })
    }

})



app.delete('/tasks/:id', async (req, res) => {
    let id = +req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({
            msg: "task ID must be a number"
        });
    }
    try {
        let fileData = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        let data = JSON.parse(fileData);
        let task = data.tasks.find((task) => task.id === id);
        if (task) {
            let updatedTask = data.tasks.filter((task) => task.id !== id);
            data.tasks = updatedTask;
            try {
                await fs.writeFile(TASKS_FILE_PATH, JSON.stringify(data, null, 2))
                res.status(200).json({ msg: "Task deleted succfully" })
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: "error in task deletion" })
            }
        } else {
            res.status(404).json({ msg: "Task with this id dont exists" })
        }

    } catch (error) {
        res.status(500).json({ msg: "Failed to get the tasks", error: error.message })
    }

})

app.post('/tasks', async (req, res) => {
    try {
        const { title, description, completed, priority } = req.body;
        let createdAt = new Date().toISOString()

        if (!title || !description || completed === undefined || priority === undefined  || typeof completed !== 'boolean') {
            return res.status(400).json({
                msg: "title, description, priority and completed are required fields (completed must be boolean)"
            });
        }

        const fileData = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileData);

        const tasks = data.tasks || [];
        const id = crypto.randomUUID();

        const task = { id, title, description, completed, priority, createdAt };

        tasks.push(task);
        data.tasks = tasks;

        await fs.writeFile(TASKS_FILE_PATH, JSON.stringify(data, null, 2));

        res.status(201).json({
            tasks: data.tasks,
            msg: "Task added successfully"
        });

    } catch (error) {
        res.status(500).json({
            msg: "Failed to add task",
            error: error.message
        });
    }
});


app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            msg: "Task ID must be a valid integer"
        });
    }

    try {
        const fileData = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileData);

        const tasks = data.tasks || [];

        const index = tasks.findIndex(task => task.id === id);

        if (index === -1) {
            return res.status(404).json({
                msg: "Task with this ID does not exist"
            });
        }

        const { title, description, completed, priority } = req.body;

        if (!title || !description || completed === undefined || typeof completed !== 'boolean') {
            return res.status(400).json({
                msg: "title, description, priority and completed are required fields (completed must be boolean)"
            });
        }
        const existingTask = tasks[index];
        tasks[index] = {
            ...existingTask,
            id,
            title,
            description,
            completed,
            priority
        };

        data.tasks = tasks;

        await fs.writeFile(TASKS_FILE_PATH, JSON.stringify(data, null, 2));

        return res.status(200).json(tasks[index]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Failed to update task",
            error: error.message
        });
    }
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;