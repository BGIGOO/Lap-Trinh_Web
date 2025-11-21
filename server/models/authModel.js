const db = require("../config/db");

/**
 * Kiểm tra trùng lặp Email hoặc Phone khi đăng ký
 * Sử dụng SP: sp_check_register_conflict
 */
exports.findUserByCredentials = async (email, phone) => {
    // Gọi Stored Procedure
    const [rows] = await db.query(
        'CALL sp_check_register_conflict(?, ?)',
        [email, phone]
    );
    // rows[0] là danh sách các bản ghi tìm thấy từ câu SELECT trong SP
    return rows[0]; 
};

/**
 * Tạo user mới
 * Sử dụng SP: sp_create_user
 */
exports.createUser = async (name, email, password_hash, phone, birthday, sex) => {
    const [rows] = await db.query(
        'CALL sp_create_user(?, ?, ?, ?, ?, ?)',
        [name, email, password_hash, phone, birthday, sex]
    );
    // SP trả về: SELECT LAST_INSERT_ID() as new_id
    // rows[0] là kết quả SELECT, rows[0][0] là dòng đầu tiên
    return rows[0][0].new_id;
};

/**
 * Tìm user bằng Email để đăng nhập
 * Sử dụng SP: sp_get_user_for_login
 */
exports.findUserByEmail = async (email) => {
    const [rows] = await db.query(
        'CALL sp_get_user_for_login(?)',
        [email]
    );
    // Trả về object user hoặc undefined
    return rows[0][0];
};

/**
 * Tìm user bằng ID (Dùng cho Refresh Token)
 * Sử dụng SP: sp_get_user_by_id
 */
exports.findUserById = async (userId) => {
    const [rows] = await db.query(
        'CALL sp_get_user_by_id(?)',
        [userId]
    );
    return rows[0][0];
};

/**
 * Xóa TẤT CẢ refresh token của user
 * Sử dụng SP: sp_delete_user_tokens
 */
exports.deleteUserRefreshTokens = async (userId) => {
    await db.query('CALL sp_delete_user_tokens(?)', [userId]);
};

/**
 * Lưu refresh token mới
 * Sử dụng SP: sp_save_refresh_token
 */
exports.saveRefreshToken = async (userId, token, expires_at) => {
    await db.query(
        'CALL sp_save_refresh_token(?, ?, ?)',
        [userId, token, expires_at]
    );
};

/**
 * Tìm refresh token
 * Sử dụng SP: sp_find_refresh_token
 */
exports.findRefreshToken = async (token) => {
    const [rows] = await db.query(
        'CALL sp_find_refresh_token(?)',
        [token]
    );
    return rows[0][0];
};

/**
 * Xóa một refresh token cụ thể (Logout)
 * Sử dụng SP: sp_delete_specific_token
 */
exports.deleteRefreshToken = async (token) => {
    await db.query(
        'CALL sp_delete_specific_token(?)',
        [token]
    );
};