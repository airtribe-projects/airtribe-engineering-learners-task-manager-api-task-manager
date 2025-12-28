import express from 'express'
import taskRoutes from './routes/tasks.routes.js'
import  errorHandler  from './middlewares/error.handler.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/tasks', taskRoutes)

// Error handling middleware
app.use(errorHandler)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

export default app;