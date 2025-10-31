const db = require("../config/db");

exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT * FROM addon_options ORDER BY priority DESC, id DESC"
    );
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM addon_options WHERE id = ?", [
        id,
    ]);
    return rows[0];
};

exports.getByGroup = async (addon_group_id) => {
    const [rows] = await db.query(
        "SELECT * FROM addon_options WHERE addon_group_id = ?",
        [addon_group_id]
    );
    return rows;
};

exports.create = async (data) => {
    const {
        addon_group_id,
        name,
        max_quantity,
        min_quantity,
        is_default,
        priority,
        is_hidden,
    } = data;
    const [result] = await db.query(
        `INSERT INTO addon_options (addon_group_id, name, max_quantity, min_quantity, is_default, priority, is_hidden)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            addon_group_id,
            name,
            max_quantity,
            min_quantity,
            is_default,
            priority,
            is_hidden,
        ]
    );
    return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
    const {
        name,
        max_quantity,
        min_quantity,
        is_default,
        priority,
        is_hidden,
    } = data;
    const [result] = await db.query(
        `UPDATE addon_options SET name=?, max_quantity=?, min_quantity=?, is_default=?, priority=?, is_hidden=? WHERE id=?`,
        [name, max_quantity, min_quantity, is_default, priority, is_hidden, id]
    );
    return result.affectedRows > 0;
};

exports.remove = async (id) => {
    const [result] = await db.query("DELETE FROM addon_options WHERE id = ?", [
        id,
    ]);
    return result.affectedRows > 0;
};
