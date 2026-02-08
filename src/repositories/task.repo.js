
let tasks =[
    {
       id: 1,
       title: "Create a new project",
       description: "Create a new project using Magic",
       completed: false

    },
    // {
    //     id:2,
    //     title:"Create a new project",
    //     description:"Create a new project using the Express application generator",
    //     completed:true
    // },
    // {
    //     id:3,
    //     title:"Install nodemon",
    //     description:"Install nodemon as a development dependency",
    //     completed:true
    // }
];
let currentId = tasks.length + 1;

const getAllTasks = async() => {
    console.log("Getting all tasks", tasks);
    return tasks;
}
const getTask = async (id) => {
    return tasks.find((task) => task.id === id);
}
const createTask = async(task) => {
    const exists = tasks.find(t => t.title === task.title);
    if (exists) {
         throw new Error("Task already exists");
    }
    const newTask = { id: currentId++, ...task };
    tasks.push(newTask);
    return newTask;    
}
const updateTask = async(id, task) => {

    id = Number(id);
    console.log("Updating task with ID:", id, "with data:", task.id);
    const index = tasks.findIndex((task) => task.id === id);
    if (index == -1) {
    throw new Error("Task not found");
    }
    tasks[index] = {...tasks[index], ...task};
        return tasks[index];

    
};

const deleteTask = async(id) => {
    id = Number(id);
    const index = tasks.findIndex((task) => task.id === id);
    if(index === -1){
       throw new Error("Task not found");
    }
    tasks.splice(index, 1);
    return true;
}
module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
}   