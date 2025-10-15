const express = require('express');
const tasks = require('./task.json').tasks;
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks',(req,res)=>{

    const { completed } = req.query;

    if (typeof completed !== 'undefined') {
        const filteredTasks = tasks.filter(t => t.completed === (completed.toLowerCase() === 'true'));
        if (filteredTasks.length > 0) {
            return res.status(200).send(filteredTasks);
        } else {
            return res.status(404).send('No tasks match the completed status.');
        }
    }

    res.status(200).send(tasks);
})

app.get('/tasks/:id',(req,res)=>{
    const id  = parseInt(req.params.id)
    const task = tasks.find(t => t.id === id)
    if(!task){
        return res.status(404).send('Task with given ID does not exist.')
    }
    return res.send(task)
})

app.post('/tasks',(req,res) => {
    let task = req.body
    if ((typeof task.description === 'string') 
        && (typeof task.title === 'string')
        && (typeof task.completed === 'boolean'))
    {
            const id = tasks.length + 1 
            task.id = id
            tasks.push(task)
            return res.status(201).send(task)
    }
    else
    {
            return res.status(400).send('Invalid data format.')
    }
    
})

app.put('/tasks/:id',(req,res) => {
    const id = parseInt(req.params.id)
    const newTask = req.body
    let task = tasks.find(t => t.id === id)
    if (!task){
        return res.status(404).send('Task with given ID does not exist.')
    }
    else if((typeof newTask.description !== 'string') 
        || (typeof newTask.title !== 'string')
        || (typeof newTask.completed !== 'boolean'))
    {
        return res.status(400).send('Invalid data format.')
    } 
    else
    { 
        const index = tasks.findIndex(t => t.id === id)
        newTask.id = id 
        tasks[index] = newTask
        return res.status(200).send()
    }
    
})

app.delete("/tasks/:id",(req,res) => {
    const id = parseInt(req.params.id)
    const index = tasks.findIndex(t => t.id === id)
    if(index != -1){
        tasks.splice(index,1)
        return res.status(200).send()
    }
    else{
        return res.status(404).send('Task with given ID does not exist.')
    }
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;