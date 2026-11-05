const Comment = require('../models/Comment');
const { verifyTaskAccess } = require('./task.controller');
const { notifyUser, notifyTeam } = require('../config/socket');

const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const task = await verifyTaskAccess(taskId, userId);

    const comment = await Comment.create({
      content,
      taskId,
      userId
    });

    const populated = await Comment.findById(comment.id).populate('userId', 'id name email');
    const cObj = populated.toJSON();
    cObj.user = cObj.userId;
    delete cObj.userId;

    const notificationPayload = {
      message: `${req.user.name} commented on "${task.title}": "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
      comment: cObj,
      taskId
    };

    if (task.teamId) {
      notifyTeam(task.teamId.toString(), 'commentAdded', notificationPayload);
    } else {
      if (task.assigneeId && task.assigneeId.toString() !== userId) {
        notifyUser(task.assigneeId.toString(), 'commentAdded', notificationPayload);
      }
      if (task.creatorId.toString() !== userId) {
        notifyUser(task.creatorId.toString(), 'commentAdded', notificationPayload);
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        comment: cObj
      }
    });
  } catch (error) {
    next(error);
  }
};

const listComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    await verifyTaskAccess(taskId, userId);

    const comments = await Comment.find({ taskId }).populate('userId', 'id name email').sort({ createdAt: 1 });

    const formattedComments = comments.map(c => {
      const cObj = c.toJSON();
      cObj.user = cObj.userId;
      delete cObj.userId;
      return cObj;
    });

    res.status(200).json({
      status: 'success',
      results: formattedComments.length,
      data: {
        comments: formattedComments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  listComments
};
