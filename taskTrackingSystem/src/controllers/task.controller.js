const Task = require('../models/Task');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');
const { notifyUser, notifyTeam } = require('../config/socket');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../utils/customErrors');

// Helper to map populated mongoose properties to both relation objects and foreign key ID strings
const mapTaskRelations = (taskDoc) => {
  if (!taskDoc) return taskDoc;
  const result = typeof taskDoc.toJSON === 'function' ? taskDoc.toJSON() : taskDoc;

  // Extract populated objects or set to null
  const creatorPopulated = result.creatorId && typeof result.creatorId === 'object';
  const assigneePopulated = result.assigneeId && typeof result.assigneeId === 'object';
  const teamPopulated = result.teamId && typeof result.teamId === 'object';

  result.creator = creatorPopulated ? result.creatorId : null;
  result.assignee = assigneePopulated ? result.assigneeId : null;
  result.team = teamPopulated ? result.teamId : null;

  // Preserve foreign key string IDs
  result.creatorId = creatorPopulated ? result.creatorId.id : (result.creatorId ? result.creatorId.toString() : null);
  result.assigneeId = assigneePopulated ? result.assigneeId.id : (result.assigneeId ? result.assigneeId.toString() : null);
  result.teamId = teamPopulated ? result.teamId.id : (result.teamId ? result.teamId.toString() : null);

  return result;
};

