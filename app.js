require("dotenv").config();
const express = require("express");
const init = require("./startup");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Initialize database and seed data.
 * In test mode, reset the database ONCE at startup.
 */
const isTest = process.env.NODE_ENV === "test";

const ready = (async () => {
  try {
    if (isTest) {
      await init({ reset: true });
    } else {
      await init();
    }
  } catch (err) {
    console.error("App initialization failed:", err.message);
    throw err;
  }
})();

/**
 * Block all incoming requests until initialization completes
 */
app.use(async (req, res, next) => {
  try {
    await ready;
    next();
  } catch {
    res.status(500).json({ error: "App not ready" });
  }
});

app.use("/tasks", taskRoutes);

module.exports = app;
