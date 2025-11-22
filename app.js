const express = require('express');
const taskManagerRouter  = require('./routes/taskManagerRouter');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Router for task manager 
app.use("/tasks" , taskManagerRouter);



app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;