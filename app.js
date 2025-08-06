const express = require('express');
const app = express();
const port = 3000;

// Sample predefined tasks (you can move this to tasks.js if needed)
let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true
  },
  {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using the Express application generator",
    completed: true
  },
  {
    id: 3,
    title: "Install nodemon",
    description: "Install nodemon as a development dependency",
    completed: true
  },
  {
    id: 4,
    title: "Install Express",
    description: "Install Express",
    completed: false
  },
  {
    id: 5,
    title: "Install Mongoose",
    description: "Install Mongoose",
    completed: false
  },
  {
    id: 6,
    title: "Install Morgan",
    description: "Install Morgan",
    completed: false
  },
  {
    id: 7,
    title: "Install body-parser",
    description: "Install body-parser",
    completed: false
  },
  {
    id: 8,
    title: "Install cors",
    description: "Install cors",
    completed: false
  },
  {
    id: 9,
    title: "Install passport",
    description: "Install passport",
    completed: false
  },
  {
    id: 10,
    title: "Install passport-local",
    description: "Install passport-local",
    completed: false
  },
  {
    id: 11,
    title: "Install passport-local-mongoose",
    description: "Install passport-local-mongoose",
    completed: false
  },
  {
    id: 12,
    title: "Install express-session",
    description: "Install express-session",
    completed: false
  },
  {
    id: 13,
    title: "Install connect-mongo",
    description: "Install connect-mongo",
    completed: false
  },
  {
    id: 14,
    title: "Install dotenv",
    description: "Install dotenv",
    completed: false
  },
  {
    id: 15,
    title: "Install jsonwebtoken",
    description: "Install jsonwebtoken",
    completed: false
  }
];

let currentId = tasks.length + 1;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation middleware
function validateTaskInput(req, res, next) {
  const { title, description, completed } = req.body;

  if (
    typeof title !== 'string' || title.trim() === '' ||
    typeof description !== 'string' || description.trim() === '' ||
    typeof completed !== 'boolean'
  ) {
    return res.status(400).json({
      error: 'Invalid input: title and description must be non-empty strings, completed must be a boolean.'
    });
  }

  next();
}

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - Get task by ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', validateTaskInput, (req, res) => {
  const { title, description, completed } = req.body;

  const newTask = {
    id: currentId++,
    title,
    description,
    completed
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', validateTaskInput, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, completed } = req.body;

  tasks[index] = {
    id,
    title,
    description,
    completed
  };

  res.json(tasks[index]);
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
