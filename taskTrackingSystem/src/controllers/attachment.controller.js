const Attachment = require('../models/Attachment');
const { verifyTaskAccess } = require('./task.controller');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const fs = require('fs');

const uploadAttachment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    if (!req.file) {
      return next(new BadRequestError('No file uploaded'));
    }

    await verifyTaskAccess(taskId, userId);

    const attachment = await Attachment.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
      taskId,
      uploadedById: userId
    });

    const populated = await Attachment.findById(attachment.id).populate('uploadedById', 'id name');
    const aObj = populated.toJSON();
    aObj.uploadedBy = aObj.uploadedById;
    delete aObj.uploadedById;

    res.status(201).json({
      status: 'success',
      data: {
        attachment: aObj
      }
    });
  } catch (error) {
    next(error);
  }
};

const listAttachments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    await verifyTaskAccess(taskId, userId);

    const attachments = await Attachment.find({ taskId }).populate('uploadedById', 'id name').sort({ createdAt: -1 });

    const formattedAttachments = attachments.map(a => {
      const aObj = a.toJSON();
      aObj.uploadedBy = aObj.uploadedById;
      delete aObj.uploadedById;
      return aObj;
    });

    res.status(200).json({
      status: 'success',
      results: formattedAttachments.length,
      data: {
        attachments: formattedAttachments
      }
    });
  } catch (error) {
    next(error);
  }
};

const downloadAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const attachment = await Attachment.findById(attachmentId);

    if (!attachment) {
      return next(new NotFoundError('Attachment not found'));
    }

    await verifyTaskAccess(attachment.taskId, userId);

    const filePath = attachment.path;
    if (!fs.existsSync(filePath)) {
      return next(new NotFoundError('File not found on the server filesystem'));
    }

    res.download(filePath, attachment.originalName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAttachment,
  listAttachments,
  downloadAttachment
};
