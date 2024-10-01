import express, { json, urlencoded } from 'express';
import taskRouter from './routes/task.mjs'

const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api' , taskRouter)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



export default app;