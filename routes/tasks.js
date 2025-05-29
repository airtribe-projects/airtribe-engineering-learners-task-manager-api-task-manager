const express = require('express');
const tasks = require('../models/taskModal')


const router = express.Router();

// Implement GET /tasks: Retrieve all tasks.

router.get('/tasks/:level?', (req, res) => {

    const {completed , sort} = req.query

    const {level} = req.params

    if(level) res.send(tasks.filter((obj)=>obj.priority == level))
    
    if(completed) res.send(tasks.filter((obj)=>obj.completed))

    if(sort) res.send(tasks.sort((a,b)=> a.cd - b.cd))

    res.send(tasks)
})



// Implement GET /tasks/:id: Retrieve a specific task by its ID.

router.get('/tasks/:id', (req, res) => {
    const { id } = req.params

    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) {
        return res.status(404).send({ message: 'Task not found' });
    }

    res.send(tasks.filter((obj) => obj.id == id))
})

// Implement POST /tasks: Create a new task with the required fields (title, description, completed).

router.post('/tasks', (req, res) => {

    const {title, description , completed, priority} = req.body

    if(!title || !description) res.status(400).send({message: 'Invalid Request Parameter!.'})

    tasks.push({
        ...req.body,
        id: tasks.length + 1,
        cd: new Date(),
        completed
    })
    res.status(201).send(req.body)
})

// Implement PUT /tasks/:id: Update an existing task by its ID.

router.put('/tasks/:id', (req, res) => {
    const { id } = req.params
   const updatedObj = req.body;

   const index = tasks.findIndex(task => task.id == id);
   
   if (index === -1) {
       return res.status(404).send({ message: 'Task not found' });
   }

   const {title, description , completed} = req.body

   if(!title || !description) res.status(400).send({message: 'Invalid Request Parameter!.'})

   let finalObj={};
   tasks.forEach((obj,idx)=>{
    if(obj.id == id){
        finalObj= {
            id:id,
            ...updatedObj
        }
        tasks[idx] = {...finalObj}
    }
   })

res.send(finalObj)
})

// Implement DELETE /tasks/:id: Delete a task by its ID.

router.delete('/tasks/:id', (req, res) => {

    const { id } = req.params
    // Find the index
    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) {
        return res.status(404).send({ message: 'Task not found' });
    }
    // Remove the task in-place
    tasks.splice(index, 1);

    res.send(tasks)
})

module.exports = router;