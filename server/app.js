require('dotenv').config(); // Phải ở dòng đầu tiên
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Đã có
const { pool, checkDbConnection } = require('./config/db'); // Đã có

const app = express();

// --- Cấu hình Middleware ---
const corsOptions = {
  origin: process.env.CLIENT_URL, // Chỉ cho phép Next.js gọi
  credentials: true, // Cho phép gửi cookie
};
app.use(cors(corsOptions));
app.use(express.json());       // Để đọc req.body (JSON)
app.use(cookieParser());     // Để đọc req.cookies (cho refresh/logout)
app.use('/uploads', express.static('uploads')); // Đã có

// --- Routes (API Endpoints) ---
// (Các route cũ của bạn)
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addonGroupRoutes = require('./routes/addonGroupRoutes');
const addonOptionRoutes = require('./routes/addonOptionRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
// (Route xác thực chúng ta đã làm)
const authRoutes = require('./routes/authRoutes');
// (Route VÍ DỤ MỚI)
const userRoutes = require('./routes/userRoutes'); // <--- 1. REQUIRE FILE MỚI

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addon-groups', addonGroupRoutes);
app.use('/api/addon-options', addonOptionRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // <--- 2. SỬ DỤNG ROUTE MỚI

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint này!' });
});

// --- Khởi động server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
  checkDbConnection(); // Kiểm tra kết nối DB
});