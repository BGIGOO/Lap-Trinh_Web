const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const actor = (req) => ({ id: Number(req.user?.userId), role: Number(req.user?.role) });

// ===== /me: Xem thông tin bản thân =====
exports.getMe = async (req, res) => {
  const me = await User.findById(actor(req).id);
  if (!me) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
  if (me.is_active === 0) return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa." });
  
  // Xóa pass hash trước khi trả về
  delete me.password_hash;
  return res.json({ success: true, data: me });
};

// ===== /me: Cập nhật thông tin bản thân =====
exports.updateMe = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const userId = actor(req).id;
  const me = await User.findById(userId);
  if (!me || me.is_active === 0) return res.status(403).json({ message: "Không thể cập nhật." });

  const { name, email, phone, address, avatar, birthday, sex } = req.body;

  // 1. Check trùng lặp (trừ bản thân)
  if (email || phone) {
    const dups = await User.findDupForUpdate(email, phone, userId);
    if (dups.length > 0) {
      for (const d of dups) {
        if (d.email === email) return res.status(409).json({ message: "Email đã được sử dụng." });
        if (d.phone === phone) return res.status(409).json({ message: "Số điện thoại đã được sử dụng." });
      }
    }
  }

  // 2. Update
  const affected = await User.updateProfile(userId, { name, phone, address, avatar, birthday, sex });
  
  // 3. Lấy lại info mới nhất
  const refreshed = await User.findById(userId);
  delete refreshed.password_hash;

  return res.json({ 
    success: true, 
    message: affected ? "Cập nhật thành công." : "Không có gì thay đổi.", 
    data: refreshed 
  });
};

// ===== Đổi mật khẩu =====
exports.changeMyPassword = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const userId = actor(req).id;
  const { old_password, new_password } = req.body;

  const currentHash = await User.getPasswordHash(userId);
  const ok = await bcrypt.compare(old_password, currentHash || "");
  if (!ok) return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng." });

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(new_password, salt);
  
  await User.updatePassword(userId, newHash);
  return res.json({ success: true, message: "Đổi mật khẩu thành công." });
};

// ===== Admin List (Search users) =====
const listByRole = async (req, res, role) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const keyword = req.query.keyword || ""; // Tìm theo tên, email, phone
  
  const is_active = req.query.is_active !== undefined ? Number(req.query.is_active) : undefined;

  const { rows, total } = await User.listUsers({
    role, page, limit, keyword, is_active
  });

  return res.json({ success: true, data: rows, meta: { page, limit, total } });
};

exports.listCustomers = (req, res) => listByRole(req, res, 3);
exports.listEmployees = (req, res) => listByRole(req, res, 2);

// ===== Admin: Tạo nhân viên =====
exports.createEmployee = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const { name, email, password, phone, address, avatar, is_active, birthday, sex } = req.body;

  // Check trùng
  const dup = await User.findDupForCreate(email, phone || "");
  if (dup && dup.length > 0) {
      // Logic check trong SP trả về mảng -> lấy phần tử đầu
      const d = dup[0]; 
      if (d.email === email) return res.status(409).json({ message: "Email đã được sử dụng." });
      if (d.phone === phone) return res.status(409).json({ message: "Số điện thoại đã được sử dụng." });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const created = await User.createEmployee({ 
    name, email, password_hash, phone, address, avatar, is_active, birthday, sex 
  });
  
  const user = await User.findById(created.id);
  delete user.password_hash;

  return res.status(201).json({ success: true, message: "Tạo nhân viên thành công.", data: user });
};

// ===== Admin: Update user khác =====
exports.adminUpdateProfile = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const { id, name, email, phone, address, avatar, is_active, birthday, sex } = req.body;

  const target = await User.findById(id);
  if (!target) return res.status(404).json({ success: false, message: "User không tồn tại." });

  // Check trùng lặp
  if (email || phone) {
    const dups = await User.findDupForUpdate(email, phone, id);
    if (dups.length > 0) {
       for (const d of dups) {
        if (d.email === email) return res.status(409).json({ message: "Email đã được sử dụng." });
        if (d.phone === phone) return res.status(409).json({ message: "Số điện thoại đã được sử dụng." });
      }
    }
  }

  const affected = await User.adminUpdateUser(id, { 
    name, phone, address, avatar, is_active, birthday, sex 
  });
  
  const refreshed = await User.findById(id);
  delete refreshed.password_hash;

  return res.json({
    success: true,
    message: affected ? "Cập nhật thành công." : "Không có gì thay đổi.",
    data: refreshed,
  });
};

// ===== Admin: Toggle Activate =====
exports.adminActivateToggle = async (req, res) => {
  const { id } = req.body;
  if (Number(id) === 1) return res.status(400).json({ message: "Không thể tác động vào Super Admin." });

  const u = await User.findById(id);
  if (!u) return res.status(404).json({ message: "User không tồn tại." });

  const nextActive = u.is_active === 1 ? 0 : 1;
  // Dùng luôn hàm update admin
  await User.adminUpdateUser(id, { is_active: nextActive });

  const refreshed = await User.findById(id);
  delete refreshed.password_hash;

  return res.json({
    success: true,
    message: nextActive ? "Đã kích hoạt tài khoản." : "Đã vô hiệu hóa tài khoản.",
    data: refreshed,
  });
};