
const parseId = (id) => Math.floor(Number(id));

const validateCompleted = (completed) => {
    return completed === undefined || typeof completed === 'boolean';
};

const getNextId = (tasks) => {
    return (
        tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1
    );
};

const findTaskIndexById = (tasks, id) => {
    return tasks.findIndex(task => Number(task.id) === id);
};

const findTaskById = (tasks, id) => {
    return tasks.find(task => Number(task.id) === id);
};

const helperService = {
    parseId,
    validateCompleted,
    getNextId,
    findTaskIndexById,
    findTaskById
};

module.exports = helperService;
