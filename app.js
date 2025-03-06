const express = require('express');
const app = express();
const port = 3000;
const taskRouter= require('./routes/tasks.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks",taskRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;