const Router = require('express').Router();
const {
    getTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
} = require('./../controllers/tasksController');

Router.get('/', getTasks);
Router.get('/:id', getTaskById);
Router.post('/', addTask);
Router.put('/:id', updateTask);
Router.delete('/:id', deleteTask);

module.exports = Router;