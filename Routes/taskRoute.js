const express = require("express");
const {getAllTasks,getTaskById,createTask,updateTask,deleteTaskById} = require('../Services/taskService');
const {getAllTasksBasedOnPriority} = require('../Services/taskServiceOnPriorities');
const taskRouter = express.Router();


taskRouter.get('/',getAllTasks);
taskRouter.get('/priorities/:level',getAllTasksBasedOnPriority);
taskRouter.get('/:id',getTaskById);
taskRouter.post('/',createTask);
taskRouter.put('/:id',updateTask);
taskRouter.delete('/:id',deleteTaskById);

module.exports=taskRouter;
