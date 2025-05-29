// Router
const express = require('express');
router = express.Router();

const {logRequest} = require('../middlewares/logger');
const {getAllTasks,getTaskById,createTask,updateTaskById,deleteTaskById,getTaskByPriority} = require('../controllers/tasksController');

// Middlewares
router.use(express.json());
router.use(logRequest);
router.use(express.urlencoded({ extended: true }));

// Routes
router.get('/',getAllTasks);
router.get('/:id',getTaskById);
router.post('/',createTask);
router.put('/:id',updateTaskById);
router.delete('/:id',deleteTaskById);
router.get('/tasks/priority/:level',getTaskByPriority);

module.exports = {router};