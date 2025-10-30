const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const categoryController = require("../controllers/categoryController");
const {
    validateCreateCategory,
    validateUpdateCategory,
} = require("../middlewares/categoryValidator");
const { handleValidation } = require("../middlewares/validateResult");

// Cấu hình upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Lấy tất cả danh mục
router.get("/", categoryController.getAll);
// Tạo danh mục
router.post(
    "/",
    upload.single("image"),
    validateCreateCategory,
    handleValidation,
    categoryController.create
);
// Cập nhật danh mục
router.put(
    "/:id",
    upload.single("image"),
    validateUpdateCategory,
    handleValidation,
    categoryController.update
);

module.exports = router;
