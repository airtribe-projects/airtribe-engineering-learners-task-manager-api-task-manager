// importing express
const express = require('express');
const app = express(); // creating an express app
const port = 3000; 

// middleware to parse urlencoded data from forms
app.use(express.urlencoded({ extended: true }));

// middleware to parse JSON data from requests
app.use(express.json());

// importing task routes
const taskRoutes = require('./routes/tasks');

// using the task routes for any request that starts with /tasks
app.use('/tasks', taskRoutes);


// app.get('/', (req, res) => {
//     res.send('running!');
// });

// starting the server and listening on the specified port
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err); // log error if server fails
    }
    console.log(`Server running on http://localhost:${port}`); 
});


module.exports = app;
