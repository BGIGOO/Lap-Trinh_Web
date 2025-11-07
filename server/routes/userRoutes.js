const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  // self
  updateMeRules,
  changePasswordRules,
  // list/filter
  listUsersQueryRules,
  // generic (không dùng :id)
  genericUpdateProfileRules,
  genericChangePasswordRules,
  genericActivateRules,
  // create employee
  createEmployeeRules,
} = require("../middlewares/userValidator");

// ---- Self service (GIỮ NGUYÊN HÀNH VI HIỆN TẠI) ----
router.get("/me", protect, userController.getMe);
router.put("/me", protect, updateMeRules, userController.updateMe);
router.patch("/me/password", protect, changePasswordRules, userController.changeMyPassword);

// ---- Admin: danh sách ----
router.get("/customers", protect, authorize(1), listUsersQueryRules, userController.listCustomers);
router.get("/employees", protect, authorize(1), listUsersQueryRules, userController.listEmployees);

// ---- Admin: thêm nhân viên mới (role=2, ép cứng ở BE) ----
router.post("/employees", protect, authorize(1), createEmployeeRules, userController.createEmployee);

// ---- Generic: KHÔNG dùng :id, BE tự lấy từ token; Admin có thể chỉ định id trong body ----
router.put("/profile", protect, genericUpdateProfileRules, userController.genericUpdateProfile);
router.patch("/password", protect, genericChangePasswordRules, userController.genericChangePassword);
router.patch("/activate", protect, authorize(1), genericActivateRules, userController.genericActivate);

module.exports = router;
