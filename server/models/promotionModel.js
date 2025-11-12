const db = require("../config/db");

// Lấy danh sách promotion đang active
exports.getAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM promotions WHERE is_active = TRUE ORDER BY id DESC"
  );
  return rows;
};

// Lấy tất cả (kể cả bị ẩn) – dùng cho admin
exports.getAllAdmin = async () => {
  const [rows] = await db.query("SELECT * FROM promotions ORDER BY id DESC");
  return rows;
};

// Lấy theo ID
exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM promotions WHERE id = ?", [id]);
  return rows[0];
};

// Lấy theo slug
exports.getBySlug = async (slug) => {
  const [rows] = await db.query("SELECT * FROM promotions WHERE slug = ?", [
    slug,
  ]);
  return rows[0];
};

// Tạo mới
exports.create = async (data) => {
  const { title, blogContent, imageUrl, slug } = data;
  const [result] = await db.query(
    `INSERT INTO promotions (title, blogContent, imageUrl, slug)
         VALUES (?, ?, ?, ?)`,
    [title, blogContent, imageUrl, slug]
  );
  return { id: result.insertId, ...data };
};

// Cập nhật
exports.update = async (id, data) => {
  const { title, blogContent, imageUrl, slug, is_active } = data;
  const [result] = await db.query(
    `UPDATE promotions 
         SET title=?, blogContent=?, imageUrl=?, slug=?, is_active=? 
         WHERE id=?`,
    [title, blogContent, imageUrl, slug, is_active ?? true, id]
  );
  return result.affectedRows > 0;
};

// Ẩn 
exports.deactivate = async (id) => {
  const [result] = await db.query(
    "UPDATE promotions SET is_active = FALSE WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

exports.activate = async (id) => {
  const [result] = await db.query(
    "UPDATE promotions SET is_active = TRUE WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};
