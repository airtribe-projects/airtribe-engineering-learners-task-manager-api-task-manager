require("dotenv").config();
const express = require('express');
const app = express();

const taskRouter = require("./routes/tasks");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT||3000;
const logger = (req, res, next) => {
    console.log(`${req.method}: Request recieved on ${req.url}`);
    next();
}

app.use(logger);
app.use(taskRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;