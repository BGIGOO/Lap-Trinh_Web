const db = require("../config/db");

/**
 * Tìm user bằng phone, email, HOẶC username
 * (Dùng cho việc kiểm tra khi đăng ký)
 */
exports.findUserByCredentials = async (phone, email, username) => {
    const [existing] = await db.query(
        'SELECT phone, email, username FROM users WHERE phone = ? OR email = ? OR username = ?',
        [phone, email, username]
    );
    // Trả về mảng các user tìm thấy (có thể rỗng)
    return existing;
};

/**
 * Tạo user mới
 */
exports.createUser = async (name, username, email, password_hash, phone) => {
    const [result] = await db.query(
        'INSERT INTO users (name, username, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
        [name, username, email, password_hash, phone]
    );
    // Trả về ID của user vừa tạo
    return result.insertId;
};

/**
 * Tìm user bằng username
 * (Dùng cho việc đăng nhập)
 */
exports.findUserByUsername = async (username) => {
    const [rows] = await db.query(
        'SELECT id, name, username, email, password_hash, role, avatar, is_active FROM users WHERE username = ?',
        [username]
    );
    // Trả về user object (hoặc undefined nếu không tìm thấy)
    return rows[0];
};

/**
 * Xóa TẤT CẢ refresh token của một user
 * (Dùng khi đăng nhập, để vô hiệu hóa các phiên cũ)
 */
exports.deleteUserRefreshTokens = async (userId) => {
    await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
};

/**
 * Lưu refresh token mới vào DB
 */
exports.saveRefreshToken = async (userId, token, expires_at) => {
    await db.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expires_at]
    );
};

/**
 * Tìm refresh token
 * (Dùng cho chức năng /refresh)
 */
exports.findRefreshToken = async (token) => {
    const [tokenRows] = await db.query(
        'SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?',
        [token]
    );
    // Trả về token object (hoặc undefined)
    return tokenRows[0];
};

/**
 * Tìm user bằng ID
 * (Dùng cho /refresh để kiểm tra user còn tồn tại/active không)
 */
exports.findUserById = async (userId) => {
    const [userRows] = await db.query(
        'SELECT role, is_active FROM users WHERE id = ?',
        [userId]
    );
    // Trả về user object (hoặc undefined)
    return userRows[0];
};

/**
 * Xóa một refresh token cụ thể
 * (Dùng cho việc đăng xuất)
 */
exports.deleteRefreshToken = async (token) => {
    await db.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [token]
    );
};