const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const taskRoute = require("./routes/taskRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/tasks", getAllTasks);

// app.get("/tasks/:id", getATask);

// app.post("/tasks", createANewTask);

// app.put("/tasks/:id", updateATask);

// app.delete("/tasks/:id", deleteATask);

app.use("/tasks", taskRoute);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
