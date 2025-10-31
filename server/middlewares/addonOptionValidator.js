const { body } = require("express-validator");

exports.validateCreateAddonOption = [
    body("addon_group_id")
        .notEmpty()
        .withMessage("addon_group_id là bắt buộc!")
        .isInt()
        .withMessage("addon_group_id phải là số!"),
    body("name").notEmpty().withMessage("Tên tùy chọn là bắt buộc!"),
    body("max_quantity")
        .isInt({ min: 1 })
        .withMessage("max_quantity phải >= 1"),
    body("min_quantity")
        .isInt({ min: 0 })
        .withMessage("min_quantity phải >= 0"),
    body("priority")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm"),
    body("is_default")
        .isBoolean()
        .withMessage("is_default phải là true hoặc false"),
    body("is_hidden")
        .isBoolean()
        .withMessage("is_hidden phải là true hoặc false"),
];

exports.validateUpdateAddonOption = [
    body("name").notEmpty().withMessage("Tên tùy chọn là bắt buộc!"),
    body("max_quantity")
        .isInt({ min: 1 })
        .withMessage("max_quantity phải >= 1"),
    body("min_quantity")
        .isInt({ min: 0 })
        .withMessage("min_quantity phải >= 0"),
    body("priority")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm"),
    body("is_default")
        .isBoolean()
        .withMessage("is_default phải là true hoặc false"),
    body("is_hidden")
        .isBoolean()
        .withMessage("is_hidden phải là true hoặc false"),
];
