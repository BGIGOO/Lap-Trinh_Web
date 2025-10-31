const { body } = require("express-validator");

exports.validateCreateProduct = [
    body("category_id")
        .notEmpty()
        .withMessage("category_id là bắt buộc!")
        .isInt()
        .withMessage("category_id phải là số!"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tên sản phẩm là bắt buộc!")
        .isLength({ max: 255 })
        .withMessage("Tên sản phẩm không được vượt quá 255 ký tự!"),

    body("original_price")
        .notEmpty()
        .withMessage("Giá gốc là bắt buộc!")
        .isNumeric()
        .withMessage("Giá gốc phải là số hợp lệ!")
        .custom((v) => v >= 0)
        .withMessage("Giá gốc không được âm!"),

    body("sale_price")
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage("Giá khuyến mãi phải là số!")
        .custom((v, { req }) => {
            if (v && Number(v) > Number(req.body.original_price)) {
                throw new Error("Giá khuyến mãi không được lớn hơn giá gốc!");
            }
            return true;
        }),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Mô tả sản phẩm là bắt buộc!"),

    body("is_active")
        .notEmpty()
        .withMessage("Trạng thái là bắt buộc!")
        .isBoolean()
        .withMessage("is_active phải là true hoặc false!"),

    body("priority")
        .notEmpty()
        .withMessage("Priority là bắt buộc!")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm!"),
];

exports.validateUpdateProduct = [
    body("category_id")
        .notEmpty()
        .withMessage("category_id là bắt buộc!")
        .isInt()
        .withMessage("category_id phải là số!"),
    ,
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tên sản phẩm là bắt buộc!")
        .isLength({ max: 255 })
        .withMessage("Tên sản phẩm không được vượt quá 255 ký tự!"),

    body("original_price")
        .notEmpty()
        .withMessage("Giá gốc là bắt buộc!")
        .isNumeric()
        .withMessage("Giá gốc phải là số hợp lệ!")
        .custom((v) => v >= 0)
        .withMessage("Giá gốc không được âm!"),

    body("sale_price")
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage("Giá khuyến mãi phải là số!")
        .custom((v, { req }) => {
            if (v && Number(v) > Number(req.body.original_price)) {
                throw new Error("Giá khuyến mãi không được lớn hơn giá gốc!");
            }
            return true;
        }),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Mô tả sản phẩm là bắt buộc!"),

    body("is_active")
        .notEmpty()
        .withMessage("Trạng thái là bắt buộc!")
        .isBoolean()
        .withMessage("is_active phải là true hoặc false!"),

    body("priority")
        .notEmpty()
        .withMessage("Priority là bắt buộc!")
        .isInt({ min: 0 })
        .withMessage("Priority phải là số nguyên không âm!"),
];
