const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Đọc các biến môi trường
dotenv.config();

// Tạo một "pool" kết nối để quản lý nhiều kết nối cùng lúc
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm để kiểm tra kết nối khi server khởi động
const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Đã kết nối thành công đến MySQL!');
    connection.release(); // Trả kết nối về lại cho pool
  } catch (error) {
    console.error('❌ Không thể kết nối đến database:', error.message);
  }
};

// Xuất pool và hàm kiểm tra để file app.js có thể dùng
module.exports = {
  pool,
  checkDbConnection
};

