const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.join(__dirname, '..', 'task.json');

const taskService = {
    readTasks: async() => {
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
    },
    writeTasks: async(tasks) => {
        const normalized = tasks.map(t => ({ ...t, id: Number.isFinite(Number(t.id)) ? Math.floor(Number(t.id)) : t.id }));
        await fs.writeFile(tasksFilePath, JSON.stringify(normalized, null, 2));
    }
}

module.exports = taskService;
