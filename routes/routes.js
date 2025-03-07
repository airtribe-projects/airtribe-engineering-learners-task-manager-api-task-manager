const express = require('express');
const router = express.Router();
const validateTask = require('../middleware/middleware');
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByPriority,
} = require('../controllers/taskController');


router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask(false), createTask);
router.put('/:id', validateTask(true), updateTask);
router.delete('/:id', deleteTask);
router.get('/priority/:level', getTasksByPriority);

module.exports = router;

