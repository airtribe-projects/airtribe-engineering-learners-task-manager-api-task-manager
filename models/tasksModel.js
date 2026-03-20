const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/task.json");

// read tasks
const getTasks = () => {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return data.tasks
}

// save tasks
const saveTasks = (tasks) =>{
    fs.writeFileSync(
        filePath,
        JSON.stringify({tasks:tasks},null,2)
    );
};

module.exports = {
    getTasks,
    saveTasks
}