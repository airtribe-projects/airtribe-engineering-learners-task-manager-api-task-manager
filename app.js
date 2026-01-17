const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes);
app.use(errorHandler);

module.exports = app;
