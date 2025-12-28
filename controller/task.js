const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.join(__dirname, '..', 'task.json');

async function readTasks() {
    try {
        const data = await fs.readFile(tasksFilePath, 'utf8');
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(t => {
            const idNum = Number(t.id);
            return { ...t, id: Number.isFinite(idNum) ? Math.floor(idNum) : 0 };
        });
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function writeTasks(tasks) {
    const normalized = tasks.map(t => ({ ...t, id: Number.isFinite(Number(t.id)) ? Math.floor(Number(t.id)) : t.id }));
    await fs.writeFile(tasksFilePath, JSON.stringify(normalized, null, 2));
}

const taskController = {
    createTask: async (req, res) => {
        try {
            const { title, description, completed } = req.body;
            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }
            if (completed !== undefined && typeof completed !== 'boolean') {
                return res.status(400).json({ error: 'Completed must be a boolean' });
            }

            const tasks = await readTasks();
            const maxId = tasks.reduce((m, t) => {
                const n = Number(t.id);
                return Math.max(m, Number.isFinite(n) ? Math.floor(n) : 0);
            }, 0);
            const newId = maxId + 1;
            const newTask = {
                id: newId,
                title,
                description,
                completed: completed === undefined ? false : completed
            };
            tasks.push(newTask);
            await writeTasks(tasks);
            return res.status(201).json(newTask);
        } catch (err) {
            console.error('Error writing to tasks file', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllTasks: async (req, res) => {
        try {
            const tasks = await readTasks();
            return res.status(200).json(tasks);
        } catch (err) {
            console.error('Error reading tasks file', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getTaskById: async (req, res) => {
        try {
            const id = Math.floor(Number(req.params.id));
            const tasks = await readTasks();
            const task = tasks.find(t => Number(t.id) === id);
            if (!task) return res.status(404).json({ error: 'Task not found' });
            return res.status(200).json({ ...task, id: Number(task.id) });
        } catch (err) {
            console.error('Error reading tasks file', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const id = Math.floor(Number(req.params.id));
            const { title, description, completed } = req.body;

            if (completed !== undefined && typeof completed !== 'boolean') {
                return res.status(400).json({ error: 'Completed must be a boolean' });
            }

            const tasks = await readTasks();
            const idx = tasks.findIndex(t => Number(t.id) === id);
            if (idx === -1) return res.status(404).json({ error: 'Task not found' });

            tasks[idx] = {
                ...tasks[idx],
                title: title !== undefined ? title : tasks[idx].title,
                description: description !== undefined ? description : tasks[idx].description,
                completed: completed !== undefined ? completed : tasks[idx].completed,
                id: tasks[idx].id // keep numeric id
            };
            await writeTasks(tasks);
            return res.status(200).json({ ...tasks[idx], id: Number(tasks[idx].id) });
        } catch (err) {
            console.error('Error updating task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const id = Math.floor(Number(req.params.id));
            const tasks = await readTasks();
            const idx = tasks.findIndex(t => Number(t.id) === id);
            if (idx === -1) return res.status(404).json({ error: 'Task not found' });
            tasks.splice(idx, 1);
            await writeTasks(tasks);
            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (err) {
            console.error('Error deleting task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = taskController;