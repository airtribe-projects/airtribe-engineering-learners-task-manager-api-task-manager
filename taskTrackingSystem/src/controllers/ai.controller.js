const Task = require('../models/Task');
const Comment = require('../models/Comment');
const { generateDescription, summarizeTaskAndComments } = require('../services/ai.service');
const { verifyTaskAccess } = require('./task.controller');
const { NotFoundError } = require('../utils/customErrors');

const generateAiDescription = async (req, res, next) => {
  try {
    const { title, briefInput } = req.body;

    const description = await generateDescription(title, briefInput);

    res.status(200).json({
      status: 'success',
      data: {
        description
      }
    });
  } catch (error) {
    next(error);
  }
};

const summarizeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    await verifyTaskAccess(taskId, userId);

    const task = await Task.findById(taskId).populate('assigneeId', 'id name');

    if (!task) {
      return next(new NotFoundError('Task details not found'));
    }

    const comments = await Comment.find({ taskId }).populate('userId', 'id name');

    const taskObj = task.toJSON();
    taskObj.assignee = taskObj.assigneeId;
    delete taskObj.assigneeId;

    taskObj.comments = comments.map(c => {
      const cObj = c.toJSON();
      cObj.user = cObj.userId;
      delete cObj.userId;
      return cObj;
    });

    const summary = await summarizeTaskAndComments(taskObj);

    res.status(200).json({
      status: 'success',
      data: {
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAiDescription,
  summarizeTask
};
