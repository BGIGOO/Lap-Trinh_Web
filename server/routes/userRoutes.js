const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  // self (giữ nguyên)
  updateMeRules,
  changePasswordRules,
  // list với các filter mới
  listUsersQueryRules,
  // admin update “profile” hộ người khác (BẮT BUỘC id)
  adminUpdateProfileRules,
  // admin activate (toggle) – chỉ cần id, cấm id=1
  adminActivateRules,
  // create employee
  createEmployeeRules,
} = require("../middlewares/userValidator");

// ===== Self service (đừng chạm logic cũ của bạn) =====
router.get("/me", protect, userController.getMe);
router.put("/me", protect, updateMeRules, userController.updateMe);
router.patch("/me/password", protect, changePasswordRules, userController.changeMyPassword);

// ===== Admin: list khách hàng/nhân viên (filter mới) =====
router.get("/customers", protect, authorize(1), listUsersQueryRules, userController.listCustomers);
router.get("/employees", protect, authorize(1), listUsersQueryRules, userController.listEmployees);

// ===== Admin: thêm nhân viên mới =====
router.post("/employees", protect, authorize(1), createEmployeeRules, userController.createEmployee);

// ===== Admin: cập nhật hồ sơ người khác (bắt buộc id trong body) =====
router.put("/profile", protect, authorize(1), adminUpdateProfileRules, userController.adminUpdateProfile);

// ===== Admin: kích hoạt / vô hiệu (toggle) – chỉ cần id, cấm id=1 =====
router.patch("/activate", protect, authorize(1), adminActivateRules, userController.adminActivateToggle);

module.exports = router;
