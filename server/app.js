const express = require("express");
const cors = require("cors");
const app = express();

const categoryRoutes = require("./routes/categoryRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/categories", categoryRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ message: "Không tìm thấy endpoint này!" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
    console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);
