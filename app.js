const express = require('express');
const logger = require("./middlewares/loggerGlobal")
const errorHandler = require("./middlewares/errorHandler")
const route = require("./routers/taskRoute")

const app = express();
const port = 3000;

// Use the logger and error handling middleware for all routes
app.use(logger);
// global error handler
app.use(errorHandler);

// Import and use the task routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route 
app.use('/tasks',route)

app.get('/', (req, res) => {
    res.send("Welcome to API Manager");
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;