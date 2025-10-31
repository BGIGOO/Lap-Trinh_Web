const { body } = require("express-validator");

exports.voucherValidator = [
    body("code").notEmpty().withMessage("Mã voucher là bắt buộc"),
    body("discount_type")
        .isIn(["percent", "fixed"])
        .withMessage("Loại giảm giá phải là 'percent' hoặc 'fixed'"),
    body("discount_value")
        .isFloat({ min: 0 })
        .withMessage("Giá trị giảm phải là số dương"),
    body("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Số lượng không hợp lệ"),
];
