// controllers/authResetController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const userModel = require('../models/userModel');
const authModel = require('../models/authModel');
const PasswordReset = require('../models/passwordResetModel');
const mailer = require('../utils/mailer');

const PASSWORD_RESET_TTL_MINUTES = 15;
const sha256Hex = (x) => crypto.createHash('sha256').update(x).digest('hex');
const addMinutes = (m) => { const d = new Date(); d.setMinutes(d.getMinutes() + m); return d; };

const validations = {
  forgot: [ body('email').isEmail().withMessage('Email không hợp lệ') ],
  reset: [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('token').isString().isLength({ min: 10 }).withMessage('Token không hợp lệ'),
    body('new_password').isString().isLength({ min: 8 }).withMessage('Mật khẩu tối thiểu 8 ký tự'),
  ],
};

async function createResetIfUserExists(email, requesterIp, clientResetBaseUrl) {
  const user = await userModel.findByEmail(email);
  if (!user) return;

  await PasswordReset.invalidateAllForUser(user.id);

  const tokenRaw  = crypto.randomBytes(32).toString('hex'); // 64 hex
  const tokenHash = sha256Hex(tokenRaw);
  const expiresAt = addMinutes(PASSWORD_RESET_TTL_MINUTES);

  await PasswordReset.insert({
    user_id: user.id,
    reset_token_hash: tokenHash,
    expires_at: expiresAt,
    requested_ip: requesterIp,
  });

  const base = clientResetBaseUrl || process.env.CLIENT_RESET_URL || `${process.env.CLIENT_URL}/reset-password`;
  const resetUrl = `${base}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(tokenRaw)}`;

  await mailer.sendPasswordReset(email, {
    name: user.name || user.username || email,
    resetUrl,
    expiresMinutes: PASSWORD_RESET_TTL_MINUTES,
    requesterIp,
  });
}

async function verifyAndResetPassword({ email, tokenRaw, newPassword, usedIp }) {
  const tokenHash = sha256Hex(tokenRaw);
  const record = await PasswordReset.findValidByEmailAndHash(email, tokenHash);
  if (!record) {
    const err = new Error('Token không hợp lệ hoặc đã hết hạn.');
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);
  await userModel.updatePassword(record.user_id, newHash);

  await PasswordReset.markUsed(record.id, usedIp);

  // Hủy toàn bộ refresh tokens cũ -> logout mọi nơi
  if (authModel.deleteUserRefreshTokens) {
    await authModel.deleteUserRefreshTokens(record.user_id);
  }
  return true;
}

module.exports = {
  validations,

  // POST /api/auth/forgot-password
  forgotPassword: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { email } = req.body;
    await createResetIfUserExists(email, req.ip, process.env.CLIENT_RESET_URL);

    // Không tiết lộ email tồn tại
    return res.status(200).json({
      success: true,
      message: 'Nếu email hợp lệ, hướng dẫn đặt lại mật khẩu đã được gửi.'
    });
  },

  // POST /api/auth/reset-password
  resetPassword: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { email, token, new_password } = req.body;
    try {
      await verifyAndResetPassword({
        email,
        tokenRaw: token,
        newPassword: new_password,
        usedIp: req.ip,
      });
      return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' });
    } catch (e) {
      if (e.code === 'INVALID_TOKEN') {
        return res.status(400).json({ success: false, message: e.message });
      }
      console.error('reset-password error:', e);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
    }
  },
};
