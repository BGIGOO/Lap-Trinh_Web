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
    // [SỬA 1] Nhận thêm 'loginType' từ FE (AuthContext)
    const { username, password, loginType } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp username và password.' });
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

        // [SỬA 2] (Giải quyết Vấn đề 1)
        // Kiểm tra quyền đăng nhập dựa trên 'loginType'
        const userRole = user.role; // Giả sử: 1=Admin, 2=Employee, 3=Client

        // Nếu FE gửi 'admin_employee' (từ trang /admin123/login)
        // VÀ user *không* phải Admin (1) hay Employee (2)
        if (loginType === 'admin_employee' && (userRole !== 1 && userRole !== 2)) {
            // Đây là Client (role 3) đang cố đăng nhập vào trang Admin.
            // Từ chối ngay lập tức.
            return res.status(403).json({ message: 'Bạn không có quyền đăng nhập vào khu vực này.' });
        }
        
        // (Nếu bạn cũng muốn chặn Admin/Employee đăng nhập ở trang Client,
        // bạn có thể thêm logic tương tự cho loginType === 'client' ở đây)

        // Nếu vượt qua -> Đăng nhập hợp lệ, tiếp tục tạo token
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);
        const refreshTokenExpires = getRefreshTokenExpires();

        await authModel.deleteUserRefreshTokens(user.id);
        await authModel.saveRefreshToken(user.id, refreshToken, refreshTokenExpires);

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
        const newAccessToken = generateAccessToken(payload.userId, user.role);
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

