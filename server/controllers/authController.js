const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  getRefreshTokenExpires 
} = require('../utils/tokenUtils');

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /api/auth/register
 */
const register = async (req, res) => {
  // [SỬA] - Lấy các trường bắt buộc mới
  const { username, email, password, phone, name } = req.body;

  // [SỬA] - Cập nhật validation
if (!username || !email || !password || !phone || !name) {
    return res.status(400).json({ 
    message: 'Vui lòng cung cấp đủ thông tin: username, password, name, phone, và email.' 
    });
}

  let connection;
  try {
    connection = await pool.getConnection(); 

    const [existing] = await connection.query(
      'SELECT phone, email, username FROM users WHERE phone = ? OR email = ? OR username = ?',
      [phone, email, username]
    );

    if (existing.length > 0) {
      if (existing[0].email === email) {
        return res.status(409).json({ message: 'Email này đã được sử dụng.' });
      }
      if (existing[0].username === username) {
        return res.status(409).json({ message: 'Username này đã được sử dụng.' });
      }
      if (existing[0].phone === phone) {
        return res.status(409).json({ message: 'Số điện thoại này đã được sử dụng.' });
      }
    }

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // [SỬA] - Thêm các trường mới vào câu lệnh INSERT
    // Ghi chú: 
    // - `name` được đặt tạm bằng `username`. Bạn có thể thêm trường `name` (Họ tên) riêng nếu muốn.
    // - `role` và `is_active` sẽ tự động lấy giá trị DEFAULT (3 và 1) mà chúng ta đã set.
    // - `avatar` sẽ tự động là NULL.
    const [result] = await connection.query(
        'INSERT INTO users (name, username, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
        [ name, username, email, password_hash, phone ]
    );;
    res.status(201).json({ 
      message: 'Đăng ký tài khoản thành công!', 
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp username và password.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT id, name, username, email, password_hash, role, avatar, is_active FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    // Kiểm tra user tồn tại và có active không
    if (!user || user.is_active === 0) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }

    // Đăng nhập thành công -> Tạo Tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenExpires = getRefreshTokenExpires();

    // Xóa mọi Refresh Token cũ của user này
    await connection.query(
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      [user.id]
    );
    
    // Lưu Refresh Token MỚI vào DB
    await connection.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, refreshTokenExpires]
    );

    // Gửi Refresh Token qua httpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });
    
    // [SỬA] - Gửi Access Token và thông tin user (thêm 'username')
    res.json({
      message: 'Đăng nhập thành công!',
      accessToken: accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username, // <-- Thêm username vào response
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


module.exports = {
  register,
  login 
};