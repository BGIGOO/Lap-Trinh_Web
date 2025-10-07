const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecret";
const ISSUER = process.env.JWT_ISSUER || "fastfood-api";
const AUD = process.env.JWT_AUDIENCE || "fastfood-client";

function signAccessToken(payload) {
  return jwt.sign(payload, SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
    issuer: ISSUER,
    audience: AUD,
  });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { signAccessToken, verifyAccessToken };