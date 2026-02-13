const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const taskRoutes = require('./src/controller/taskController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'));




app.get('/tasks', taskRoutes.getAllTasks);
app.get('/tasks/:id', taskRoutes.getTaskById);
app.post('/tasks', taskRoutes.createTask);
app.put('/tasks/:id', taskRoutes.updateTask);
app.delete('/tasks/:id', taskRoutes.deleteTask);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;