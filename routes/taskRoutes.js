const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

router.get('/', controller.getAllTasks);
router.get('/priority/:level', controller.getTasksByPriority);
router.get('/:id', controller.getTaskById);
router.post('/', controller.createTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
