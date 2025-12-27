const express = require("express");
const app = express();
const TaskRoute = require("./routes/taskRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", TaskRoute);

app.use("/health", (req, res) => {
  res.json({
    message:
      "Welcome to the Task Manager API! Send a GET request to /api/v1/tasks to view all tasks.",
  });
});

module.exports = app;
