const db = require('../config/db');

module.exports = {
  // Tạo bản ghi reset password mới
  async insert({ user_id, reset_token_hash, expires_at, requested_ip }) {
    const [rows] = await db.query(
      'CALL sp_create_password_reset(?, ?, ?, ?)',
      [user_id, reset_token_hash, expires_at, requested_ip]
    );
    // rows[0][0] chứa kết quả SELECT LAST_INSERT_ID()
    return rows[0][0].insertId;
  },

  // Tìm token hợp lệ
  async findValidByEmailAndHash(email, reset_token_hash) {
    const [rows] = await db.query(
      'CALL sp_find_valid_reset_token(?, ?)',
      [email, reset_token_hash]
    );
    // Trả về dòng đầu tiên hoặc null
    return rows[0][0] || null;
  },

  // Đánh dấu token đã dùng
  async markUsed(id, used_ip) {
    await db.query(
      'CALL sp_mark_reset_token_used(?, ?)',
      [id, used_ip || null]
    );
  },

  // Hủy các token cũ chưa dùng của user này
  async invalidateAllForUser(user_id) {
    await db.query(
      'CALL sp_invalidate_user_resets(?)',
      [user_id]
    );
  },
};