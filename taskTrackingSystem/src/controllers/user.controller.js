const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ConflictError, BadRequestError } = require('../utils/customErrors');

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name !== undefined) updateData.name = name;

    if (email !== undefined) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.id !== userId) {
        return next(new ConflictError('Email is already in use by another user'));
      }
      updateData.email = email;
    }

    if (password !== undefined && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return next(new BadRequestError('No valid profile update parameters provided'));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
