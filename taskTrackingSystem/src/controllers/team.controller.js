const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const { NotFoundError, ForbiddenError, ConflictError, BadRequestError } = require('../utils/customErrors');

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const team = await Team.create({
      name,
      description,
      ownerId: userId
    });

    await TeamMember.create({
      teamId: team.id,
      userId: userId,
      role: 'OWNER'
    });

    res.status(201).json({
      status: 'success',
      data: {
        team: team.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

const listTeams = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const memberships = await TeamMember.find({ userId });
    const teamIds = memberships.map(m => m.teamId);

    const teams = await Team.find({ _id: { $in: teamIds } })
      .populate('ownerId', 'id name email')
      .sort({ createdAt: -1 });

    const formattedTeams = await Promise.all(teams.map(async (team) => {
      const memberCount = await TeamMember.countDocuments({ teamId: team._id });
      const Task = require('../models/Task');
      const taskCount = await Task.countDocuments({ teamId: team._id });

      const teamObj = team.toJSON();
      teamObj.owner = teamObj.ownerId;
      delete teamObj.ownerId;
      teamObj._count = {
        members: memberCount,
        tasks: taskCount
      };
      return teamObj;
    }));

    res.status(200).json({
      status: 'success',
      results: formattedTeams.length,
      data: {
        teams: formattedTeams
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const membership = await TeamMember.findOne({ teamId, userId });

    if (!membership) {
      return next(new ForbiddenError('You are not authorized to view this team'));
    }

    const team = await Team.findById(teamId).populate('ownerId', 'id name email');

    if (!team) {
      return next(new NotFoundError('Team not found'));
    }

    const members = await TeamMember.find({ teamId }).populate('userId', 'id name email');
    const Task = require('../models/Task');
    const tasks = await Task.find({ teamId }).sort({ createdAt: -1 });

    const teamObj = team.toJSON();
    teamObj.owner = teamObj.ownerId;
    delete teamObj.ownerId;

    teamObj.members = members.map(m => {
      const memberObj = m.toJSON();
      memberObj.user = memberObj.userId;
      delete memberObj.userId;
      return memberObj;
    });

    teamObj.tasks = tasks.map(t => t.toJSON());

    res.status(200).json({
      status: 'success',
      data: {
        team: teamObj
      }
    });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { email, role = 'MEMBER' } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return next(new NotFoundError('Team not found'));
    }

    if (team.ownerId.toString() !== userId) {
      return next(new ForbiddenError('Only the team owner can add new members'));
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return next(new NotFoundError('User with this email was not found'));
    }

    const existingMember = await TeamMember.findOne({ teamId, userId: userToAdd.id });

    if (existingMember) {
      return next(new ConflictError('User is already a member of this team'));
    }

    const newMember = await TeamMember.create({
      teamId,
      userId: userToAdd.id,
      role
    });

    const memberObj = newMember.toJSON();
    memberObj.userId = userToAdd.id;
    memberObj.user = {
      id: userToAdd.id,
      name: userToAdd.name,
      email: userToAdd.email
    };

    res.status(201).json({
      status: 'success',
      data: {
        member: memberObj
      }
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { teamId, userId: memberId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return next(new NotFoundError('Team not found'));
    }

    if (team.ownerId.toString() !== userId && userId !== memberId) {
      return next(new ForbiddenError('You do not have permission to remove members from this team'));
    }

    if (team.ownerId.toString() === memberId) {
      return next(new BadRequestError('Team owners cannot remove themselves'));
    }

    const existingMember = await TeamMember.findOne({ teamId, userId: memberId });

    if (!existingMember) {
      return next(new NotFoundError('Member not found in this team'));
    }

    await TeamMember.deleteOne({ teamId, userId: memberId });

    res.status(200).json({
      status: 'success',
      message: 'Member successfully removed from the team'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  listTeams,
  getTeamDetails,
  addMember,
  removeMember
};
