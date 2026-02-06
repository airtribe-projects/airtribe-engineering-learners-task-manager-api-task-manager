const express = require('express');
const app = express();
const port = 3000;
const TaskRouter = require('./routes/tasksRoute')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.use('/tasks', TaskRouter)

module.exports = app;