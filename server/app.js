const express = require("express");
const cors = require("cors");
const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const addonGroupRoutes = require("./routes/addonGroupRoutes");
const addonOptionRoutes = require("./routes/addonOptionRoutes");
const voucherRoutes = require("./routes/voucherRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addon-groups", addonGroupRoutes);
app.use("/api/addon-options", addonOptionRoutes);
app.use("/api/vouchers", voucherRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ message: "Không tìm thấy endpoint này!" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
    console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);
