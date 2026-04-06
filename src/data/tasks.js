const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../../task.json");

const data = JSON.parse(fs.readFileSync(dataPath, "UTF-8"));

let tasks = data.tasks;

module.exports = { tasks };