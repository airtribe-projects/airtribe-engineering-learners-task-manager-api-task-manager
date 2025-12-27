const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ error: "Invalid JSON" });
  }
  next();
});

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const routes = require("./routes/taskRoutes");
app.use("/", routes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server listening on 3000");
});

module.exports = app;
