const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");
const {
    validateCreateProduct,
    validateUpdateProduct,
} = require("../middlewares/productValidator");
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

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.get("/category/:category_id", productController.getByCategory);
router.post(
    "/",
    upload.single("image_url"),
    validateCreateProduct,
    handleValidation,
    productController.create
);
router.put(
    "/:id",
    upload.single("image_url"),
    validateUpdateProduct,
    handleValidation,
    productController.update
);

module.exports = router;
