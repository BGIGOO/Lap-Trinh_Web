const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { handleValidation } = require("../middlewares/validateResult");
const {
    createCartValidator,
    addItemValidator,
    updateItemValidator,
    deleteItemValidator,
    applyVoucherValidator,
} = require("../middlewares/cartValidator");

// 🟢 Tạo giỏ hàng
router.post(
    "/",
    createCartValidator,
    handleValidation,
    cartController.createCart
);

// 🟢 Lấy giỏ hàng
router.get("/:id", cartController.getCart);

router.delete("/:cart_id", cartController.deleteCart);

// 🟢 Thêm sản phẩm
router.post(
    "/:id/items",
    addItemValidator,
    handleValidation,
    cartController.addItem
);

// 🟢 Cập nhật số lượng
router.put(
    "/:id/items/:itemId",
    updateItemValidator,
    handleValidation,
    cartController.updateItem
);

// 🟢 Xóa sản phẩm
router.delete(
    "/:id/items/:itemId",
    deleteItemValidator,
    handleValidation,
    cartController.deleteItem
);

// 🟢 Áp dụng voucher
router.post(
    "/:id/apply-voucher",
    applyVoucherValidator,
    handleValidation,
    cartController.applyVoucher
);

module.exports = router;
