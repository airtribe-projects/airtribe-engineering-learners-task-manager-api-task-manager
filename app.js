const express = require('express');
const app = express();
const taskRouter = require('./Routes/taskRoute');
const requestLogger = require('./Middleware/requestLogger');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use request logger middleware for all routes
app.use(requestLogger);

app.get("/",(req,res)=>{
    res.send("Alive");
})

// Mount router at both API path and root /tasks for tests
app.use("/tasks", taskRouter); //used for test
app.use("/api/v1/tasks", taskRouter); //exposed to clients


if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, (err) => {
        if (err) {
            logger.error({ err }, 'Something bad happened while starting the server');
            return;
        }
        logger.info({ port }, 'Server is listening');
    });
}

module.exports = app;