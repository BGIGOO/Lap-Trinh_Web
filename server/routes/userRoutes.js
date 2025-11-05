// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const { protect } = require('../middlewares/authMiddleware'); // Import "gác cổng"

// // @route   GET /api/users/me
// // @desc    Lấy thông tin user đang đăng nhập
// // @access  Private
// //
// // Bất cứ ai gọi API này đều phải đi qua 'protect' trước.
// // Nếu 'protect' OK, nó sẽ chạy tiếp 'userController.getMe'
// router.get('/me', protect, userController.getMe);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Chỉ admin (role=1) mới được gọi /api/users/me
router.get('/me', protect, authorize(1), userController.getMe);

module.exports = router;