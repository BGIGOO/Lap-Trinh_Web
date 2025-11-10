// middlewares/emailThrottle.js
// Throttle per email cho /forgot-password: tối đa 5 lần/giờ/email
const bucket = new Map(); // key: email -> { count, resetAt }

function emailThrottle(limit = 5, windowMs = 60 * 60 * 1000) {
  return (req, res, next) => {
    const email = (req.body?.email || '').toLowerCase().trim();
    if (!email) return next(); // không có email -> bỏ qua

    const now = Date.now();
    const rec = bucket.get(email);

    if (!rec || rec.resetAt < now) {
      bucket.set(email, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (rec.count >= limit) {
      return res.status(429).json({
        success: false, // vẫn trả 200/true cũng được, nhưng 429 cho client control tốt hơn
        message: 'Nếu email hợp lệ, hướng dẫn đặt lại mật khẩu đã được gửi.'
      });
    }

    rec.count += 1;
    return next();
  };
}

module.exports = {
  forgotEmailThrottle: emailThrottle(5, 60 * 60 * 1000),
};
