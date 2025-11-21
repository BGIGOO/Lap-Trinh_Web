const { body } = require("express-validator");

exports.validateCreateOrder = [
    body("cart_id")
        .notEmpty()
        .withMessage("Thiếu cart_id.")
        .isUUID()
        .withMessage("cart_id không hợp lệ."),

    body("customer.name")
        .trim()
        .notEmpty()
        .withMessage("Tên khách hàng là bắt buộc.")
        .isLength({ max: 255 })
        .withMessage("Tên khách hàng không được quá 255 ký tự."),

    body("customer.phone")
        .trim()
        .notEmpty()
        .withMessage("Số điện thoại là bắt buộc.")
        .matches(/^(0|\+84)[0-9]{7,8}$/)
        .withMessage("Số điện thoại không hợp lệ."),

    body("customer.address")
        .trim()
        .notEmpty()
        .withMessage("Địa chỉ giao hàng là bắt buộc."),

    body("payment_method")
        .notEmpty()
        .withMessage("Phương thức thanh toán là bắt buộc.")
        .isIn(["cod", "qr"])
        .withMessage(
            "Phương thức thanh toán không hợp lệ (chỉ hỗ trợ cod hoặc qr)."
        ),

    body("note")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Ghi chú không được vượt quá 500 ký tự."),
];
