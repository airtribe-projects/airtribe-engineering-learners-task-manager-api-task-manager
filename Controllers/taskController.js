// importing required modules
const fs = require('fs');
const path = require('path');

// path to the task data --task.json file
const dataPath = path.join(__dirname, '../task.json');

// reading tasks from the JSON file
const tasks = require(dataPath).tasks;

// to keep track of the latest task id
let currentId = tasks.length;

// Get all tasks --GET /tasks
exports.getAllTasks = async (req, res) => {
    try {
      let filteredTasks = tasks;
  
      // Filter tasks by completion status if provided in query
      if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true'; // Convert to boolean
        filteredTasks = tasks.filter(task => task.completed === completed);
      }
  
      // Sorting by creation date if "sort" query parameter is provided
      if (req.query.sort === 'asc' || req.query.sort === 'desc') {
        filteredTasks.sort((a, b) => {
          return req.query.sort === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt) // Ascending order
            : new Date(b.createdAt) - new Date(a.createdAt); // Descending order
        });
      }
  
      // Send the filtered and sorted tasks as the response
      res.status(200).json(filteredTasks);
    } catch (error) {
      // Handle any errors and send a 500 server error response
      res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
  };
  

// Get task by id --GET /tasks/:id
exports.getTaskById = (req, res) => {
  const id = parseInt(req.params.id); // converting id to number
  const task = tasks.find(t => t.id === id); // finding the task

  if (!task) {
    // if not found, send 404 error
    return res.status(404).json({ error: 'Task not found' });
  }

  // if found, send the task
  res.status(200).json(task);
};

// Create a new task --POST /tasks
exports.createTask = (req, res) => {
  const {title, description, completed, priority} = req.body;



  // simple validation check for input data types
  if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input' });
  }

      // Priority validation
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }

  // making a new task object
  const newTask = {
    id: ++currentId,
    title,
    description,
    completed,
    createdAt: new Date().toISOString() // Add timestamp
  };

  // adding new task to list
  tasks.push(newTask);

  // returning created task
  res.status(201).json(newTask);
};

// Update existing task --PUT /tasks/:id
exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id); // get id from URL
  const index = tasks.findIndex(t => t.id === id); // find the task index

  if (index === -1) {
    // task not found
    return res.status(404).json({ error: 'Task not found' });
  }

  const {title, description, completed, priority} = req.body;

    // Priority validation
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

  // validate input data
  if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // update the task data
  tasks[index] = { id, title, description, completed, priority: priority || tasks[index].priority };

  // send updated task
  res.status(200).json(tasks[index]);
};

// Delete a task -DELETE /tasks/:id
exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id); // get index of task

  if (index === -1) {
    
    return res.status(404).json({ error: 'Task not found' });
  }

  // remove task from array
  tasks.splice(index, 1);

  res.status(200).json({ message: 'Task deleted successfully' });
};
