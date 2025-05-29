<<<<<<< HEAD
const express=require('express');

const app=express();

app.use(express.json());


const Tasks=[
    
{
    "id": 1,
    "title": "Create a new project",
    "description": "Create a new project using Magic",
    "completed": false,
    "priority": "medium",
    "created_at": new Date("2025-05-01T10:00:00Z")
  },
  {
    "id": 2,
    "title": "Create a new project",
    "description": "Create a new project using Magic",
    "completed": false,
    "priority": "medium",
    "created_at": new Date("2025-05-02T14:30:00Z")
  }

]

const VALID_PRIORITIES = ["low", "medium", "high"];

function validateTask(req, res, next){

   
        const id=parseInt(req.params.id)
        const task=Tasks.find(task=>task.id===id)
        if(!task){
            return res.status(404).send("Non existent task")
        }
        req.task=task;    
        next();
    
}   

function validateBody(req,res,next){

        const {title, description, completed, priority}=req.body;
        const errors=[];

        if(typeof title !='string' || !title.trim()){
            errors.push("Title must be a non-empty string")
        }
        if(typeof description !='string' || !description.trim()){
            errors.push("Description must be a non-empty string")
        }
        if(typeof completed !='boolean'){
            errors.push("completed must be a boolean")
        }
        if (!VALID_PRIORITIES.includes(priority)) {
            errors.push(`priority must be one of ${VALID_PRIORITIES.join(", ")}`);
          }
       
        if(errors.length)
            return res.status(400).json({errors})
        
        req.body.title       = title.trim();
        req.body.description = description.trim();
        req.body.priority    = priority;
        next();

}
function validatePriorityParam(req, res, next) {
    const { level } = req.params;
    if (!VALID_PRIORITIES.includes(level)) {
      return res
        .status(400)
        .json({ error: `Priority must be one of ${VALID_PRIORITIES.join(", ")}` });
    }
    next();
  }
   

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.get('/tasks',(req,res)=>{

    let results=[...Tasks];
    if(req.query.completed !==undefined){
        const comp=req.query.completed==='true';
        results=results.filter(task=>task.completed===comp);
    }
    if(req.query.sort==='created_at')
        results.sort((a, b) => (a.created_at - b.created_at))
    res.send(results);

})

app.get('/tasks/:id',(req,res)=>{
    const id=parseInt(req.params.id);
    const task=Tasks.find((task=>task.id===id))
    res.send(task);
    
})

app.post('/tasks',validateBody,(req,res)=>{
    const task=req.body;
    task.id=Tasks.length+1;
    task.created_at=new Date()
    Tasks.push(task)
    res.send(Tasks)
    
})

app.put('/tasks/:id', validateTask,validateBody,(req,res)=>{
    const id =req.params.id;
    const task=Tasks.find((task)=>task.id===parseInt(id))
    task.title=req.body.title
    task.description=req.body.description
    task.completed=req.body.completed
    task.priority=req.body.priority
    task.created_at=new Date()
    res.send(Tasks)
})

app.delete('/tasks/:id',validateTask,(req,res)=>{
    const id=req.params.id;
    const task=Tasks.find((task)=>task.id===parseInt(id));
    const index=Tasks.indexOf(task);
    Tasks.splice(index,1);
    res.send(Tasks)

})

app.get('/tasks/priority/:level', validatePriorityParam,(req, res) => {
    const level = req.params.level;
    const filtered = Tasks.filter(task => task.priority === level);
    res.send(filtered);
  });

app.listen(3000,()=>{
    console.log("App is up and Running on Port 3000");
})
=======
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;
>>>>>>> 087f87495949056550245aee8c33bad1f4711199
