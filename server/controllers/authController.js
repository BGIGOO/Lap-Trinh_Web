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
    const { username, email, password, phone, name } = req.body;
    if (!username || !email || !password || !phone || !name) {
        return res.status(400).json({
            message: 'Vui lòng cung cấp đủ thông tin: username, password, name, phone, và email.'
        });
    }

    try {
        // 1. Gọi Model để kiểm tra
        const existing = await authModel.findUserByCredentials(phone, email, username);

        // 2. Xử lý logic
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

        // 3. Xử lý logic (hash)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Gọi Model để tạo user
        const userId = await authModel.createUser(name, username, email, password_hash, phone);

        // 5. Gửi response
        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            userId: userId
        });

    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
    // Không còn khối finally
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

    try {
        // 1. Gọi Model để tìm user
        const user = await authModel.findUserByUsername(username);

        // 2. Xử lý logic
        if (!user || user.is_active === 0) {
            return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
        }

        // 3. Xử lý logic (tạo token)
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);
        const refreshTokenExpires = getRefreshTokenExpires();

        // 4. Gọi Model để cập nhật token
        await authModel.deleteUserRefreshTokens(user.id);
        await authModel.saveRefreshToken(user.id, refreshToken, refreshTokenExpires);

        // 5. Gửi response (set cookie và JSON)
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
    }
};


/**
 * @desc    Làm mới Access Token
 * @route   POST /api/auth/refresh
 */
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Không tìm thấy refresh token (Chưa đăng nhập).' });
    }

    try {
        // 1. Gọi Model để tìm token
        const tokenData = await authModel.findRefreshToken(refreshToken);

        // 2. Xử lý logic
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

        // 3. Gọi Model để tìm user
        const user = await authModel.findUserById(payload.userId);

        // 4. Xử lý logic
        if (!user || user.is_active === 0) {
            return res.status(403).json({ message: 'User không tồn tại hoặc đã bị vô hiệu hóa.' });
        }

        // 5. Xử lý logic (tạo token mới)
        const newAccessToken = generateAccessToken(payload.userId, user.role);

        // 6. Gửi response
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
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(200).json({ message: 'Đã đăng xuất (không có token).' });
    }

    try {
        // 1. Gọi Model để xóa token
        await authModel.deleteRefreshToken(refreshToken);

        // 2. Gửi response (xóa cookie)
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


// 3. EXPORT HÀM (không thay đổi)
module.exports = {
    register,
    login,
    refresh,
    logout
};