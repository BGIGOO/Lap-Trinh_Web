const { validationResult } = require("express-validator");

exports.handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            data: errors.array().map((e) => ({
                field: e.path,
                msg: e.msg,
            })),
        });
    }
    next();
};
