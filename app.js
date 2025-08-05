const express = require('express');
const tasks = require('./models/tasks'); 
const app = express();
const port =3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksManagementRouter = require('./routes/tasksmanagement');
app.use(tasksManagementRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;