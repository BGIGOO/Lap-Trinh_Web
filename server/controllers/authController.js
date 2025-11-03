const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
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
  // ... (toàn bộ code register của bạn - giữ nguyên)
  const { username, email, password, phone, name } = req.body;
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
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
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
  // ... (toàn bộ code login của bạn - giữ nguyên)
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
    if (!user || user.is_active === 0) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenExpires = getRefreshTokenExpires();
    await connection.query(
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      [user.id]
    );
    await connection.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, refreshTokenExpires]
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });
    res.json({
      message: 'Đăng nhập thành công!',
      accessToken: accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
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


/**
 * @desc    Làm mới Access Token
 * @route   POST /api/auth/refresh
 */
const refresh = async (req, res) => {
  // ... (toàn bộ code refresh của bạn - giữ nguyên)
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Không tìm thấy refresh token (Chưa đăng nhập).' });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [tokenRows] = await connection.query(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?',
      [refreshToken]
    );
    if (tokenRows.length === 0) {
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Refresh token không hợp lệ (Không có trong DB).' });
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Refresh token hết hạn hoặc không đúng.' });
    }
    const [userRows] = await connection.query(
      'SELECT role, is_active FROM users WHERE id = ?',
      [payload.userId]
    );
    if (userRows.length === 0 || userRows[0].is_active === 0) {
      return res.status(403).json({ message: 'User không tồn tại hoặc đã bị vô hiệu hóa.' });
    }
    const user = userRows[0];
    const newAccessToken = generateAccessToken(payload.userId, user.role);
    res.json({
      message: 'Làm mới token thành công!',
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// 1. TẠO HÀM MỚI
/**
 * @desc    Đăng xuất
 * @route   POST /api/auth/logout
 */
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Nếu không có cookie, user coi như đã đăng xuất, trả về thành công
  if (!refreshToken) {
    return res.status(200).json({ message: 'Đã đăng xuất (không có token).' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Xóa token khỏi DB
    // Điều này sẽ vô hiệu hóa token ngay lập tức
    await connection.query(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [refreshToken]
    );

    // 2. Xóa cookie khỏi trình duyệt
    // (Các tùy chọn phải khớp với lúc set cookie)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Đăng xuất thành công.' });

  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    // Kể cả khi có lỗi (ví dụ DB), vẫn nên xóa cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(500).json({ message: 'Lỗi hệ thống khi đăng xuất.' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// 2. EXPORT HÀM MỚI
module.exports = {
  register,
  login,
  refresh,
  logout
};

