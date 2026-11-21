
'use strict';

const jwt = require('jsonwebtoken');

function signToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  );
}

// Cookie configuration for local and production environments
function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function setCookie(res, token) {
  res.cookie(
    process.env.COOKIE_NAME || 'resumeiq_token',
    token,
    getCookieOptions()
  );
}

function clearCookie(res) {
  res.clearCookie(
    process.env.COOKIE_NAME || 'resumeiq_token',
    getCookieOptions()
  );
}

module.exports = {
  signToken,
  setCookie,
  clearCookie,
};
