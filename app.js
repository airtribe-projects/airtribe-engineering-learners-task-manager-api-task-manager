const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasks=[
{
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
}];
let nextId = 2;

function taskvalidation(task)
{
    return(
        task &&
        typeof task.title === 'string'&& task.title.trim().length > 0 &&      
        typeof task.description === 'string' && task.description.trim().length > 0 &&
        typeof task.completed === 'boolean'
    )
}

app.get('/tasks', (req, res) => {
    res.status(200).send(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((item) => item.id === id);
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send(task);
});

app.post('/tasks', (req, res) => {
    const newtask = req.body;
    if (!taskvalidation(newtask)) {
        return res.status(400).send({ error: 'Invalid task data' });
    }
    const taskToCreate = {
    id: nextId++,
    title: newtask.title,
    description: newtask.description,
    completed: newtask.completed,
  };
  tasks.push(taskToCreate);
  res.status(201).send(taskToCreate);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Id not found' });
  }

  const updatedTask = req.body;
  if (!taskvalidation(updatedTask)) {
    return res.status(400).send({ error: 'Invalid task data' });
  }

  tasks[taskIndex] = {
    id,
    title: updatedTask.title,
    description: updatedTask.description,
    completed: updatedTask.completed,
  };

  res.status(200).send(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).send({ message: 'Task deleted' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error' });
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, (err) => {
    if (err) {
      return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
  });
}


module.exports = app;