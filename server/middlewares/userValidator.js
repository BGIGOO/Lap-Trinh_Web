const { body, query } = require("express-validator");

// ===== /me (giữ nguyên tinh thần cũ) =====
const updateMeRules = [
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar')
  .optional({ checkFalsy: true }) // Cho phép giá trị là "", null, undefined
  .isURL()                      // Nhưng nếu nó CÓ GIÁ TRỊ, thì phải là URL
  .withMessage('Avatar phải là URL hợp lệ'),  
  body("role").not().exists(),
  body("is_active").not().exists(),
  body("password_hash").not().exists(),
];

const changePasswordRules = [
  body("old_password").isLength({ min: 6 }),
  body("new_password").isLength({ min: 8 }),
];

// ===== List filter (MỚI): name/email/phone/address/created_at/is_active + page/limit/sort =====
const listUsersQueryRules = [
  query("name").optional().isString().trim(),
  query("email").optional().isString().trim(),
  query("phone").optional().isString().trim(),
  query("address").optional().isString().trim(),
  // created_at: YYYY-MM-DD -> lọc theo ngày (DATE(created_at) = ?)
  query("created_at").optional().isISO8601().withMessage("created_at phải là YYYY-MM-DD"),
  query("is_active").optional().isIn(["0", "1"]).toInt(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("sort")
    .optional()
    .custom((v) => /^([a-z_]+):(asc|desc)$/i.test(v))
    .withMessage("sort không hợp lệ (vd: created_at:desc)"),
];

// ===== Admin cập nhật hồ sơ người khác (BẮT BUỘC id) =====
const adminUpdateProfileRules = [
  body("id").isInt({ min: 1 }).toInt(),
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar')
  .optional({ checkFalsy: true }) // Cho phép giá trị là "", null, undefined
  .isURL()                      // Nhưng nếu nó CÓ GIÁ TRỊ, thì phải là URL
  .withMessage('Avatar phải là URL hợp lệ'),
  body("is_active").optional().isInt({ min: 0, max: 1 }), // admin được phép
  body("role").not().exists(),
  body("password_hash").not().exists(),
];

// ===== Admin toggle activate (chỉ id, cấm id=1 ở controller) =====
const adminActivateRules = [
  body("id").isInt({ min: 1 }).toInt(),
];

// ===== Tạo nhân viên =====
const createEmployeeRules = [
  body("name").isLength({ min: 1, max: 100 }),
  body("username").isLength({ min: 3, max: 100 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body('avatar')
  .optional({ checkFalsy: true }) // Cho phép giá trị là "", null, undefined
  .isURL(),                      // Nhưng nếu nó CÓ GIÁ TRỊ, thì phải là URL
  body("is_active").optional().isInt({ min: 0, max: 1 }),
  body("role").not().exists(),
];

module.exports = {
  updateMeRules,
  changePasswordRules,
  listUsersQueryRules,
  adminUpdateProfileRules,
  adminActivateRules,
  createEmployeeRules,
};
