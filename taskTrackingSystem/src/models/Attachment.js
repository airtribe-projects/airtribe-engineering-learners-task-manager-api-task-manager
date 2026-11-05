const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  uploadedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Attachment', attachmentSchema);
