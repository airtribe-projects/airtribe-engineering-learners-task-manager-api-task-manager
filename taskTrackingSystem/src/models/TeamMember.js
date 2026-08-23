const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['OWNER', 'ADMIN', 'MEMBER'],
    default: 'MEMBER'
  },
  joinedAt: {
    type: Date,
    default: Date.now
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

// Enforce unique user per team
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
