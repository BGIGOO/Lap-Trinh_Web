const { body } = require("express-validator");

// Kiểm tra đầu vào tạo danh mục
exports.validateCreateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tên danh mục là bắt buộc!")
        .isLength({ max: 255 })
        .withMessage("Tên danh mục không được vượt quá 255 ký tự!"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Mô tả không được để trống!"),

    body("is_active")
        .notEmpty()
        .withMessage("Trạng thái hoạt động là bắt buộc!")
        .isInt({ min: 0, max: 1 })
        .withMessage("is_active chỉ được là 0 hoặc 1!"),

    body("priority")
        .notEmpty()
        .withMessage("Priority là bắt buộc!")
        .isNumeric()
        .withMessage("Priority phải là số!"),
];

// Kiểm tra đầu vào cập nhật danh mục
exports.validateUpdateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tên danh mục là bắt buộc!")
        .isLength({ max: 255 })
        .withMessage("Tên danh mục không được vượt quá 255 ký tự!"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Mô tả không được để trống!"),

    body("is_active")
        .notEmpty()
        .withMessage("Trạng thái hoạt động là bắt buộc!")
        .isInt({ min: 0, max: 1 })
        .withMessage("is_active chỉ được là 0 hoặc 1!"),

    body("priority")
        .notEmpty()
        .withMessage("Priority là bắt buộc!")
        .isNumeric()
        .withMessage("Priority phải là số!"),
];
