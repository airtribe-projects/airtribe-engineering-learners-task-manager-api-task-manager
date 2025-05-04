const express = require('express');
const app = express();
const port = 3000;

const tasksRoute = require('./routes/tasks')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', tasksRoute)

app.get('/server/health', (req, res) => {
    return res.send("server happy and running ...");
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;
