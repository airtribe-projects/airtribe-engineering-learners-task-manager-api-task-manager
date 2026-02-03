const express = require('express');

const { allTasks, taskByTitleOrDescription, taskById, taskByPriority, updateTask, deleteTask, saveTask} = require('../controlller/task.controller');
const catchAsync = require('../middleware/catchAsync');
const { inputValidation } = require('../middleware/inputValidation');


const taskRouter = express.Router();


taskRouter.get('/', catchAsync(allTasks));

taskRouter.get('/:id', catchAsync(taskById));

taskRouter.get('/priority/:priorityLevel', catchAsync(taskByPriority));

taskRouter.get('/search/:searchTerm', catchAsync(taskByTitleOrDescription));

taskRouter.post('/', inputValidation, catchAsync(saveTask));

taskRouter.put('/:id', inputValidation, catchAsync(updateTask));

taskRouter.delete('/:id', catchAsync(deleteTask));

module.exports = taskRouter;