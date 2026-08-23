const express = require('express');
const { addComment, listComments } = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { addCommentSchema } = require('../utils/schemas');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(validate(addCommentSchema), addComment)
  .get(listComments);

module.exports = router;
