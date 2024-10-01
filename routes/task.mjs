import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();

// Recreate __dirname using `import.meta.url`
const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);  // Get the directory of the current file

router.get('/tasks', async (req, res) => {
    try {
      // Define the path to your task.json file
      const taskFilePath = path.join(__dirname, '../task.json');
  
      // Use fs.promises to read the file asynchronously
      const data = await fs.readFile(taskFilePath, 'utf8');
  
      // Parse the JSON data
      const tasks = JSON.parse(data);
  
      // Send the tasks as the response
      res.json(tasks);
    } catch (err) {
      // Handle errors (e.g., file not found or JSON parsing errors)
      console.error('Error reading tasks:', err);
      res.status(500).json({ message: 'Unable to read tasks' });
    }
  });




  router.get('/tasks/:id', async (req, res) => {
    try {
      const taskFilePath = path.join(__dirname, '../task.json');
      const data = await fs.readFile(taskFilePath, 'utf8');
      const parsedData = JSON.parse(data);
      const tasks = parsedData.tasks;
  
      const taskId = parseInt(req.params.id, 10);
      const task = tasks.find(t => t.id === taskId);
  
      if (!task) {
        return res.status(404).json({ message: `Task with id ${taskId} not found.` });
      }
  
      res.json(task);
    } catch (err) {
      console.error('Error retrieving task:', err);
      res.status(500).json({ message: 'Unable to retrieve task due to server error.' });
    }
  });
  


  router.post('/tasks', async (req, res) => {
    try {
      const taskFilePath = path.join(__dirname, '../task.json');
      const data = await fs.readFile(taskFilePath, 'utf8');
      const parsedData = JSON.parse(data);
      const tasks = parsedData.tasks;
  
      const { title, description, completed } = req.body;
  
      // Input validation
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
      }
  
      if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ message: 'Description is required and must be a non-empty string.' });
      }
  
      if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean value.' });
      }
  
      const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        completed: completed || false
      };
  
      tasks.push(newTask);
      await fs.writeFile(taskFilePath, JSON.stringify({ tasks }, null, 2));
  
      res.status(201).json(newTask);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ message: 'Unable to create task due to server error.' });
    }
  });

  

  router.put('/tasks/:id', async (req, res) => {
    try {
      const taskFilePath = path.join(__dirname, '../task.json');
      const data = await fs.readFile(taskFilePath, 'utf8');
      const parsedData = JSON.parse(data);
      const tasks = parsedData.tasks;
  
      const taskId = parseInt(req.params.id, 10);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
  
      if (taskIndex === -1) {
        return res.status(404).json({ message: `Task with id ${taskId} not found.` });
      }
  
      const { title, description, completed } = req.body;
  
      // Input validation
      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ message: 'Title must be a non-empty string if provided.' });
      }
  
      if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        return res.status(400).json({ message: 'Description must be a non-empty string if provided.' });
      }
  
      if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean value if provided.' });
      }
  
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description || tasks[taskIndex].description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
      };
  
      await fs.writeFile(taskFilePath, JSON.stringify({ tasks }, null, 2));
      res.json(tasks[taskIndex]);
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ message: 'Unable to update task due to server error.' });
    }
  });

  

  router.delete('/tasks/:id', async (req, res) => {
    try {
      const taskFilePath = path.join(__dirname, '../task.json');
      const data = await fs.readFile(taskFilePath, 'utf8');
      const parsedData = JSON.parse(data);
      const tasks = parsedData.tasks;
  
      const taskId = parseInt(req.params.id, 10);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
  
      if (taskIndex === -1) {
        return res.status(404).json({ message: `Task with id ${taskId} not found.` });
      }
  
      tasks.splice(taskIndex, 1);
      await fs.writeFile(taskFilePath, JSON.stringify({ tasks }, null, 2));
  
      res.json({ message: `Task with id ${taskId} has been deleted.` });
    } catch (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ message: 'Unable to delete task due to server error.' });
    }
  });
  
  

export default router;