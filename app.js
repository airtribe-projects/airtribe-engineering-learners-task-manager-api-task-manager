const express = require('express');
const taskRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tasks', taskRoutes);

module.exports = app;
