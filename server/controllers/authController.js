const authModel = require('../models/authModel');
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
    // (Giữ nguyên toàn bộ code register của bạn)
    const { username, email, password, phone, name } = req.body;
    if (!username || !email || !password || !phone || !name) {
        return res.status(400).json({
            message: 'Vui lòng cung cấp đủ thông tin: username, password, name, phone, và email.'
        });
    }
    try {
        const existing = await authModel.findUserByCredentials(phone, email, username);
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
        const userId = await authModel.createUser(name, username, email, password_hash, phone);
        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            userId: userId
        });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 */
const login = async (req, res) => {
  const { username, password, loginType } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp username và password.' });
  }

  // Chuẩn hoá loginType -> 1/2/3
  const normalizeLoginType = (lt) => {
    if (lt === undefined || lt === null || lt === '') return null;
    if (typeof lt === 'string') {
      const s = lt.trim().toLowerCase();
      if (s === 'admin') return 1;
      if (s === 'employee') return 2;
      if (s === 'client') return 3;
      const n = Number(s);
      if (Number.isFinite(n)) return n;
      return null;
    }
    if (typeof lt === 'number' && Number.isFinite(lt)) return lt;
    return null;
  };

  // parse loginType theo “cách B”: bắt buộc có và phải khớp với role
  const lt = normalizeLoginType(loginType);
  if (lt === null) {
    return res.status(400).json({ message: 'Thiếu loginType hoặc loginType không hợp lệ.' });
  }

  try {
    const user = await authModel.findUserByUsername(username);
    if (!user || user.is_active === 0) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }

    const userRole = Number(user.role); // 1=Admin, 2=Employee, 3=Client

    // ====== CÁCH B: Ép đúng “cổng” theo loginType ======
    if (lt !== userRole) {
      return res.status(403).json({ message: 'Không Đúng' });
    }

    // Determine access token expiry dựa trên role thực
    let accessExpiresIn;
    if (userRole === 1) accessExpiresIn = '15m';
    else if (userRole === 2) accessExpiresIn = '2h';
    else accessExpiresIn = '30m';

    const accessToken = generateAccessToken(user.id, userRole, accessExpiresIn);

    // Determine refresh token expiry dựa trên loginType (đã khớp role)
    let refreshExpiresIn;
    if (lt === 1) refreshExpiresIn = '4h';
    else if (lt === 2) refreshExpiresIn = '16h';
    else if (lt === 3) refreshExpiresIn = '3d';
    else refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || '3d';

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: refreshExpiresIn }
    );

    // helper tính expires_at để lưu DB
    const computeExpiresAt = (expStr) => {
      const m = String(expStr).match(/^(\d+)(s|m|h|d)?$/);
      if (!m) return new Date(Date.now());
      const n = parseInt(m[1], 10);
      const unit = m[2] || 's';
      const mul = unit === 's' ? 1000 :
                  unit === 'm' ? 60 * 1000 :
                  unit === 'h' ? 60 * 60 * 1000 :
                  unit === 'd' ? 24 * 60 * 60 * 1000 : 1000;
      return new Date(Date.now() + n * mul);
    };

    const refreshTokenExpires = computeExpiresAt(refreshExpiresIn);

    await authModel.deleteUserRefreshTokens(user.id);
    await authModel.saveRefreshToken(user.id, refreshToken, refreshTokenExpires);

    const cookieMaxAge = refreshTokenExpires.getTime() - Date.now();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: cookieMaxAge,
      path: '/', // đảm bảo cookie gửi cho mọi route API
    });

    return res.json({
      message: 'Đăng nhập thành công!',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: userRole,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
};


/**
 * @desc    Làm mới Access Token
 * @route   POST /api/auth/refresh
 */
const refresh = async (req, res) => {
    // (Giữ nguyên toàn bộ code refresh của bạn)
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Không tìm thấy refresh token (Chưa đăng nhập).' });
    }
    try {
        const tokenData = await authModel.findRefreshToken(refreshToken);
        if (!tokenData) {
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: 'Refresh token không hợp lệ (Không có trong DB).' });
        }
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(403).json({ message: 'Refresh token hết hạn hoặc không đúng.' });
        }
        const user = await authModel.findUserById(payload.userId);
        if (!user || user.is_active === 0) {
            return res.status(403).json({ message: 'User không tồn tại hoặc đã bị vô hiệu hóa.' });
        }
    // when refreshing, issue access token with expiry based on role
    let newAccessExpiresIn;
    if (user.role === 1) newAccessExpiresIn = '15m';
    else if (user.role === 2) newAccessExpiresIn = '2h';
    else newAccessExpiresIn = '30m';

    const newAccessToken = generateAccessToken(payload.userId, user.role, newAccessExpiresIn);
        res.json({
            message: 'Làm mới token thành công!',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Lỗi khi làm mới token:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
};


/**
 * @desc    Đăng xuất
 * @route   POST /api/auth/logout
 */
const logout = async (req, res) => {
    // (Giữ nguyên toàn bộ code logout của bạn)
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(200).json({ message: 'Đã đăng xuất (không có token).' });
    }
    try {
        await authModel.deleteRefreshToken(refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Đăng xuất thành công.' });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(500).json({ message: 'Lỗi hệ thống khi đăng xuất.' });
    }
};


module.exports = {
    register,
    login,
    refresh,
    logout
};

