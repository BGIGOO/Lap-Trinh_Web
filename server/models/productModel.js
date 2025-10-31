const db = require("../config/db");

exports.getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
};

exports.getBySlug = async (slug) => {
    const [rows] = await db.query("SELECT * FROM products WHERE slug = ?", [
        slug,
    ]);
    return rows[0];
};

exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT * FROM products ORDER BY priority DESC, id DESC"
    );
    return rows;
};

exports.getByCategory = async (category_id) => {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE category_id = ?",
        [category_id]
    );
    return rows;
};

exports.create = async (data) => {
    const {
        category_id,
        name,
        slug,
        original_price,
        sale_price,
        description,
        image_url,
        is_active,
        priority,
    } = data;
    const [result] = await db.query(
        `INSERT INTO products (category_id ,name, slug, original_price, sale_price, description, image_url, is_active, priority)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            category_id,
            name,
            slug,
            original_price,
            sale_price,
            description,
            image_url,
            is_active ?? true,
            priority ?? 100,
        ]
    );
    return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
    const {
        category_id,
        name,
        slug,
        original_price,
        sale_price,
        description,
        image_url,
        is_active,
        priority,
    } = data;
    const [result] = await db.query(
        `UPDATE products SET category_id=?, name=?, slug=?, original_price=?, sale_price=?, description=?, image_url=?, is_active=?, priority=? WHERE id=?`,
        [
            category_id,
            name,
            slug,
            original_price,
            sale_price,
            description,
            image_url,
            is_active,
            priority,
            id,
        ]
    );
    return result.affectedRows > 0;
};
