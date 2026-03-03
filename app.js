const express = require("express");
const app = express();
const port = 3000;

// routers and helpers
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
const preferencesRouter = require("./routes/preferences");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount routers
app.use("/tasks", tasksRouter);
app.use("/", authRouter); // register and login at root
app.use("/preferences", preferencesRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
