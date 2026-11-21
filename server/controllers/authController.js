'use strict';

const User = require('../models/User');
const { signToken, setCookie, clearCookie } = require('../utils/token');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      return next(err);
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    setCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Use same message to avoid user enumeration
      const err = new Error('Invalid email or password.');
      err.status = 401;
      return next(err);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      return next(err);
    }

    const token = signToken(user._id);
    setCookie(res, token);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  try {
    clearCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getMe };
