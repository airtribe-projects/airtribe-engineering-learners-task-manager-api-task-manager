const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ConflictError, UnauthorizedError } = require('../utils/customErrors');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ConflictError('Email is already registered'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
