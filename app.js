// const express = require("express");
// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // app.use("/api/createTasks", require("./routes/tasks"));
// app.listen(port, (err) => {
//   if (err) {
//     return console.log("Something bad happened", err);
//   }
//   console.log(`Server is listening on ${port}`);
// });

// module.exports = app;

const express = require("express");
const app = express();
const port = 3300;

app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log("Server is running on 3300");
});

module.exports = app;
