const express = require('express');
const { json, urlencoded } = require('body-parser');
const app = express();
const port = 3000;


app.use([json(), urlencoded({ extended: true })]);


const taskRoutes = require('./routes/routes');
app.use('/tasks', taskRoutes);

// Start the server
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
