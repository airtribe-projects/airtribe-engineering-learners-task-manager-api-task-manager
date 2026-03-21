const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const VALID_PRIORITIES = ['low', 'medium', 'high'];

let tasks = require('./task.json').tasks;
let nextId = Math.max(...tasks.map(t => t.id)) + 1;

// GET /tasks - Retrieve all tasks (with optional filtering and sorting)
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    // Filter by completion status
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(t => t.completed === completed);
    }

    // Sort by creation date (id as proxy) - ?sort=asc or ?sort=desc
    if (req.query.sort === 'asc') {
        result.sort((a, b) => a.id - b.id);
    } else if (req.query.sort === 'desc') {
        result.sort((a, b) => b.id - a.id);
    }

    res.status(200).json(result);
});

// GET /tasks/priority/:level - Retrieve tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level.toLowerCase();
    if (!VALID_PRIORITIES.includes(level)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    const result = tasks.filter(t => t.priority === level);
    res.status(200).json(result);
});

// GET /tasks/:id - Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid task data. title (string), description (string), and completed (boolean) are required.' });
    }
    const taskPriority = priority ? priority.toLowerCase() : 'medium';
    if (!VALID_PRIORITIES.includes(taskPriority)) {
        return res.status(400).json({ error: 'Invalid priority. Use low, medium, or high.' });
    }
    const newTask = { id: nextId++, title, description, completed, priority: taskPriority };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Update an existing task by ID
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed, priority } = req.body;
    if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid task data. title (string), description (string), and completed (boolean) are required.' });
    }
    if (priority !== undefined) {
        const p = priority.toLowerCase();
        if (!VALID_PRIORITIES.includes(p)) {
            return res.status(400).json({ error: 'Invalid priority. Use low, medium, or high.' });
        }
        task.priority = p;
    }
    task.title = title;
    task.description = description;
    task.completed = completed;
    res.status(200).json(task);
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const deleted = tasks.splice(index, 1);
    res.status(200).json(deleted[0]);
});

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}

module.exports = app;