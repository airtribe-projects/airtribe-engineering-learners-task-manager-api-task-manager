const taskService = require('../service/task');
const helperService = require('../service/helper');
const logger = require('../utils/logger');

const taskController = {
    createTask: async (req, res) => {
        try {
            const { title, description, completed = false } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    error: 'Title and description are required'
                });
            }

            if (!helperService.validateCompleted(completed)) {
                return res.status(400).json({
                    error: 'Completed must be a boolean'
                });
            }

            logger.info('Creating new task');

            const tasks = await taskService.readTasks();

            const newTask = {
                id: helperService.getNextId(tasks),
                title,
                description,
                completed
            };

            tasks.push(newTask);
            await taskService.writeTasks(tasks);

            logger.info('Task created successfully', newTask?.id);

            return res.status(201).json(newTask);
        } catch (err) {
            logger.error('Error creating task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllTasks: async (_req, res) => {
        try {
            logger.info('Fetching all tasks');
            const tasks = await taskService.readTasks();
            return res.status(200).json(tasks);
        } catch (err) {
            logger.error('Error reading tasks', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getTaskById: async (req, res) => {
        try {
            const id = helperService.parseId(req.params.id);
            const tasks = await taskService.readTasks();

            logger.info('Fetching task by id', id);

            const task = helperService.findTaskById(tasks, id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(200).json(task);
        } catch (err) {
            logger.error('Error reading task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const id = helperService.parseId(req.params.id);
            const { title, description, completed } = req.body;

            if (!helperService.validateCompleted(completed)) {
                return res.status(400).json({
                    error: 'Completed must be a boolean'
                });
            }

            const tasks = await taskService.readTasks();
            const index = helperService.findTaskIndexById(tasks, id);

            if (index === -1) {
                return res.status(404).json({ error: 'Task not found' });
            }

            tasks[index] = {
                ...tasks[index],
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(completed !== undefined && { completed })
            };

            await taskService.writeTasks(tasks);
            return res.status(200).json(tasks[index]);
        } catch (err) {
            logger.error('Error updating task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const id = helperService.parseId(req.params.id);
            const tasks = await taskService.readTasks();

            const index = helperService.findTaskIndexById(tasks, id);
            if (index === -1) {
                return res.status(404).json({ error: 'Task not found' });
            }

            tasks.splice(index, 1);
            await taskService.writeTasks(tasks);

            return res.status(200).json({
                message: 'Task deleted successfully'
            });
        } catch (err) {
            logger.error('Error deleting task', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = taskController;
