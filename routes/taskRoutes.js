const express = require('express');
const router = express.Router();
const tasks = require('../models/taskSchema');

router.get('/', (req, res) => {
  res.status(200).send(tasks);
});

router.get('/:id', (req, res) => {

  const taskId = parseInt(req.params?.id, 10);
  const task = tasks.find(task => task  ?.id === taskId);
  if(!task){
    res.status(404).send("Not found")
  }
  res.status(200).send(task)
})

router.post('/',(req ,res)=>{
  const body = req.body
  if(body.title && body.description  && typeof body.completed === 'boolean'){
      const payLoad = {
    id: body?.id ?? tasks.length +1 ,
    title: body?.title,
    description: body?.description,
    completed: body?.completed,
  }   
  tasks.push(payLoad)
  res.status(201).send(payLoad)
}
    else{
      res.status(400).send("Bad request")     
  }


})
router.put('/:id',(req ,res)=>{
  const body = req.body
const taskId = parseInt(req.params?.id, 10);
  const task = tasks.find(task => task?.id === taskId);
  if(!task){
    res.status(404).send("Not found")
  }
   if(body.completed && typeof body.completed !== 'boolean'){
  res.status(400).send("Bad request")
  }
  const payLoad = {
    id: task?.id ,
    title: body.title ?? task.title,
    description: body.description ?? task.description,
    completed: body.completed ?? task.completed,
  }
  const index = tasks.findIndex(t => t?.id === taskId);
  tasks[index] = payLoad
  res.status(200).send(payLoad)
})

router.delete('/:id',(req ,res)=>{
  const taskId = parseInt(req.params?.id, 10);
  const task = tasks.find(task => task?.id === taskId);
  if(!task){
    res.status(404).send("Not found")
  }
  const index = tasks.findIndex(i => i?.id === taskId);
  tasks.splice(index,1)
  res.status(200).send("Deleted successfully")
})
module.exports = router;