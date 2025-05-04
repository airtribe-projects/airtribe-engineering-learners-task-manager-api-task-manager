require("dotenv").config();

const express = require("express");
const app = express();
const tasksRouterV1 = require("./routes/v1/tasks");
const tasksRouterV2 = require("./routes/v2/tasks");

app.use(express.json());

app.use("/api/v1/tasks", tasksRouterV1);
app.use("/api/v2/tasks", tasksRouterV2);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
