const fs = require('fs');
const path = require('path');
const data = require('../../task.json');
const dataPath = path.join(__dirname, '../../task.json');


// Helper: Load tasks
function loadTasks() {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8")).tasks;
}

// Helper: Save tasks
function saveTasks(tasks) {
    fs.writeFileSync(dataPath, JSON.stringify({ tasks }, null, 2));
}


// const getAllTasks = (req, res) => {
//     res.status(200).json(data.tasks);
// };

const getAllTasks = (req, res) => {
    let tasks = loadTasks();

    // Filter by completed status
    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === "true";
        tasks = tasks.filter((t) => t.completed === isCompleted);
    }

    if (req.query.sort) {
        tasks.sort((a, b) => {
            if (req.query.sort === "asc") {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        });
    }


    res.json(tasks);
};


const getTaskById = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
};

const createTask = (req, res) => {
    const newTask = req.body;
    const { title, description, completed } = newTask;

    if (!title || !description || completed === undefined || completed === "") {
        return res.status(400).json({ error: 'Title, description, and completed status are required.' });
    }
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed status must be a boolean.' });
    }

    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data from file.' });
        }

        let jsonData = JSON.parse(data);

        const newTaskWithId = {
            id: jsonData.tasks.length + 1,
            title,
            description,
            completed
        };

        jsonData.tasks.push(newTaskWithId);

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write data to file.' });
            }

            res.status(201).json(newTaskWithId);
        });
    });
};

const updateTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const updatedTask = req.body;
    const { title, description, completed } = updatedTask;
    if (!title || !description || completed === undefined || completed === "") {
        return res.status(400).json({ error: 'Title, description, and completed status are required.' });
    }

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed status must be a boolean.' });
    }
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data from file.' });
        }
        let jsonData = JSON.parse(data);
        const taskIndex = jsonData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        jsonData.tasks[taskIndex] = { id: taskId, title, description, completed };

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write data to file.' });
            }
            res.status(200).json(jsonData.tasks[taskIndex]);
        });
    });
};

const deleteTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data from file.' });
        }
        let jsonData = JSON.parse(data);
        const taskIndex = jsonData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        jsonData.tasks.splice(taskIndex, 1);
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write data to file.' });
            }
            res.status(200).send();
        });
    });
};




module.exports = { getAllTasks, createTask, getTaskById, updateTask, deleteTask };


