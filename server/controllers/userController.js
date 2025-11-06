const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// GET /api/users/me
const getMe = async (req, res) => {
  const me = await userModel.findById(req.user.userId);
  if (!me) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
  if (Number(me.is_active) !== 1) {
    return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa.' });
  }
  return res.json({ success: true, data: me });
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const me = await userModel.findById(req.user.userId);
  if (!me) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
  if (Number(me.is_active) !== 1) {
    return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa.' });
  }

  const { name, email, phone, address, avatar } = req.body;

  // kiểm tra trùng email/phone (nếu có gửi lên)
  if (email || phone) {
    const dup = await userModel.findByEmailOrPhoneExceptUser(email, phone, req.user.userId);
    if (dup.length > 0) {
      const conflictEmail = dup.some(d => email && d.email === email);
      const conflictPhone = dup.some(d => phone && d.phone === phone);
      return res.status(409).json({
        success: false,
        message: conflictEmail ? 'Email đã được sử dụng.' :
                 conflictPhone ? 'Số điện thoại đã được sử dụng.' :
                 'Thông tin đã được sử dụng.'
      });
    }
  }

  const affected = await userModel.updateProfile(req.user.userId, { name, email, phone, address, avatar });
  if (!affected) {
    return res.json({ success: true, message: 'Không có gì để cập nhật.' });
  }

  const refreshed = await userModel.findById(req.user.userId);
  return res.json({ success: true, message: 'Cập nhật thành công.', data: refreshed });
};

// PATCH /api/users/me/password
const changeMyPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const me = await userModel.findById(req.user.userId);
  if (!me) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
  if (Number(me.is_active) !== 1) {
    return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa.' });
  }

  const { old_password, new_password } = req.body;

  const currentHash = await userModel.getPasswordHash(req.user.userId);
  const ok = await bcrypt.compare(old_password, currentHash || '');
  if (!ok) return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(new_password, salt);
  await userModel.updatePassword(req.user.userId, newHash);

  return res.json({ success: true, message: 'Đổi mật khẩu thành công.' });
};

module.exports = {
  getMe,
  updateMe,
  changeMyPassword,
};
