const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const port = 4500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the task routes
app.use('/api/tasks', taskRoutes);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;