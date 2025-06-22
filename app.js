const express = require('express');
const { port } = require('./config');
const app = express();

const tasks = [];
let idCounter = 1;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.get('/', (req, res)=> {
    res.send('app started successfully')
})

//Retrieve all tasks.
app.get('/tasks', (req, res) => {
    const { completed } = req.query;

    if (completed) {
        if (completed !== 'true' && completed !== 'false') res.status(400).json({error: "Invalid query, use either true or false"});
        const filteredTasks = tasks.filter(t => t.completed === (completed === 'true'));
        return res.json(filteredTasks);
    }

    res.json(tasks);
});

//Retrieve a specific task by its ID.
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

//Create a new task with the required fields (title, description, completed).
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
  
    if (missingFields.length > 0) {
        return res.status(400).json({error: `${missingFields.join(' and ')} ${missingFields.length === 1 ? 'is' : 'are'} required`})
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed status must be true, false, or not included'});
    }

    const task = {
        id: idCounter++,
        title,
        description: description || '',
        completed: completed || false,
    };

    tasks.push(task);
    res.status(201).json(task);
});

//Update an existing task by its ID.
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

//Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  res.status(204).send();
});


module.exports = app;