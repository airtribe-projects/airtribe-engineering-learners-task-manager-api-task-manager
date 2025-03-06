const taskList = require('../task.json');

const addTask = (req,res)=>{
    const task = req.body;
    task.id = taskList.tasks.length + 1;
    taskList.tasks.push(task);
    res.status(201).send({message: "Task added successfully"});
}  ;

const getAllTasks = (req,res)=>{
    const status = req.query?.completed ;
    const booleanStatus = status === "true"? true: false;
    if (status) {
        const tasks = taskList.tasks.filter(task => task.completed === booleanStatus);
        tasks.map(task => Number(task.id));
        return res.send(tasks.tasks);
    }
    else{
    taskList.tasks.map(task => Number(task.id));
     res.send(taskList.tasks);
    }
}

const getTask = (req,res)=>{
    const taskId = req.params.id;
    const task = taskList.tasks.find(task => task.id === Number(taskId));
    res.status(200).send(task);
}

const updateTask = (req,res)=>{
    const taskId = req.params.id;
    const task = taskList.tasks.find(task => task.id === Number(taskId));
    task.title = req.body.title? req.body.title: task.title;
    task.description = req.body.description? req.body.description: task.description;
    task.status = req.body.status? req.body.status: task.status;    
    res.send(task);
}

const deleteTask = (req,res)=>{
    const taskId = req.params.id;
    taskList.tasks = taskList.tasks.filter(task => task.id !== Number(taskId));
    res.status(200).send({message: "Task deleted successfully"});
}



module.exports ={
    addTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
}