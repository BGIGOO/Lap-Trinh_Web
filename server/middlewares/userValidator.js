const { body, query } = require("express-validator");

// ====== Self (/me) ======
const updateMeRules = [
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body("avatar").optional().isURL(),
  body("role").not().exists(),
  body("is_active").not().exists(),
  body("password_hash").not().exists(),
];

const changePasswordRules = [
  body("old_password").isLength({ min: 6 }),
  body("new_password").isLength({ min: 8 }),
];

// ====== List filter (customers/employees) ======
const listUsersQueryRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("search").optional().isString().trim(),
  query("is_active").optional().isIn(["0", "1"]).toInt(),
  query("sort").optional().custom((v) => /^([a-z_]+):(asc|desc)$/i.test(v))
    .withMessage("sort không hợp lệ (vd: created_at:desc)"),
];

// ====== Generic (không :id) ======
const genericUpdateProfileRules = [
  body("id").optional().isInt({ min: 1 }).toInt(), // admin có thể cập nhật hộ
  body("name").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail(),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body("avatar").optional().isURL(),
  body("is_active").optional().isInt({ min: 0, max: 1 }), // chỉ admin mới được, check ở controller
  body("role").not().exists(),
  body("password_hash").not().exists(),
];

const genericChangePasswordRules = [
  body("id").optional().isInt({ min: 1 }).toInt(),       // admin reset cho NV
  body("old_password").optional().isString(),            // self sẽ bắt buộc trong controller
  body("new_password").isLength({ min: 8 }),
];

const genericActivateRules = [
  body("id").isInt({ min: 1 }).toInt(),                  // bắt buộc chỉ định user mục tiêu
  body("is_active").optional().isInt({ min: 0, max: 1 }),// nếu không gửi -> toggle
];

// ====== Create employee ======
const createEmployeeRules = [
  body("name").isLength({ min: 1, max: 100 }),
  body("username").isLength({ min: 3, max: 100 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("phone").optional().isLength({ min: 8, max: 20 }),
  body("address").optional().isLength({ max: 255 }),
  body("avatar").optional().isURL(),
  body("is_active").optional().isInt({ min: 0, max: 1 }),
  body("role").not().exists(), // role ép cứng ở BE
];

module.exports = {
  updateMeRules,
  changePasswordRules,
  listUsersQueryRules,
  genericUpdateProfileRules,
  genericChangePasswordRules,
  genericActivateRules,
  createEmployeeRules,
};
