const express = require('express');
const app = express();
const port = 3000;

const tasksRoute = require('./routes/tasks')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try{
    app.use('/tasks', tasksRoute)
}
catch(e){
    throw new Error("Module Tasks Route not found")
}

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;