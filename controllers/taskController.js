const { tasks, getNextId } = require('../data/taskStore');
const validateTask = require('../utils/validateTask');

// GET /tasks (filter + sort)
exports.getAllTasks = (req, res) => {
  let result = [...tasks];

  if (req.query.completed !== undefined) {
    result = result.filter(
      t => t.completed === (req.query.completed === 'true')
    );
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json(result);
};

// GET /tasks/:id
exports.getTaskById = (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

// GET /tasks/priority/:level
exports.getTasksByPriority = (req, res) => {
  const filtered = tasks.filter(
    t => t.priority === req.params.level
  );
  res.json(filtered);
};

// POST /tasks
exports.createTask = (req, res) => {
  const error = validateTask(req.body);
  if (error) return res.status(400).json({ error });

  const task = {
    id: getNextId(),
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    priority: req.body.priority || 'medium',
    createdAt: new Date()
  };

  tasks.push(task);
  res.status(201).json(task);
};

// PUT /tasks/:id
exports.updateTask = (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const error = validateTask(req.body, true);
  if (error) return res.status(400).json({ error });

  Object.assign(task, req.body);
  res.json(task);
};

// DELETE /tasks/:id
exports.deleteTask = (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  res.status(204).send();
};
