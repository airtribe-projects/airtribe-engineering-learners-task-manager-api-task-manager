const {TaskModel} = require('../models/task.model');
const asyncHandler = require('express-async-handler');

const allTasks = asyncHandler(async (req, res) => {
    const tasks = await TaskModel.find({}).sort({createdAt: -1, updatedAt: -1});
    res.status(200).json({success: true, data: tasks});
});


const taskById = asyncHandler(async (req, res) => {

    const {id} = req.params;

    const taskById = await TaskModel.findById(id);

    if (!taskById) {
        const err = new Error(`Task with id ${id} is not present`);
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({success: true, data: taskById})
});

const taskByTitleOrDescription = asyncHandler(async (req, res) => {
    const {searchTerm} = req.params;
    const tasks = await TaskModel.find({
        $or: [
            {title: {$regex: searchTerm, $options: 'i'}},
            {description: {$regex: searchTerm, $options: 'i'}}
        ]
    });
    res.status(200).json({success: true, data: tasks});

});


const taskByPriority = asyncHandler(async (req, res) => {

    const {priorityLevel} = req.params;
    const tasks = await TaskModel.find({priority: priorityLevel})
    res.status(200).json({success: true, data: tasks})
});


const updateTask = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const {title, description, priorityLevel, taskState} = req.body;

    const isPresent = await TaskModel.findById(id);

    if (!isPresent) {
        const err = new Error(`Task with id ${id} not found`);
        err.statusCode = 404;
        throw err;
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
        id,
        {title, description, priorityLevel: priorityLevel, taskState: taskState},
        {new: true}
    );

    res.status(200).json({success: true, data: updatedTask});


});

const deleteTask = asyncHandler(async (req, res) => {
    const reqParams = req.params;
    const {id} = reqParams;

    const isPresent = await TaskModel.findById(id);

    if (!isPresent) {
        const err = new Error(`Task with id ${id} not found`);
        err.statusCode = 404;
        throw err;
    }
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({success: true, message: `Task with id ${id} has been deleted successfully`});
});

const saveTask = asyncHandler(async (req, res) => {

    const {title, description, priorityLevel} = req.body;
    const createTask = new TaskModel({title, description, priority: priorityLevel});
    await createTask.save();
    res.status(201).json({success: true, data: createTask});

});


module.exports = {allTasks, taskById, taskByPriority, saveTask, updateTask, deleteTask, taskByTitleOrDescription};