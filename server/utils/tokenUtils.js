const jwt = require('jsonwebtoken');

/**
 * Tạo Access Token (ngắn hạn)
 * @param {number} userId - ID của user
 * @param {number} role - Role ID của user (từ bảng users)
 */
const generateAccessToken = (userId, role, expiresIn) => {
  const opts = {};
  if (expiresIn) opts.expiresIn = expiresIn;
  else opts.expiresIn = process.env.JWT_ACCESS_EXPIRES;
  return jwt.sign(
    { userId, role }, // payload
    process.env.JWT_SECRET,
    opts
  );
};

/**
 * Tạo Refresh Token (dài hạn)
 * @param {number} userId - ID của user
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId }, // Nội dung chỉ cần userId
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
};

// Hàm tính toán thời gian hết hạn (để lưu vào DB)
const getRefreshTokenExpires = () => {
  const msInDay = 24 * 60 * 60 * 1000;
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES.replace('d', ''));
  return new Date(Date.now() + days * msInDay);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpires
};