const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../utils/asyncHandler");
const ctrl = require("../controllers/auth.controller");

// 5 lần / 10 phút
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 999,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, try again later." },
});

router.post("/auth/login", loginLimiter, asyncHandler(ctrl.login));

module.exports = router;