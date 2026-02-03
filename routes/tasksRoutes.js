const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask, getTasksByPriority } = require('../controllers/tasksControllers');

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.get('/priority/:priority', getTasksByPriority);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;