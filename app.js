const express = require('express');
const app = express();
const logger = require('./middlewares/logger');
const tasksRoutes = require('./routes/tasksRoutes');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use('/tasks', tasksRoutes);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;

