const bcrypt = require("bcryptjs");

// tạm hỗ trợ plain để migrate dần; PRODUCTION nên bỏ nhánh plain
async function verifyPassword(input, stored) {
  if (typeof stored === "string" && stored.startsWith("$2")) {
    return bcrypt.compare(input, stored);
  }
  return input === stored;
}

module.exports = { verifyPassword };