const db = require("../config/db");

const buildWhere = (parts) => (parts.length ? `WHERE ${parts.join(" AND ")}` : "");

exports.findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, username, email, phone, address, avatar, is_active, role, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
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
  if (!cond.length) return [];
  const [rows] = await db.query(
    `SELECT id, email, phone FROM users WHERE (${cond.join(" OR ")}) LIMIT 5`,
    params
  );
  return rows.filter((r) => r.id !== Number(userId));
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

// ===== List theo role với FILTER MỚI =====
exports.listUsers = async ({
  role,
  page = 1,
  limit = 20,
  sort = "created_at:desc",
  name,
  email,
  phone,
  address,
  created_at, // YYYY-MM-DD
  is_active,
}) => {
  const where = [];
  const params = [];

  if (role) { where.push(`role = ?`); params.push(role); }
  if (typeof is_active === "number") { where.push(`is_active = ?`); params.push(is_active); }
  if (name) { where.push(`name LIKE ?`); params.push(`%${name}%`); }
  if (email) { where.push(`email LIKE ?`); params.push(`%${email}%`); }
  if (phone) { where.push(`phone LIKE ?`); params.push(`%${phone}%`); }
  if (address) { where.push(`address LIKE ?`); params.push(`%${address}%`); }
  if (created_at) { where.push(`DATE(created_at) = ?`); params.push(created_at.slice(0, 10)); }

  const whereSql = buildWhere(where);

  const [col, dir] = (sort || "created_at:desc").split(":");
  const safeCol = ["created_at","name","email","username","phone","role","is_active","updated_at"].includes(col)
    ? col
    : "created_at";
  const safeDir = (dir || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT id, name, username, email, phone, address, avatar, is_active, role, created_at, updated_at
     FROM users ${whereSql}
     ORDER BY ${safeCol} ${safeDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM users ${whereSql}`,
    params
  );

  return { rows, total };
};

exports.adminUpdateUser = async (userId, fields) => {
  const ALLOWED = ["name", "email", "phone", "address", "avatar", "is_active"];
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

exports.findDupForCreate = async (email, username, phone) => {
  const [rows] = await db.query(
    `SELECT id, email, username, phone FROM users WHERE email = ? OR username = ? OR phone = ? LIMIT 1`,
    [email, username, phone]
  );
  return rows[0] || null;
};

exports.createEmployee = async ({ name, username, email, password_hash, phone, address, avatar, is_active = 1 }) => {
  const [rs] = await db.query(
    `INSERT INTO users (name, username, email, password_hash, phone, address, avatar, is_active, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, NOW(), NOW())`,
    [name, username, email, password_hash, phone || null, address || null, avatar || null, Number(is_active)]
  );
  return { id: rs.insertId };
};
