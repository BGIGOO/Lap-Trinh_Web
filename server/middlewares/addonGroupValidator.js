const { body } = require("express-validator");

exports.validateCreateAddonGroup = [
    body("product_id")
        .notEmpty()
        .withMessage("product_id là bắt buộc!")
        .isInt()
        .withMessage("product_id phải là số!"),
    body("name").notEmpty().withMessage("Tên nhóm là bắt buộc!"),
    body("min_total_quantity")
        .isInt({ min: 0 })
        .withMessage("Số lượng tối thiểu phải là số nguyên >= 0"),
    body("max_total_quantity")
        .isInt({ min: 1 })
        .withMessage("Số lượng tối đa phải >= 1"),
    body("priority")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm"),
    body("is_hidden")
        .isBoolean()
        .withMessage("is_hidden phải là true hoặc false"),
];

exports.validateUpdateAddonGroup = [
    body("name").notEmpty().withMessage("Tên nhóm là bắt buộc!"),
    body("min_total_quantity")
        .isInt({ min: 0 })
        .withMessage("Số lượng tối thiểu phải là số nguyên >= 0"),
    body("max_total_quantity")
        .isInt({ min: 1 })
        .withMessage("Số lượng tối đa phải >= 1"),
    body("priority")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm"),
    body("is_hidden")
        .isBoolean()
        .withMessage("is_hidden phải là true hoặc false"),
];
