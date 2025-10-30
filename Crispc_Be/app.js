require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connection = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT;
const host = process.env.HOST_NAME;
app.use(
  cors({
    origin: "http://localhost:3000", // chỉ cho phép domain này
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // nếu bạn dùng cookie / auth
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/categories", (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ---------------------- REGISTER ----------------------
app.post("/api/register", (req, res) => {
  const { name, email, phone, password, role = 0 } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Thiếu email hoặc password" });

  // kiểm tra tồn tại
  connection.query(
    "SELECT id FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      if (results.length > 0)
        return res
          .status(400)
          .json({ message: "Email hoặc số điện thoại đã tồn tại" });

      const hash = await bcrypt.hash(password, 10);
      
      connection.query(
        "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, hash, role],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: "Đăng ký thất bại" });
          }
          res.json({ message: "Đăng ký thành công" });
        }
      );
    }
  );
});

// ---------------------- LOGIN ----------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      if (results.length === 0)
        return res.status(400).json({ message: "Email không tồn tại" });

      const user = results[0];
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
    }
  );
});

// ---------------------- VERIFY TOKEN ----------------------
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Thiếu token" });

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = decoded;
    next();
  });
}

// ---------------------- ADMIN ONLY ----------------------
app.get("/api/admin", verifyToken, (req, res) => {
  if (req.user.role < 1)
    return res.status(403).json({ message: "Không có quyền admin" });
  res.json({ message: "Chào Admin, truy cập hợp lệ!", user: req.user });
});

app.listen(port, host, () => console.log("sever is running"));
