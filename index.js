const express =require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());



let tasks = [];
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);

    res.status(201).json(newTask);
});
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;

    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.get('/tasks', (req, res) => {
    const { title } = req.query;

    if (title) {
        const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(title.toLowerCase()));
        return res.json(filteredTasks);
    }

    res.json(tasks);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
