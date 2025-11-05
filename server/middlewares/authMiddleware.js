const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;             // { userId, role, ... }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ, không có quyền truy cập.' });
    }
  }
  return res.status(401).json({ message: 'Không tìm thấy token, không có quyền truy cập.' });
};

// CHỈNH: ép role về number để so sánh chắc chắn
const authorize = (...roles) => {
  const allowed = roles.map(Number);
  return (req, res, next) => {
    const userRole = Number(req.user?.role);
    if (!req.user || !allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
    }
    next();
  };
};

module.exports = { protect, authorize };
