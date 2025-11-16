const tasks = require('../Models/tasks.json').tasks;

const getAllTasksBasedOnPriority = (req,res)=>{
    let leveledTasks = tasks;
    if(req.params.level!==undefined){
        leveledTasks = tasks.filter(task=>task.priority.toLowerCase()===req.params.level.toLowerCase());
        console.log(`Total number of ${req.params.level} priority are : ${leveledTasks.length}`);
    }
    res.send(leveledTasks);
};

module.exports = {
    getAllTasksBasedOnPriority
}