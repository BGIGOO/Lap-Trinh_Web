const db = require("../config/db");

// 1. Tìm user theo ID
exports.findById = async (id) => {
  const [rows] = await db.query('CALL sp_get_user_by_id(?)', [id]);
  return rows[0][0] || null;
};

// 2. Lấy hash password (để đổi pass)
exports.getPasswordHash = async (userId) => {
  const [rows] = await db.query('CALL sp_get_password_hash(?)', [userId]);
  return rows[0][0]?.password_hash || null;
};

// 3. Update Password
exports.updatePassword = async (userId, newHash) => {
  await db.query('CALL sp_change_password(?, ?)', [userId, newHash]);
};

// 4. Check trùng lặp khi Update (Trừ bản thân ra)
exports.findDupForUpdate = async (email, phone, userId) => {
  const [rows] = await db.query(
    'CALL sp_check_update_conflict(?, ?, ?)', 
    [userId, email, phone]
  );
  return rows[0]; // Trả về mảng các user bị trùng
};

// 5. Update Profile (User tự sửa)
// Chỉ truyền các field user được phép, còn lại null
exports.updateProfile = async (userId, { name, phone, address, avatar, birthday, sex }) => {
  const [rows] = await db.query(
    'CALL sp_update_profile(?, ?, ?, ?, ?, ?, ?, ?)',
    [
      userId, 
      name, 
      phone, 
      address, 
      avatar, 
      birthday, 
      sex, 
      null // is_active: user thường không được sửa cái này -> truyền NULL
    ]
  );
  return rows[0][0].affected;
};

// 6. Admin Update User (Sửa hết)
exports.adminUpdateUser = async (userId, { name, phone, address, avatar, birthday, sex, is_active }) => {
  const [rows] = await db.query(
    'CALL sp_update_profile(?, ?, ?, ?, ?, ?, ?, ?)',
    [
      userId, 
      name, 
      phone, 
      address, 
      avatar, 
      birthday, 
      sex, 
      is_active // Admin được quyền truyền giá trị vào đây
    ]
  );
  return rows[0][0].affected;
};

// 7. List Users (Search)
exports.listUsers = async ({ role, keyword, is_active, page, limit }) => {
  const offset = (page - 1) * limit;
  
  // rows[0] là kết quả list, rows[1] là kết quả count total
  const [rows] = await db.query(
    'CALL sp_search_users(?, ?, ?, ?, ?)',
    [role, keyword || null, is_active, limit, offset]
  );

  const list = rows[0];
  const total = rows[1][0].total;

  return { rows: list, total };
};

// 8. Tạo Employee
exports.createEmployee = async ({ name, email, password_hash, phone, address, avatar, birthday, sex, is_active }) => {
  const [rows] = await db.query(
    'CALL sp_create_employee(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, password_hash, phone, address, avatar, birthday, sex, is_active]
  );
  return { id: rows[0][0].new_id };
};

// Helper check duplicate create (Dùng lại SP check register conflict ở bài authModel)
exports.findDupForCreate = async (email, phone) => {
   // Lưu ý: sp_check_register_conflict đã tạo ở bài trước
   const [rows] = await db.query('CALL sp_check_register_conflict(?, ?)', [email, phone]);
   return rows[0];
};