const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { validateCreateOrder } = require("../middlewares/orderValidator");
const { handleValidation } = require("../middlewares/validateResult");

// 🟢 Tạo đơn hàng
router.post(
    "/",
    validateCreateOrder,
    handleValidation,
    orderController.createOrder
);

// 🟢 Xem chi tiết đơn hàng
router.get("/:id", orderController.getOrder);

// 🟢 Danh sách đơn của user
router.get("/user/:userId", orderController.getOrdersByUser);

// 🟢 Cập nhật trạng thái đơn hàng (admin)
router.patch("/:id/status", orderController.updateStatus);

// 🟢 Cập nhật trạng thái thanh toán (sau khi thanh toán thành công)
router.patch("/:id/payment", orderController.updatePayment);

// 🟢 Xóa / Hủy đơn hàng
router.delete("/:id", orderController.deleteOrder);

router.get("/:order_code/status", orderController.getOrderStatus);

module.exports = router;
