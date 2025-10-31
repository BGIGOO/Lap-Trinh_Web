const db = require("../config/db");

exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT * FROM addon_groups ORDER BY priority DESC, id DESC"
    );
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM addon_groups WHERE id = ?", [
        id,
    ]);
    return rows[0];
};

exports.getByProduct = async (product_id) => {
    const [rows] = await db.query(
        "SELECT * FROM addon_groups WHERE product_id = ?",
        [product_id]
    );
    return rows;
};

exports.create = async (data) => {
    const {
        product_id,
        name,
        description,
        note,
        min_total_quantity,
        max_total_quantity,
        priority,
        is_hidden,
    } = data;
    const [result] = await db.query(
        `INSERT INTO addon_groups (product_id, name, description, note, min_total_quantity, max_total_quantity, priority, is_hidden)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            product_id,
            name,
            description,
            note,
            min_total_quantity,
            max_total_quantity,
            priority,
            is_hidden,
        ]
    );
    return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
    const {
        name,
        description,
        note,
        min_total_quantity,
        max_total_quantity,
        priority,
        is_hidden,
    } = data;
    const [result] = await db.query(
        `UPDATE addon_groups SET name=?, description=?, note=?, min_total_quantity=?, max_total_quantity=?, priority=?, is_hidden=? WHERE id=?`,
        [
            name,
            description,
            note,
            min_total_quantity,
            max_total_quantity,
            priority,
            is_hidden,
            id,
        ]
    );
    return result.affectedRows > 0;
};

exports.remove = async (id) => {
    const [result] = await db.query("DELETE FROM addon_groups WHERE id = ?", [
        id,
    ]);
    return result.affectedRows > 0;
};
