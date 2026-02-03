const express = require('express');
const {connection} = require('./db/db');
const errorHandling = require('./middleware/errorHandling');
const taskRouter = require('./routes/task.routes');


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', taskRouter);

app.use(errorHandling);



app.get("/", (req, res) => {
    res.send("Welcome to Task Manager API");
});


app.get("/health", (req, res) => {
    res.send("The app is healthy");
});
app.listen(process.env.PORT || 3000, async () => {
    try {
        await connection;
        console.log("DB is connected to server");
    } catch (err) {
        console.log("error in db connection", err.message);
    }
    console.log("server is running at 3030");
});


module.exports = app;