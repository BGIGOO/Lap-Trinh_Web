const User = require("../models/User");
const { verifyPassword } = require("../utils/password");
const { signAccessToken } = require("../utils/jwt");

exports.login = async (username, password) => {
  const user = await User.findOne({ where: { username } });

  // giảm side-channel timing
  await new Promise((r) => setTimeout(r, 120));

  const ok = user ? await verifyPassword(password, user.password) : false;
  if (!ok) {
    const e = new Error("Invalid credentials");
    e.status = 401;
    throw e;
  }

  // chỉ trả JWT cho FE (như bạn yêu cầu)
  const token = signAccessToken({
    sub: String(user.acc_id),
    username: user.username,
    role_id: user.role_id,
  });

  return { token };
};