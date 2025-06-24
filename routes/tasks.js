const express = require('express');
const router = express.Router();  
const initialTasks = require('../task.json').tasks;

const tasks = [...initialTasks]

router.get('/', (req, res) => {
    const completedQueryParam = req.query.completed; 
    let tasksToReturn = tasks;
    if (completedQueryParam !== undefined) {
        const filterCompletedBoolean = completedQueryParam.toLowerCase() === 'true';
        tasksToReturn = tasks.filter(item => item.completed === filterCompletedBoolean); 
    }
    res.status(200).json(tasksToReturn);
});

router.get('/:id', (req,res) =>{
    const taskId = req.params.id
    const task = tasks.find((item) => item.id == taskId )
    if(task){
        res.status(200).json(task)
    }else {
        res.status(404).json({message:"Task Not Found"})
    }
})

router.post('/', (req,res) =>{
    const newTask = req.body
    const keys = ['title', 'description' ,'completed']

    if(!newTask || !keys.every((item) => Object.keys(newTask).includes(item))){
        res.status(400).json({
            message: 'Bad Request: Invalid Data.'
        })
    }

    const idGenerated = (tasks.length +1)
    newTask.id= idGenerated
    tasks.push(newTask)
    res.status(201).json({message:`Successfully created new task for ${newTask.title}`})
})

router.put('/:id', (req,res) =>{
    const taskId = req.params.id
    const newTask = req.body

     if(!newTask || !keys.every((item) => Object.keys(newTask).includes(item))){
        res.status(400).json({
            message: 'Bad Request: Invalid Data.'
        })
    }
    const taskIndex = tasks.findIndex((item) => item.id == taskId )
    if(taskIndex != -1){
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...newTask,
            completed: newTask.completed ? true: false,
            id: tasks[taskIndex]['id']
        }
        res.status(200).json({message:`Updated data for ${taskId}`})
    } else {
        res.status(404).json({message:"Task not found"})
    }
})

router.delete('/:id', (req,res)=>{
    const taskId = req.params.id
    const taskIndex = tasks.findIndex(item => item.id == taskId)

    if(taskIndex != -1){
        tasks.splice(taskIndex,1)
        res.send(tasks)
    }else {
        res.status(404).json({message:"Task not found"})
    }
})

module.exports = router
