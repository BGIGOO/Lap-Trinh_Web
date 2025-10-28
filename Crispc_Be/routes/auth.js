import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 🟩 Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role = 0 } = req.body;

    const [exist] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );
    if (exist.length > 0)
      return res
        .status(400)
        .json({ message: "Email hoặc số điện thoại đã tồn tại" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, hash, role]
    );

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🟧 Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Email không tồn tại" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🟦 Middleware xác thực token
export function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Không có token" });

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = user;
    next();
  });
}

// 🟥 Middleware phân quyền (vd: chỉ admin role >=1)
export function requireAdmin(req, res, next) {
  if (req.user.role < 1)
    return res.status(403).json({ message: "Không có quyền truy cập" });
  next();
}

export default router;
