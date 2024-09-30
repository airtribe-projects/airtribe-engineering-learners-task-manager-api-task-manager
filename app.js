require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const tasksRouter = require('./routes/task');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/tasks', tasksRouter);

app.listen(PORT, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${PORT}`);
});


module.exports = app;
