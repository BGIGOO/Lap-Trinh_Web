const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware'); // chỉ cần bảo vệ, KHÔNG bó hẹp admin
const { updateMeRules, changePasswordRules } = require('../middlewares/userValidator');

// Bất kỳ user đã đăng nhập đều dùng được
router.get('/me', protect, userController.getMe);

// Cập nhật hồ sơ của chính mình
router.put('/me', protect, updateMeRules, userController.updateMe);

// Đổi mật khẩu
router.patch('/me/password', protect, changePasswordRules, userController.changeMyPassword);

module.exports = router;