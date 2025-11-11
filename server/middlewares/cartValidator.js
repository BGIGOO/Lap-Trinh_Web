const { body, param } = require("express-validator");

// 🟢 Tạo giỏ hàng
exports.createCartValidator = [
    body("user_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("user_id phải là số nguyên hợp lệ"),
];

// 🟢 Thêm sản phẩm vào giỏ
exports.addItemValidator = [
    param("id").isUUID().withMessage("cart_id không hợp lệ (phải là UUID)"),
    body("product_id")
        .isInt({ min: 1 })
        .withMessage("product_id là bắt buộc và phải là số nguyên dương"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Số lượng phải là số nguyên >= 1"),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Giá sản phẩm phải là số hợp lệ"),
];

// 🟢 Cập nhật số lượng sản phẩm trong giỏ
exports.updateItemValidator = [
    param("id").isUUID().withMessage("cart_id không hợp lệ (phải là UUID)"),
    param("itemId").isInt({ min: 1 }).withMessage("item_id không hợp lệ"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Số lượng phải là số nguyên >= 1"),
];

// 🟢 Xóa sản phẩm khỏi giỏ
exports.deleteItemValidator = [
    param("id").isUUID().withMessage("cart_id không hợp lệ (phải là UUID)"),
    param("itemId").isInt({ min: 1 }).withMessage("item_id không hợp lệ"),
];

// 🟢 Áp dụng voucher cho giỏ hàng
exports.applyVoucherValidator = [
    param("id").isUUID().withMessage("cart_id không hợp lệ (phải là UUID)"),
    body("voucher_code")
        .notEmpty()
        .withMessage("voucher_code là bắt buộc")
        .isString()
        .withMessage("voucher_code phải là chuỗi"),
];
