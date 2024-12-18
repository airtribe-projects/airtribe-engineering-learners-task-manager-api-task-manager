require("dotenv").config();
const express = require('express');
const app = express()

const tasksRouter = require("./routes/tasks")

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON

const logger = (req, res, next) => {
   console.log(`${req.method}: Request Received On ${req.url}`);
   next();
};

app.use(logger);
console.log({ tasksRouter })
app.use(tasksRouter);

app.listen(PORT ,() => {
   console.log("SERVER IS UP AND RUNNING ON PORT NO: " + PORT);
});
>>>>>>> 7e9e6a2 (Initial commit for Task Manager API)
