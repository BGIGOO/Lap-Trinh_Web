const { body, query } = require("express-validator");

// Helper validate giới tính
const isSexValid = (value) => {
  if (!value) return true; // Cho phép null/undefined
  return ['Nam', 'Nữ', 'Khác'].includes(value);
};

// ===== /me: Cập nhật profile cá nhân =====
const updateMeRules = [
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar').optional({ checkFalsy: true }).isURL().withMessage('Avatar phải là URL'),
  
  // Mới: Birthday & Sex
  body("birthday").optional({ checkFalsy: true }).isISO8601().withMessage("Ngày sinh phải là định dạng YYYY-MM-DD"),
  body("sex").optional().custom(isSexValid).withMessage("Giới tính phải là: Nam, Nữ, hoặc Khác"),

  // Cấm user tự sửa role, active status
  body("role").not().exists(),
  body("is_active").not().exists(),
  body("password_hash").not().exists(),
];

const changePasswordRules = [
  body("old_password").isLength({ min: 6 }),
  body("new_password").isLength({ min: 8 }),
];

// ===== List users filter =====
const listUsersQueryRules = [
  query("keyword").optional().isString().trim(), // Tìm chung
  query("is_active").optional().isIn(["0", "1"]).toInt(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

// ===== Admin cập nhật profile người khác =====
const adminUpdateProfileRules = [
  body("id").isInt({ min: 1 }).toInt(),
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar').optional({ checkFalsy: true }).isURL(),
  
  body("birthday").optional({ checkFalsy: true }).isISO8601(),
  body("sex").optional().custom(isSexValid),

  body("is_active").optional().isInt({ min: 0, max: 1 }),
  body("role").not().exists(), // Role không nên sửa lung tung ở đây
];

// ===== Admin toggle activate =====
const adminActivateRules = [
  body("id").isInt({ min: 1 }).toInt(),
];

// ===== Tạo nhân viên =====
const createEmployeeRules = [
  body("name").isLength({ min: 1, max: 100 }),
  // Bỏ username
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar').optional({ checkFalsy: true }).isURL(),
  
  body("birthday").optional({ checkFalsy: true }).isISO8601(),
  body("sex").optional().custom(isSexValid),
  
  body("is_active").optional().isInt({ min: 0, max: 1 }),
];

module.exports = {
  updateMeRules,
  changePasswordRules,
  listUsersQueryRules,
  adminUpdateProfileRules,
  adminActivateRules,
  createEmployeeRules,
};