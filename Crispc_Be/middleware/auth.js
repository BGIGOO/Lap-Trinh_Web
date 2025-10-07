const { verifyAccessToken } = require("../utils/jwt");

module.exports = function authenticate(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });

  const payload = verifyAccessToken(token);
  if (!payload) return res.status(403).json({ message: "Invalid or expired token" });

  req.user = payload; // { sub, username, role_id }
  next();
};