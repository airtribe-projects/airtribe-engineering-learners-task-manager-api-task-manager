const express = require('express');
require('dotenv').config();
const {router} = require('./routes/tasksRoutes');

const app = express();
const port = process.env.PORT;

app.use('/tasks',router);
app.get('/',(req,res)=>{
    res.send('TEST');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;