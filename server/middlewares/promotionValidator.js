const { body } = require("express-validator");

/**
 * Validate khi TẠO khuyến mãi
 */
exports.validateCreatePromotion = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Tiêu đề khuyến mãi là bắt buộc!")
    .isLength({ max: 255 })
    .withMessage("Tiêu đề khuyến mãi không được vượt quá 255 ký tự!"),

  body("blogContent")
    .trim()
    .notEmpty()
    .withMessage("Nội dung khuyến mãi là bắt buộc!")
    .isLength({ min: 10 })
    .withMessage("Nội dung khuyến mãi phải có ít nhất 10 ký tự!"),

  body("is_active")
    .optional({ checkFalsy: true }) // cho phép không truyền, mặc định true
    .isBoolean()
    .withMessage("Trạng thái is_active phải là true hoặc false!"),
];

/**
 * Validate khi CẬP NHẬT khuyến mãi
 */
exports.validateUpdatePromotion = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Tiêu đề khuyến mãi là bắt buộc!")
    .isLength({ max: 255 })
    .withMessage("Tiêu đề khuyến mãi không được vượt quá 255 ký tự!"),

  body("blogContent")
    .trim()
    .notEmpty()
    .withMessage("Nội dung khuyến mãi là bắt buộc!")
    .isLength({ min: 10 })
    .withMessage("Nội dung khuyến mãi phải có ít nhất 10 ký tự!"),

  body("is_active")
    .notEmpty()
    .withMessage("Trạng thái là bắt buộc!")
    .isBoolean()
    .withMessage("is_active phải là true hoặc false!"),
];
