const express = require("express");
const app = express();
const port = 9000;

// middlewares
const errorHandlerMiddleware = require("./middlewares/error-handler");

// routes
const taskRoutes = require("./routes/task-route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using routes
app.use("/api/v1/tasks", taskRoutes);

// error handler middleware
app.use(errorHandlerMiddleware);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
