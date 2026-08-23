const express = require('express');
const {
  uploadAttachment,
  listAttachments,
  downloadAttachment
} = require('../controllers/attachment.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Router for tasks/:taskId/attachments
const nestedRouter = express.Router({ mergeParams: true });
nestedRouter.use(protect);
nestedRouter.route('/')
  .post(upload.single('file'), uploadAttachment)
  .get(listAttachments);

// Global router for attachments/:attachmentId/...
const globalRouter = express.Router();
globalRouter.use(protect);
globalRouter.get('/:attachmentId/download', downloadAttachment);

module.exports = {
  nestedRouter,
  globalRouter
};
