const express = require('express');
const tasksRoutes = require('./routes/tasks.js')
const userRoutes = require('./routes/users.js')
const authRoutes = require('./routes/auth.js')
const newsRoutes = require('./routes/news.js')



const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', tasksRoutes)
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', newsRoutes)




app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;