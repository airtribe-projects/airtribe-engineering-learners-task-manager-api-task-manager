const express = require('express');
const app = express();
// const port = 3000;

app.use(express.json());
const taskRoute = require("./src/routes/task.routes");
app.use("/tasks",taskRoute)

// app.use(express.urlencoded({ extended: true }));

// app.listen(port, (err) => {
//     if (err) {
//         return console.log('Something bad happened', err);
//     }
//     console.log(`Server is listening on ${port}`);
// });



module.exports = app;