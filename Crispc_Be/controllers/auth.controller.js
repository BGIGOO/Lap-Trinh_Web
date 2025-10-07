const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input" });
  }
  const result = await authService.login(username, password);
  return res.json(result); // { token }
};