const verifyTaskAccess = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const isCreator = task.creatorId.toString() === userId;
  const isAssignee = task.assigneeId?.toString() === userId;

  let isTeamMember = false;
  if (task.teamId) {
    const membership = await TeamMember.findOne({ teamId: task.teamId, userId });
    if (membership) {
      isTeamMember = true;
    }
  }

  if (!isCreator && !isAssignee && !isTeamMember) {
    throw new ForbiddenError('You are not authorized to access this task');
  }

  return task;
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId, teamId } = req.body;
    const userId = req.user.id;

    if (teamId) {
      const membership = await TeamMember.findOne({ teamId, userId });
      if (!membership) {
        return next(new ForbiddenError('You cannot create a task in a team you are not a member of'));
      }

      if (assigneeId) {
        const assigneeMembership = await TeamMember.findOne({ teamId, userId: assigneeId });
        if (!assigneeMembership) {
          return next(new BadRequestError('Assignee must be a member of the specified team'));
        }
      }
    } else {
      if (assigneeId && assigneeId !== userId) {
        const assigneeExists = await User.findById(assigneeId);
        if (!assigneeExists) {
          return next(new NotFoundError('Assignee user not found'));
        }
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'OPEN',
      priority: priority || 'MEDIUM',
      dueDate: dueDate || null,
      creatorId: userId,
      assigneeId: assigneeId || null,
      teamId: teamId || null
    });

    const populated = await Task.findById(task.id)
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name');

    const result = mapTaskRelations(populated);

    if (result.assigneeId && result.assigneeId !== userId) {
      notifyUser(result.assigneeId, 'taskAssigned', {
        message: `A new task "${result.title}" has been assigned to you by ${req.user.name}.`,
        taskId: result.id
      });
    }

    if (result.teamId) {
      notifyTeam(result.teamId, 'taskCreated', {
        message: `Task "${result.title}" was created in team "${result.team.name}".`,
        task: result
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        task: result
      }
    });
  } catch (error) {
    next(error);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, priority, assigneeId, teamId, search, sortBy, sortOrder } = req.query;

    const memberships = await TeamMember.find({ userId });
    const userTeamIds = memberships.map(m => m.teamId);

    const accessQuery = {
      $or: [
        { teamId: { $in: userTeamIds } },
        {
          teamId: null,
          $or: [
            { creatorId: userId },
            { assigneeId: userId }
          ]
        }
      ]
    };

    const filterQuery = {};
    if (status) filterQuery.status = status;
    if (priority) filterQuery.priority = priority;
    if (assigneeId) filterQuery.assigneeId = assigneeId;
    if (teamId) filterQuery.teamId = teamId;

    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const finalQuery = {
      $and: [accessQuery, filterQuery]
    };

    const sort = {};
    if (sortBy) {
      const field = ['dueDate', 'createdAt', 'title', 'priority', 'status'].includes(sortBy) ? sortBy : 'createdAt';
      sort[field] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const tasks = await Task.find(finalQuery)
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name')
      .sort(sort);

    const formattedTasks = await Promise.all(tasks.map(async (task) => {
      const commentCount = await Comment.countDocuments({ taskId: task._id });
      const attachmentCount = await Attachment.countDocuments({ taskId: task._id });

      const taskObj = mapTaskRelations(task);
      taskObj._count = {
        comments: commentCount,
        attachments: attachmentCount
      };
      return taskObj;
    }));

    res.status(200).json({
      status: 'success',
      results: formattedTasks.length,
      data: {
        tasks: formattedTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTaskDetails = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    await verifyTaskAccess(taskId, userId);

    const task = await Task.findById(taskId)
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name');

    if (!task) {
      return next(new NotFoundError('Task not found'));
    }

    const comments = await Comment.find({ taskId }).populate('userId', 'id name').sort({ createdAt: 1 });
    const attachments = await Attachment.find({ taskId }).populate('uploadedById', 'id name').sort({ createdAt: -1 });

    const taskObj = mapTaskRelations(task);

    taskObj.comments = comments.map(c => {
      const cObj = c.toJSON();
      cObj.user = cObj.userId;
      delete cObj.userId;
      return cObj;
    });

    taskObj.attachments = attachments.map(a => {
      const aObj = a.toJSON();
      aObj.uploadedBy = aObj.uploadedById;
      delete aObj.uploadedById;
      return aObj;
    });

    res.status(200).json({
      status: 'success',
      data: {
        task: taskObj
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { title, description, status, priority, dueDate, assigneeId, teamId } = req.body;

    const task = await verifyTaskAccess(taskId, userId);

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const activeTeamId = teamId !== undefined ? teamId : task.teamId;

    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        updateData.assigneeId = null;
      } else {
        const userExists = await User.findById(assigneeId);
        if (!userExists) {
          return next(new NotFoundError('Assignee user not found'));
        }

        if (activeTeamId) {
          const membership = await TeamMember.findOne({ teamId: activeTeamId, userId: assigneeId });
          if (!membership) {
            return next(new BadRequestError('Assignee must be a member of the team'));
          }
        }
        updateData.assigneeId = assigneeId;
      }
    }

    if (teamId !== undefined) {
      if (teamId === null) {
        updateData.teamId = null;
      } else {
        const membership = await TeamMember.findOne({ teamId, userId });
        if (!membership) {
          return next(new ForbiddenError('You can only assign tasks to teams you belong to'));
        }
        updateData.teamId = teamId;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, returnDocument: 'after' }
    )
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name');

    const result = mapTaskRelations(updatedTask);

    if (updateData.assigneeId && updateData.assigneeId.toString() !== task.assigneeId?.toString() && updateData.assigneeId.toString() !== userId) {
      notifyUser(updateData.assigneeId.toString(), 'taskAssigned', {
        message: `Task "${result.title}" has been assigned to you.`,
        taskId: result.id
      });
    }

    if (result.teamId) {
      notifyTeam(result.teamId, 'taskUpdated', {
        message: `Task "${result.title}" was updated.`,
        task: result
      });
    } else {
      notifyUser(result.creatorId, 'taskUpdated', { message: `Task "${result.title}" was updated.`, task: result });
      if (result.assigneeId && result.assigneeId !== result.creatorId) {
        notifyUser(result.assigneeId, 'taskUpdated', { message: `Task "${result.title}" was updated.`, task: result });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        task: result
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await verifyTaskAccess(taskId, userId);

    let canDelete = task.creatorId.toString() === userId;
    if (!canDelete && task.teamId) {
      const team = await Team.findById(task.teamId);
      if (team && team.ownerId.toString() === userId) {
        canDelete = true;
      }
    }

    if (!canDelete) {
      return next(new ForbiddenError('Only the task creator or team owner can delete this task'));
    }

    await Task.deleteOne({ _id: taskId });
    await Comment.deleteMany({ taskId });
    await Attachment.deleteMany({ taskId });

    if (task.teamId) {
      notifyTeam(task.teamId.toString(), 'taskDeleted', { taskId, title: task.title });
    } else {
      notifyUser(task.creatorId.toString(), 'taskDeleted', { taskId, title: task.title });
      if (task.assigneeId && task.assigneeId.toString() !== task.creatorId.toString()) {
        notifyUser(task.assigneeId.toString(), 'taskDeleted', { taskId, title: task.title });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Task successfully deleted'
    });
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    await verifyTaskAccess(taskId, userId);

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status: 'COMPLETED' } },
      { new: true, returnDocument: 'after' }
    )
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name');

    const result = mapTaskRelations(updatedTask);

    const completionPayload = {
      message: `Task "${result.title}" has been completed by ${req.user.name}.`,
      task: result
    };

    if (result.teamId) {
      notifyTeam(result.teamId, 'taskCompleted', completionPayload);
    } else {
      notifyUser(result.creatorId, 'taskCompleted', completionPayload);
      if (result.assigneeId && result.assigneeId !== result.creatorId) {
        notifyUser(result.assigneeId, 'taskCompleted', completionPayload);
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        task: result
      }
    });
  } catch (error) {
    next(error);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user.id;

    if (!assigneeId) {
      return next(new BadRequestError('Assignee ID is required'));
    }

    const task = await verifyTaskAccess(taskId, userId);

    if (task.teamId) {
      const membership = await TeamMember.findOne({ teamId: task.teamId, userId: assigneeId });
      if (!membership) {
        return next(new BadRequestError('Assignee must be a member of the team'));
      }
    } else {
      const userExists = await User.findById(assigneeId);
      if (!userExists) {
        return next(new NotFoundError('Assignee user not found'));
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { assigneeId } },
      { new: true, returnDocument: 'after' }
    )
      .populate('creatorId', 'id name email')
      .populate('assigneeId', 'id name email')
      .populate('teamId', 'id name');

    const result = mapTaskRelations(updatedTask);

    if (assigneeId !== userId) {
      notifyUser(assigneeId, 'taskAssigned', {
        message: `Task "${result.title}" has been assigned to you by ${req.user.name}.`,
        taskId: result.id
      });
    }

    if (result.teamId) {
      notifyTeam(result.teamId, 'taskUpdated', {
        message: `Task "${result.title}" assignment was updated.`,
        task: result
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task: result
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  listTasks,
  getTaskDetails,
  updateTask,
  deleteTask,
  completeTask,
  assignTask,
  verifyTaskAccess
};
