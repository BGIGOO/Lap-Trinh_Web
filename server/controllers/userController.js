const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ===== Helpers =====
const pub = (u) => ({
  id: u.id, name: u.name, username: u.username, email: u.email,
  phone: u.phone, address: u.address, avatar: u.avatar,
  is_active: Number(u.is_active), role: Number(u.role),
  created_at: u.created_at, updated_at: u.updated_at,
});

const actor = (req) => ({ id: Number(req.user?.userId), role: Number(req.user?.role) });

// ====== SELF: giữ nguyên hành vi bạn đã dùng ======
exports.getMe = async (req, res) => {
  const me = await User.findById(actor(req).id);
  if (!me) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
  if (Number(me.is_active) !== 1) return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa." });
  return res.json({ success: true, data: me });
};

exports.updateMe = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const me = await User.findById(actor(req).id);
  if (!me) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
  if (Number(me.is_active) !== 1) return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa." });

  const { name, email, phone, address, avatar } = req.body;
  if (email || phone) {
    const dup = await User.findDupForUpdate(email, phone, me.id);
    if (dup.length) {
      const conflictEmail = dup.some(d => email && d.email === email);
      const conflictPhone = dup.some(d => phone && d.phone === phone);
      return res.status(409).json({ success: false, message: conflictEmail ? "Email đã được sử dụng." : conflictPhone ? "Số điện thoại đã được sử dụng." : "Thông tin đã được sử dụng." });
    }
  }
  const affected = await User.updateProfile(me.id, { name, email, phone, address, avatar });
  const refreshed = await User.findById(me.id);
  return res.json({ success: true, message: affected ? "Cập nhật thành công." : "Không có gì để cập nhật.", data: refreshed });
};

exports.changeMyPassword = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const me = await User.findById(actor(req).id);
  if (!me) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
  if (Number(me.is_active) !== 1) return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa." });

  const { old_password, new_password } = req.body;
  const currentHash = await User.getPasswordHash(me.id);
  const ok = await bcrypt.compare(old_password, currentHash || "");
  if (!ok) return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng." });

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(new_password, salt);
  await User.updatePassword(me.id, newHash);
  return res.json({ success: true, message: "Đổi mật khẩu thành công." });
};

// ====== Admin list ======
const listByRole = async (req, res, role) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const search = req.query.search || undefined;
  const is_active = req.query.is_active !== undefined
  ? Number(req.query.is_active)
  : undefined;
  const sort = req.query.sort || "created_at:desc";

  const { rows, total } = await User.listUsers({ role, page, limit, search, is_active, sort });
  return res.json({ success: true, data: rows, meta: { page, limit, total } });
};

exports.listCustomers = (req, res) => listByRole(req, res, 3);
exports.listEmployees = (req, res) => listByRole(req, res, 2);

// ====== Generic: không dùng :id ======
exports.genericUpdateProfile = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const a = actor(req);
  const targetId = req.body.id ?? a.id;
  if (a.role !== 1 && targetId !== a.id) {
    return res.status(403).json({ success: false, message: "Không đủ quyền cập nhật hồ sơ người khác." });
  }

  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });

  if ("role" in req.body) return res.status(400).json({ success: false, message: "Không được cập nhật role." });
  if (a.role !== 1 && "is_active" in req.body) return res.status(403).json({ success: false, message: "Không đủ quyền cập nhật is_active." });

  const { name, email, phone, address, avatar } = req.body;
  if (email || phone) {
    const dup = await User.findDupForUpdate(email, phone, targetId);
    if (dup.length) {
      const conflictEmail = dup.some(d => email && d.email === email);
      const conflictPhone = dup.some(d => phone && d.phone === phone);
      return res.status(409).json({ success: false, message: conflictEmail ? "Email đã được sử dụng." : conflictPhone ? "Số điện thoại đã được sử dụng." : "Thông tin đã được sử dụng." });
    }
  }

  const affected = await User.adminUpdateUser(targetId, {
    name, email, phone, address, avatar,
    ...(a.role === 1 && "is_active" in req.body ? { is_active: Number(req.body.is_active) } : {})
  });

  const refreshed = await User.findById(targetId);
  return res.json({ success: true, message: affected ? "Cập nhật thành công." : "Không có gì để cập nhật.", data: pub(refreshed) });
};

exports.genericChangePassword = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const a = actor(req);
  const targetId = req.body.id ?? a.id;
  if (a.role !== 1 && targetId !== a.id) {
    return res.status(403).json({ success: false, message: "Không đủ quyền đổi mật khẩu người khác." });
  }

  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });

  const targetRole = Number(target.role);
  const { old_password, new_password } = req.body;

  if (targetId === a.id) {
    if (!old_password) return res.status(400).json({ success: false, message: "Thiếu old_password." });
    const currentHash = await User.getPasswordHash(targetId);
    const ok = await bcrypt.compare(old_password, currentHash || "");
    if (!ok) return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng." });
  } else {
    // Admin reset hộ
    if (a.role !== 1) return res.status(403).json({ success: false, message: "Không đủ quyền." });
    if (targetRole === 3) {
      return res.status(403).json({ success: false, message: "Admin không được reset mật khẩu khách hàng." });
    }
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(new_password, salt);
  await User.updatePassword(targetId, newHash);

  return res.json({ success: true, message: targetId === a.id ? "Đổi mật khẩu thành công." : "Đã reset mật khẩu nhân viên." });
};

exports.genericActivate = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const { id, is_active } = req.body;
  const target = await User.findById(id);
  if (!target) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });

  const nextActive = (is_active === 0 || is_active === 1) ? Number(is_active) : (Number(target.is_active) === 1 ? 0 : 1);

  await User.adminUpdateUser(id, { is_active: nextActive });
  const refreshed = await User.findById(id);
  return res.json({ success: true, message: nextActive ? "Đã kích hoạt tài khoản." : "Đã vô hiệu hóa tài khoản.", data: pub(refreshed) });
};

// ====== Admin: tạo nhân viên mới ======
exports.createEmployee = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  const { name, username, email, password, phone, address, avatar, is_active } = req.body;

  // chống trùng
  const dup = await User.findDupForCreate(email, username, phone || "");
  if (dup) {
    if (dup.email === email) return res.status(409).json({ success: false, message: "Email đã được sử dụng." });
    if (dup.username === username) return res.status(409).json({ success: false, message: "Username đã được sử dụng." });
    if (dup.phone && phone && dup.phone === phone) return res.status(409).json({ success: false, message: "Số điện thoại đã được sử dụng." });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const created = await User.createEmployee({ name, username, email, password_hash, phone, address, avatar, is_active });
  const user = await User.findById(created.id);

  return res.status(201).json({ success: true, message: "Tạo nhân viên thành công.", data: pub(user) });
};
