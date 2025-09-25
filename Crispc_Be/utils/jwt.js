import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecret";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h", algorithm: "HS256" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}