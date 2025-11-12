const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const promotionController = require("../controllers/promotionController");
const {
  validateCreatePromotion,
  validateUpdatePromotion,
} = require("../middlewares/promotionValidator");
const { handleValidation } = require("../middlewares/validateResult");

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// Routes
router.get("/", promotionController.getAll);
router.get("/:id", promotionController.getById);

router.post(
  "/",
  upload.single("imageUrl"),
  validateCreatePromotion,
  handleValidation,
  promotionController.create
);


router.put(
  "/:id",
  upload.single("imageUrl"),
  validateUpdatePromotion,
  handleValidation,
  promotionController.update
);


// Ẩn khuyến mãi (soft delete)
router.put("/:id/deactivate", promotionController.deactivate);

// 🔁 Khôi phục khuyến mãi (admin)
router.put("/:id/activate", promotionController.activate);

module.exports = router;
