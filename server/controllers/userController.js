const { pool } = require('../config/db');

/**
 * @desc    Lấy thông tin profile của user đang đăng nhập
 * @route   GET /api/users/me
 * @access  Private (Phải đăng nhập)
 */
const getMe = async (req, res) => {
  // Chúng ta có 'req.user' là nhờ middleware 'protect'
  const userId = req.user.userId; 

  let connection;
  try {
    connection = await pool.getConnection();

    // Dùng userId (từ token) để lấy thông tin MỚI NHẤT từ DB
    const [rows] = await connection.query(
      'SELECT id, name, username, email, phone, role, avatar FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.json(rows[0]); // Trả về thông tin user

  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    res.status(500).json({ message: 'Lỗi hệ thống.' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  getMe,
};
