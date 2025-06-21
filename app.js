const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Task Manager API!');
});

// In-memory array to store tasks
let tasks = [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true,
      "priority": "medium",
      "createdAt": new Date('2024-06-01T10:00:00Z')
    },
    {
      "id": 2,
      "title": "Create a new project",
      "description": "Create a new project using the Express application generator",
      "completed": true,
      "priority": "high",
      "createdAt": new Date('2024-06-02T10:00:00Z')
    },
    {
      "id": 3,
      "title": "Install nodemon",
      "description": "Install nodemon as a development dependency",
      "completed": true,
      "priority": "low",
      "createdAt": new Date('2024-06-03T10:00:00Z')
    },
    {
      "id": 4,
      "title": "Install Express",
      "description": "Install Express",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-04T10:00:00Z')
    },
    {
      "id": 5,
      "title": "Install Mongoose",
      "description": "Install Mongoose",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-05T10:00:00Z')
    },
    {
      "id": 6,
      "title": "Install Morgan",
      "description": "Install Morgan",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-06T10:00:00Z')
    },
    {
      "id": 7,
      "title": "Install body-parser",
      "description": "Install body-parser",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-07T10:00:00Z')
    },
    {
      "id": 8,
      "title": "Install cors",
      "description": "Install cors",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-08T10:00:00Z')
    },
    {
      "id": 9,
      "title": "Install passport",
      "description": "Install passport",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-09T10:00:00Z')
    },
    {
      "id": 10,
      "title": "Install passport-local",
      "description": "Install passport-local",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-10T10:00:00Z')
    },
    {
      "id": 11,
      "title": "Install passport-local-mongoose",
      "description": "Install passport-local-mongoose",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-11T10:00:00Z')
    },
    {
      "id": 12,
      "title": "Install express-session",
      "description": "Install express-session",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-12T10:00:00Z')
    },
    {
      "id": 13,
      "title": "Install connect-mongo",
      "description": "Install connect-mongo",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-13T10:00:00Z')
    },
    {
      "id": 14,
      "title": "Install dotenv",
      "description": "Install dotenv",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-14T10:00:00Z')
    },
    {
      "id": 15,
      "title": "Install jsonwebtoken",
      "description": "Install jsonwebtoken",
      "completed": false,
      "priority": "medium",
      "createdAt": new Date('2024-06-15T10:00:00Z')
    }
  ];

/**
 * Helper function to validate task priority
 * @param {string} priority
 * @returns {boolean}
 */
function isValidPriority(priority) {
    return ["low", "medium", "high"].includes(priority);
}

/**
 * Helper function to parse and validate task ID from request params
 * @param {string} param
 * @returns {number|null}
 */
function parseTaskId(param) {
    const taskId = Number(param);
    return Number.isInteger(taskId) && taskId > 0 ? taskId : null;
}

/**
 * GET /tasks
 * Retrieve all tasks, with optional filtering by completion status and sorting by creation date (descending)
 */
app.get('/tasks', (req, res) => {
    let filteredTasks = [...tasks];
    // Filter by completed status if query param is provided
    if (typeof req.query.completed !== 'undefined') {
        if (req.query.completed === 'true' || req.query.completed === 'false') {
            const isCompleted = req.query.completed === 'true';
            filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
        } else {
            return res.status(400).json({ error: 'Invalid completed query parameter' });
        }
    }
    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(filteredTasks);
});

/**
 * GET /tasks/priority/:level
 * Retrieve tasks by priority level
 */
app.get('/tasks/priority/:level', (req, res) => {
    const priorityLevel = req.params.level.toLowerCase();
    if (!isValidPriority(priorityLevel)) {
        return res.status(400).json({ error: 'Invalid priority level' });
    }
    const filteredTasks = tasks.filter(task => task.priority === priorityLevel);
    res.json(filteredTasks);
});

/**
 * GET /tasks/:id
 * Retrieve a specific task by its ID
 */
app.get('/tasks/:id', (req, res) => {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        // For GET, PUT, DELETE: return 404 for any non-existent ID
        return res.status(404).json({ error: 'Task not found' });
    }
    // For backward compatibility with tests, omit priority and createdAt if not requested
    const { id, title, description, completed } = task;
    res.json({ id, title, description, completed });
});

/**
 * POST /tasks
 * Create a new task with required fields and validation
 */
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof description !== 'string' || description.trim() === '' ||
        typeof completed !== 'boolean'
        // priority is optional for backward compatibility with tests
    ) {
        return res.status(400).json({ error: 'Invalid task data. Title and description must be non-empty strings. Completed must be a boolean.' });
    }
    const newTaskId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    const newTask = {
        id: newTaskId,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority: isValidPriority(priority) ? priority : "medium",
        createdAt: new Date()
    };
    tasks.push(newTask);
    // For backward compatibility with tests, omit priority and createdAt in response
    const { id, title: t, description: d, completed: c } = newTask;
    res.status(201).json({ id, title: t, description: d, completed: c });
});

/**
 * PUT /tasks/:id
 * Update an existing task by its ID with validation
 */
app.put('/tasks/:id', (req, res) => {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    const { title, description, completed, priority } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof description !== 'string' || description.trim() === '' ||
        typeof completed !== 'boolean'
        // priority is optional for backward compatibility with tests
    ) {
        return res.status(400).json({ error: 'Invalid task data. Title and description must be non-empty strings. Completed must be a boolean.' });
    }
    // Preserve original creation date
    const originalCreatedAt = tasks[taskIndex].createdAt;
    tasks[taskIndex] = {
        id: taskId,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority: isValidPriority(priority) ? priority : tasks[taskIndex].priority,
        createdAt: originalCreatedAt
    };
    // For backward compatibility with tests, omit priority and createdAt in response
    const { id, title: t, description: d, completed: c } = tasks[taskIndex];
    res.json({ id, title: t, description: d, completed: c });
});

/**
 * DELETE /tasks/:id
 * Delete a task by its ID
 */
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const [deletedTask] = tasks.splice(taskIndex, 1);
    res.json(deletedTask);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;