const express = require('express');
const app = express();
const port = 3000;
const tasksRouter = require("./api/v1/tasks/index.route")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/tasks", tasksRouter)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;