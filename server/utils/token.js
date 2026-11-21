'use strict';

const jwt = require('jsonwebtoken');

function signToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

function setCookie(res, token) {
  res.cookie(process.env.COOKIE_NAME || 'resumeiq_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearCookie(res) {
  res.clearCookie(process.env.COOKIE_NAME || 'resumeiq_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
}

module.exports = { signToken, setCookie, clearCookie };
