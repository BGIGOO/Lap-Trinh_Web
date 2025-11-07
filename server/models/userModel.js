const db = require("../config/db");

// helper compose where từ mảng điều kiện
const buildWhere = (parts) => parts.length ? `WHERE ${parts.join(" AND ")}` : "";

exports.findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, username, email, phone, address, avatar, is_active, role, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
};

exports.getPasswordHash = async (userId) => {
  const [rows] = await db.query(`SELECT password_hash FROM users WHERE id = ? LIMIT 1`, [userId]);
  return rows[0]?.password_hash || null;
};

exports.updatePassword = async (userId, newHash) => {
  const [rs] = await db.query(
    `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?`,
    [newHash, userId]
  );
  return rs.affectedRows;
};

exports.findDupForUpdate = async (email, phone, userId) => {
  const cond = [];
  const params = [];
  if (email) { cond.push("email = ?"); params.push(email); }
  if (phone) { cond.push("phone = ?"); params.push(phone); }
  if (cond.length === 0) return [];
  const [rows] = await db.query(
    `SELECT id, email, phone FROM users WHERE (${cond.join(" OR ")}) LIMIT 5`,
    params
  );
  return rows.filter(r => r.id !== Number(userId));
};

exports.updateProfile = async (userId, fields) => {
  const ALLOWED = ["name", "email", "phone", "address", "avatar"];
  const set = [];
  const params = [];
  for (const k of ALLOWED) {
    if (fields[k] !== undefined) { set.push(`${k} = ?`); params.push(fields[k]); }
  }
  if (!set.length) return 0;
  set.push("updated_at = NOW()");
  const [rs] = await db.query(`UPDATE users SET ${set.join(", ")} WHERE id = ?`, [...params, userId]);
  return rs.affectedRows;
};

// ===== List theo role (2=employee, 3=customer) =====
exports.listUsers = async ({ role, page = 1, limit = 20, search, is_active, sort = "created_at:desc" }) => {
  const where = [];
  const params = [];
  if (role) { where.push(`role = ?`); params.push(role); }
  if (is_active === 0 || is_active === 1) { where.push(`is_active = ?`); params.push(is_active); }
  if (search) {
    const kw = `%${search}%`;
    where.push(`(name LIKE ? OR email LIKE ? OR username LIKE ? OR phone LIKE ?)`);
    params.push(kw, kw, kw, kw);
  }
  const whereSql = buildWhere(where);

  const [col, dir] = (sort || "created_at:desc").split(":");
  const safeCol = ["created_at","name","email","username","phone","role","is_active"].includes(col) ? col : "created_at";
  const safeDir = (dir || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT id, name, username, email, phone, address, avatar, is_active, role, created_at, updated_at
     FROM users ${whereSql}
     ORDER BY ${safeCol} ${safeDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM users ${whereSql}`, params);
  return { rows, total };
};

// ===== Admin update (cho phép is_active; role KHÔNG cho đổi) =====
exports.adminUpdateUser = async (userId, fields) => {
  const ALLOWED = ["name","email","phone","address","avatar","is_active"];
  const set = [];
  const params = [];
  for (const k of ALLOWED) {
    if (fields[k] !== undefined) { set.push(`${k} = ?`); params.push(fields[k]); }
  }
  if (!set.length) return 0;
  set.push("updated_at = NOW()");
  const [rs] = await db.query(`UPDATE users SET ${set.join(", ")} WHERE id = ?`, [...params, userId]);
  return rs.affectedRows;
};

// ===== Kiểm tra trùng khi tạo mới (email/username/phone) =====
exports.findDupForCreate = async (email, username, phone) => {
  const [rows] = await db.query(
    `SELECT id, email, username, phone FROM users 
     WHERE email = ? OR username = ? OR phone = ? LIMIT 1`,
    [email, username, phone]
  );
  return rows[0] || null;
};

// ===== Tạo nhân viên (role=2) =====
exports.createEmployee = async ({ name, username, email, password_hash, phone, address, avatar, is_active = 1 }) => {
  const [rs] = await db.query(
    `INSERT INTO users (name, username, email, password_hash, phone, address, avatar, is_active, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, NOW(), NOW())`,
    [name, username, email, password_hash, phone || null, address || null, avatar || null, Number(is_active)]
  );
  return { id: rs.insertId };
};
