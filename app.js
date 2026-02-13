
const express = require('express');


const app = express();
let tasks = [
    { id: 1, title: "Finish GET /tasks", description: "Write all the boilerplate code for the first endpoint.", completed: true },
    { id: 2, title: "Implement POST", description: "Implement the route to create a new task.", completed: false },
    { id: 3, title: "Go Roaming", description: "Leave the apartment and waste time with friend.", completed: false }
];
const PORT = 3000;

app.use(express.json());

app.get('/tasks', (req, res) => { //using this method to get the complete list of tasks. using GET method for it. first argument is the route name which is /tasks. then there is callback function passed as an argument which tells the get method what to do when tasks route is passed in URL.
    res.json(tasks); //this is the task that GET method does when route is /tasks. this line signifies that response of this method will tasks in form of JSON. Now what i need to understand it what are req and res like why is the syntax like this
});

app.get('/tasks/:id', (req, res) => {

    const taskId = parseInt(req.params.id);

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
});

app.post('/tasks', (req, res) => {

    const { title, description, completed } = req.body;

    if (!title || typeof completed !== 'boolean') { //this line of code signifies where the task has title and completed attribute available. !title means NOT(title) and typeof is keyword used to check the data type of a variable.
        return res.status(400).json({ //if the above conditions are true then the block returns status code as 400 along with message to correct the request.
            message: 'Invalid request: Title is required and "completed" must be a boolean.'
        });
    }

    const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;

    const newTask = {
        id: newId,
        title: title,
        description: description || "",
        completed: completed
    };


    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTaskData = req.body;


    const taskIndex = tasks.findIndex(t => t.id === taskId);


    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task ID not found for update.' });
    }


    if (updatedTaskData.title && typeof updatedTaskData.title !== 'string') {
        return res.status(400).json({ message: 'Invalid title format.' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updatedTaskData,
        id: taskId
    };

    res.status(200).json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task ID not found for deletion.' });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
});

// app.get('/tasks/:id', (req, res) => { //the main function of this method is to fetch the specific task based on ID passed in the URL by the user. app as suggested by gemini is like a robot and get is the like asking the question from him and getting answer or response from him. first argument it /tasks:id which is like the exact instruction i am giving to the robot upon which it goes to the second argument which is a function but i dont know why does it not have a name and why do we need a request in get function when I have provided the Id in the URL cant we just extract that ID and search the array to find whether task for that ID is presen or not?
//     const taskId = parseInt(req.params.id); //we are extracting the task Id from the request here again same question why do we need a request when the Id passed is in the URL? ParseInt is a simple typecastig function which takes the Id as a string from the req and converts it to an int because the Id in tasks array is an Int as well. then we have params which i dont know the use of cant we just directly access req.id to fetch it?
//     const task = tasks.find(t => t.id === taskId); //i have seen this function for the first time but from the looks and reading of it looks like a search function for an array where t is a element of an array like i as iterator in a for loop. where for each t we are checking if the id attribute is matching for the input taskId form the request. task variable contains that matched task containig taskId.
//     if (!task) {
//         return res.status(404).json({ message: 'Task not found' }); // looks like a simple validation to me to check whether task variable contains any value if not it indicates that Id passed in the URL is invalid.
//     }
//     res.json(task); //outputs the found task as json.
// })

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});