// models/passwordResetModel.js
const db = require('../config/db'); // mysql2/promise pool

module.exports = {
  async insert({ user_id, reset_token_hash, expires_at, requested_ip }) {
    const sql = `
      INSERT INTO password_resets (user_id, reset_token_hash, expires_at, used, requested_ip, created_at, updated_at)
      VALUES (?, ?, ?, 0, ?, NOW(), NOW())
    `;
    const [rs] = await db.execute(sql, [user_id, reset_token_hash, expires_at, requested_ip]);
    return rs.insertId;
  },

  async findValidByEmailAndHash(email, reset_token_hash) {
    const sql = `
      SELECT pr.*, u.id AS user_id, u.email
      FROM password_resets pr
      JOIN users u ON u.id = pr.user_id
      WHERE u.email = ? AND pr.reset_token_hash = ? AND pr.used = 0 AND pr.expires_at > NOW()
      LIMIT 1
    `;
    const [rows] = await db.execute(sql, [email, reset_token_hash]);
    return rows[0] || null;
  },

  async markUsed(id, used_ip) {
    await db.execute(
      `UPDATE password_resets SET used = 1, used_ip = ?, updated_at = NOW() WHERE id = ?`,
      [used_ip || null, id]
    );
  },

  async invalidateAllForUser(user_id) {
    await db.execute(
      `UPDATE password_resets SET used = 1, updated_at = NOW() WHERE user_id = ? AND used = 0`,
      [user_id]
    );
  },
};
