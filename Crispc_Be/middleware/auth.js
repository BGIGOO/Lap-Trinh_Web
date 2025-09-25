const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      // Check role
      if (roles.length && !roles.includes(decoded.role_id)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      req.user = decoded;
      next();
    });
  };
};