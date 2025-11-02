const jwt = require('jsonwebtoken');

/**
 * @desc    Middleware "gác cổng" - Xác thực token
 * Chỉ kiểm tra xem user đã đăng nhập (có token hợp lệ) hay chưa.
 */
const protect = (req, res, next) => {
  let token;

  // 1. Kiểm tra header 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Lấy token từ header (dạng 'Bearer [token]')
      token = req.headers.authorization.split(' ')[1];

      // 3. Xác thực token
      //    Nó sẽ giải mã payload (chứa userId, role) mà chúng ta đã tạo ở 'login'
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Gán thông tin user (từ token) vào request
      //    Để các controller sau có thể dùng (ví dụ: req.user.userId)
      req.user = decoded; // decoded sẽ là { userId: 1, role: 2, iat: ..., exp: ... }

      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error('Lỗi xác thực token:', error.message);
      res.status(401).json({ message: 'Token không hợp lệ, không có quyền truy cập.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không tìm thấy token, không có quyền truy cập.' });
  }
};

/**
 * @desc    Middleware "gác cổng" - Phân quyền
 * Kiểm tra xem user có "role" (vai trò) được phép hay không.
 * @param   {...number} roles - Danh sách các role (dạng INT) được phép.
 * Ví dụ: authorize(1) (chỉ admin), authorize(1, 2) (admin và employee)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Middleware này phải chạy SAU middleware 'protect'
    // vì nó cần 'req.user'
    
    if (!req.user || !roles.includes(req.user.role)) {
      // Nếu role của user (từ token) không nằm trong danh sách 'roles' được phép
      res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' }); // 403 Forbidden
      return;
    }
    
    next(); // Có quyền, cho đi tiếp
  };
};

module.exports = {
  protect,
  authorize,
};
