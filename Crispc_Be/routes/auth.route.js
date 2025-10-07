const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
require("dotenv").config();

// // Giới hạn 5 lần/10 phút theo IP
// const loginLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: "Too many login attempts, try again later." }
// });

// Tạm thời hỗ trợ cả mật khẩu plain (để migrate dần)
async function verifyPassword(input, stored) {
  if (typeof stored === "string" && stored.startsWith("$2")) {
    return bcrypt.compare(input, stored); // bcrypt hash
  }
  return input === stored; // <-- chỉ dùng trong giai đoạn chuyển đổi
}

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findOne({ where: { username } });

    // Giảm rò rỉ timing: thêm độ trễ nhỏ trước khi trả lỗi
    await new Promise(r => setTimeout(r, 120));

    const ok = user ? await verifyPassword(password, user.password) : false;
    if (!ok) {
      // Thông báo chung, không lộ user tồn tại hay không
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: String(user.acc_id), username: user.username, role_id: user.role_id },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h", issuer: "fastfood-api", audience: "fastfood-client" }
    );

    res.json({ token });
  } catch (err) {
  console.error('Login error:', {
    message: err?.message,
    code: err?.original?.code,
    errno: err?.original?.errno,
    address: err?.original?.address,
    port: err?.original?.port
  });
  res.status(500).json({ message: "Server error" });
}
});

module.exports = router;