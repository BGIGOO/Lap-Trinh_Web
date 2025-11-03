const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // 1. Import cookie-parser

// --- Khởi tạo ---
dotenv.config(); // 3. Đọc file .env NGAY TỪ ĐẦU
const app = express();

// --- Lấy các routes bạn đã có ---
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const addonGroupRoutes = require("./routes/addonGroupRoutes");
const addonOptionRoutes = require("./routes/addonOptionRoutes");
const voucherRoutes = require("./routes/voucherRoutes");

// (Chúng ta sẽ thêm authRoutes ở bước sau)
const authRoutes = require("./routes/authRoutes");

// --- Middlewares ---
// 4. Cấu hình CORS
const corsOptions = {
    origin: process.env.CLIENT_URL, // Chỉ cho phép domain của Next.js gọi
    credentials: true, // Cho phép gửi cookie
};
app.use(cors(corsOptions));

// 5. Thêm cookie-parser
app.use(cookieParser());

// Giúp Express đọc được JSON và form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file tĩnh từ thư mục 'uploads'
app.use("/uploads", express.static("uploads"));

// --- Routes ---
// API của bạn
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addon-groups", addonGroupRoutes);
app.use("/api/addon-options", addonOptionRoutes);
app.use("/api/vouchers", voucherRoutes);

// (API xác thực chúng ta sẽ thêm ở đây)
app.use("/api/auth", authRoutes);

// --- Xử lý 404 ---
app.use((req, res) => {
    res.status(404).json({ message: "Không tìm thấy endpoint này!" });
});

// --- Khởi động server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
