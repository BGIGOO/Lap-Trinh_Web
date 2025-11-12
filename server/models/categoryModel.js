const db = require("../config/db");

exports.getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
        id,
    ]);
    return rows[0];
};

exports.getBySlug = async (slug) => {
    const [rows] = await db.query("SELECT * FROM categories WHERE slug = ?", [
        slug,
    ]);
    return rows[0];
};

// Lấy tất cả danh mục
exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT * FROM categories ORDER BY priority DESC, id DESC"
    );
    return rows;
};

// Tạo danh mục
exports.create = async (data) => {
    const { name, description, slug, image_url, is_active, priority } = data;
    const [result] = await db.query(
        `INSERT INTO categories (name, description, slug, image_url, is_active, priority)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, slug, image_url, is_active ?? 1, priority ?? 0]
    );
    return { id: result.insertId, ...data };
};


// Cập nhật danh mục
exports.update = async (id, data) => {
    let { name, description, slug, image_url, is_active, priority } = data;

    // Nếu không có ảnh mới, để image_url = null để MySQL dùng IFNULL giữ nguyên ảnh cũ
    if (!image_url || image_url === "") {
        image_url = null;
    }

    const [result] = await db.query(
        `UPDATE categories 
         SET name=?, description=?, slug=?, 
             image_url=IFNULL(?, image_url), 
             is_active=?, priority=? 
         WHERE id=?`,
        [name, description, slug, image_url, is_active ?? 1, priority ?? 0, id]
    );

    return result.affectedRows > 0;
};

