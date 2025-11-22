const express = require('express');
require("dotenv").config();
const taskRoutes = require("./routes/task.route");

const app = express();

const port = process.env.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Task API is running");
});

app.listen(port, (err) => {
    if (err) return console.log('Something bad happened', err);
    console.log(`Server is listening on ${port}`);
});

module.exports = app;