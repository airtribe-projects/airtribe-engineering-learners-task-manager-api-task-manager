const tasks = require('../Models/tasks.json').tasks;

const getAllTasksBasedOnPriority = (req,res)=>{
    let leveledTasks = tasks;
    if(req.params.level!==undefined){
        leveledTasks = tasks.filter(task => task.priority.toLowerCase() === req.params.level.toLowerCase());
        req.log.info({ level: req.params.level, count: leveledTasks.length }, 'Priority filter results');
    }
    res.send(leveledTasks);
};

module.exports = {
    getAllTasksBasedOnPriority
}
