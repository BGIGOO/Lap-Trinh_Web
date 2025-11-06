const db = require('../config/db'); // mysql2/promise pool

module.exports = {
  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, name, username, email, phone, address, avatar, is_active, role, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`, [id]
    );
    return rows[0] || null;
  },

  async findByEmailOrPhoneExceptUser(email, phone, userId) {
    const params = [];
    let sql = `SELECT id, email, phone FROM users WHERE (1=1)`;
    if (email) { sql += ` AND email = ?`; params.push(email); }
    if (phone) { sql += ` OR phone = ?`; params.push(phone); }
    sql += ` LIMIT 2`;
    const [rows] = await db.query(sql, params);
    return rows.filter(r => r.id !== Number(userId));
  },

  async updateProfile(userId, fields) {
    // chỉ cho phép một whitelist
    const ALLOWED = ['name', 'email', 'phone', 'address', 'avatar'];
    const set = [];
    const params = [];
    for (const k of ALLOWED) {
      if (fields[k] !== undefined) {
        set.push(`${k} = ?`);
        params.push(fields[k]);
      }
    }
    if (set.length === 0) return 0;
    set.push(`updated_at = NOW()`);
    const sql = `UPDATE users SET ${set.join(', ')} WHERE id = ?`;
    params.push(userId);
    const [rs] = await db.query(sql, params);
    return rs.affectedRows;
  },

  async getPasswordHash(userId) {
    const [rows] = await db.query(
      `SELECT password_hash FROM users WHERE id = ? LIMIT 1`, [userId]
    );
    return rows[0]?.password_hash || null;
  },

  async updatePassword(userId, newHash) {
    const [rs] = await db.query(
      `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?`,
      [newHash, userId]
    );
    return rs.affectedRows;
  }
};