const fs = require("fs")
const path = require("path")

// path for json file
const TASK_FILE = path.join(__dirname,"../task.json")

// Read Task from task.json
const getTaskFromFile = ()=>{
    let data = fs.readFileSync(TASK_FILE,'utf-8')
    return JSON.parse(data).tasks;
}
// write Task to task.json
const saveTasksToFile = (tasks) => {
    fs.writeFileSync(TASK_FILE, JSON.stringify({ tasks }, null, 2));
};


// getTask
const getTask = (req,res)=>{
    const tasks = getTaskFromFile();
    return res.status(200).json(tasks)
}

// getTask by id
const getTaskById = (req,res)=>{
    const tasks = getTaskFromFile();
    const task = tasks.find(t=> t.id===parseInt(req.params.id));

    if(!task){
        return res.status(404).json("Task not Found for this ID")
    }
    res.status(200).json(task)
}

const createTask = (req,res)=>{

    const {title,description,completed} = req.body
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json("Please provide valid data");
    }

    let tasks = getTaskFromFile();
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        completed
    }
    tasks.push(newTask);
    saveTasksToFile(tasks);
    res.status(201).json(newTask)
}

const updateTask = (req,res)=>{
    let tasks = getTaskFromFile();
    const index = tasks.findIndex(t=>t.id===parseInt(req.params.id))

    if(index===-1){
        return res.status(404).json({
            message:"Task not Found"
        })
    }
    const { title, description, completed } = req.body;

    if(!title ||!description || typeof completed !== 'boolean'){
        return res.status(400).json({
            message:"Please provide valid data"
        })
    }
    tasks[index] = {id:tasks[index].id,title,description,completed};
    saveTasksToFile(tasks);
    res.status(200).json(tasks[index]);
}

const deleteTask = (req,res)=>{
    let tasks = getTaskFromFile();
    const task = tasks.some(t=>t.id===parseInt(req.params.id))
    if(!task){
        return res.status(404).json("Task not found")
    }
    tasks = tasks.filter(t=>t.id !== parseInt(req.params.id))
    saveTasksToFile(tasks);
    res.status(200).json({ message: "Task deleted successfully" })
}

module.exports = {getTask,getTaskById,createTask,updateTask,deleteTask};