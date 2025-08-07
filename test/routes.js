const express = require('express');
const router = express.Router();

const taskController = require('./taskController');

router.get('/api/tasks', taskController.getAllTasks);
router.get('/api/tasks/:id', taskController.getTaskById);
router.post('/api/tasks', taskController.createTask);
router.put('/api/tasks/:id', taskController.updateTask);
router.delete('/api/tasks/:id', taskController.deleteTask);

module.exports = router;
