const express = require('express');
const logger = require('./middleware/logger');
const { tasks } = require("./data/tasks");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use("/tasks", taskRoutes);





module.exports = app;