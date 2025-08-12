const express = require('express');
require('dotenv').config();
const UserRouter = require('./routes/user.route')
const EventRouter = require('./routes/event.route')

const app = express();
const port = process.env.port ?? 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", UserRouter)
app.use('/api/v1/events', EventRouter);


app.listen(port,() => {
    console.log(`Server is listening on ${port}`)
})
