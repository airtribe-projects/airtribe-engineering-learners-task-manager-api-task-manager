// importing express
const express = require('express');

// creating a router object
const router = express.Router();

// importing all the controller functions for tasks
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../Controllers/taskController');


router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// exporting the router to be used in other files (like app.js/server.js)
module.exports = router;
