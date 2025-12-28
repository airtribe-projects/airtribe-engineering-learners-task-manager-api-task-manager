const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
    {
      id: 1,
      title: "Set up environment",
      description: "Install Node.js, npm, and git",
      completed: true,
      priority:'low',
      createdDate : new Date(),
    }
  ];
  
  let taskIdcount = 2;

app.post('/tasks',(req,res)=>{
    const{title, description, completed = false,priority='low',createdDate} = req.body;
    if(!title || ! description || typeof completed !=='boolean')
        return res.status(400).json({error : 'Invalid input'});
    if(!['low','medium','high'].includes(priority)){
        return res.status(400).json({error:'Invalid input'});
    }
    const newTask = {
        id: taskIdcount++,
        title,
        description,
        completed,
        priority,
        createdDate : new Date()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.get('/tasks',(req,res)=>{
    const {completed, sort} = req.query;
    let filteredTasks = tasks;
    if (completed!== undefined){
        const isCompleted = completed ==='true';
        filteredTasks = tasks.filter(task=>task.completed === isCompleted);
    }
    if(sort ==='createdDate')
    {
        filteredTasks.sort((a,b)=> new Date(a.createdDate)- new Date(b.createdDate));
    }
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const tId = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === tId);
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    res.status(200).json(task);
  });
app.get('/tasks/:priority/:level',(req,res)=>{
    const {level} = req.params;
    if(!['low','medium','high'].includes(level)){
        return res.status(400).json({error:'Invalid priority level'});
    }
    const filteredTasks = tasks.filter(task=>task.priority===level);
    res.status(200).json(filteredTasks);
})

app.put('/tasks/:id',(req,res)=>{
    const tId =parseInt(req.params.id,10);
    const{title,description,completed=false,priority} = req.body;
    const task = tasks.find(task=>task.id===tId);
    if(!task){
        return res.status(404).json({error: 'Task not found'});
    }
    if(!title || ! description || typeof completed !=='boolean')
        return res.status(400).json({error : 'Invalid input'});

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
    }
    task.title = title;
    task.description= description;
    task.completed = completed;
    if (priority) task.priority = priority;
    res.status(200).json(task);

});

app.delete('/tasks/:id',(req,res)=>{
    const tId = parseInt(req.params.id,10);
    const taskIndex = tasks.findIndex((task)=>task.id === tId);
    if(taskIndex===-1){
        return res.status(404).json({error :'Task not found'});
    }
    tasks.splice(taskIndex,1);  
    res.status(200).json({message:'Task deleted successfully'});
});

if (require.main === module) {
    app.listen(port, (err) => {
      if (err) {
        console.log('Something bad happened', err);
      } else {
        console.log(`Server is listening on ${port}`);
      }
    });
  }



module.exports = app;