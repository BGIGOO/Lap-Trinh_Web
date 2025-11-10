const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authResetController = require('../controllers/authResetController');

const { forgotPasswordIpLimiter, resetPasswordIpLimiter } = require('../middlewares/rateLimit');
const { forgotEmailThrottle } = require('../middlewares/emailThrottle');

// ... các route khác
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

// Forgot: IP limit + email throttle
router.post(
  '/forgot-password',
  forgotPasswordIpLimiter,
  forgotEmailThrottle,
  authResetController.validations.forgot,
  authResetController.forgotPassword
);

// Reset: IP limit
router.post(
  '/reset-password',
  resetPasswordIpLimiter,
  authResetController.validations.reset,
  authResetController.resetPassword
);

module.exports = router;
