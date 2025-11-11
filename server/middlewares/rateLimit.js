// middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

// Forgot password: 30 req/IP/giờ
const forgotPasswordIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }
});

// Reset password: 60 req/IP/giờ
const resetPasswordIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }
});

module.exports = {
  forgotPasswordIpLimiter,
  resetPasswordIpLimiter
};
