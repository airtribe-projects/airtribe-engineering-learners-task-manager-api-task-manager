const express = require('express');
const {
  createTeam,
  listTeams,
  getTeamDetails,
  addMember,
  removeMember
} = require('../controllers/team.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { createTeamSchema, addTeamMemberSchema } = require('../utils/schemas');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validate(createTeamSchema), createTeam)
  .get(listTeams);

router.route('/:teamId')
  .get(getTeamDetails);

router.route('/:teamId/members')
  .post(validate(addTeamMemberSchema), addMember);

router.route('/:teamId/members/:userId')
  .delete(removeMember);

module.exports = router;
