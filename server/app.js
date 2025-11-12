const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// --- Khởi tạo ---
dotenv.config();
const app = express();

// --- Lấy các routes bạn đã có ---
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const addonGroupRoutes = require("./routes/addonGroupRoutes");
const addonOptionRoutes = require("./routes/addonOptionRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const promotionRoutes = require("./routes/promotionRoutes");


// --- Middlewares ---
const corsOptions = {
  origin: process.env.CLIENT_URL, // Domain frontend (Next.js)
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev")); // ghi log request cho tiện debug

// --- Khai báo route ---
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addon-groups", addonGroupRoutes);
app.use("/api/addon-options", addonOptionRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/promotions", promotionRoutes);
// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint này!" });
});

// --- Khởi động server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});

console.log("✅ CLIENT_URL loaded:", process.env.CLIENT_URL);
