const db = require("../config/db");

// Lấy toàn bộ voucher
exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT * FROM vouchers ORDER BY created_at DESC"
    );
    return rows;
};

// Lấy voucher theo ID
exports.getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM vouchers WHERE id = ?", [id]);
    return rows[0];
};

// Thêm voucher + danh sách product liên kết
exports.create = async (voucher, productIds = []) => {
    const [result] = await db.query(
        `INSERT INTO vouchers 
     (code, name, description, discount_type, discount_value, min_order_value,
      max_discount_value, quantity, start_date, end_date, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            voucher.code,
            voucher.name,
            voucher.description,
            voucher.discount_type,
            voucher.discount_value,
            voucher.min_order_value,
            voucher.max_discount_value,
            voucher.quantity,
            voucher.start_date,
            voucher.end_date,
            voucher.is_active,
        ]
    );

    const voucherId = result.insertId;
    if (productIds.length > 0) {
        const values = productIds.map((pid) => [voucherId, pid]);
        await db.query(
            "INSERT INTO voucher_products (voucher_id, product_id) VALUES ?",
            [values]
        );
    }

    return voucherId;
};

// Cập nhật voucher
exports.update = async (id, voucher) => {
    const [result] = await db.query(
        `UPDATE vouchers SET code=?, name=?, description=?, discount_type=?, discount_value=?, 
     min_order_value=?, max_discount_value=?, quantity=?, start_date=?, end_date=?, is_active=?,
     updated_at=NOW() WHERE id=?`,
        [
            voucher.code,
            voucher.name,
            voucher.description,
            voucher.discount_type,
            voucher.discount_value,
            voucher.min_order_value,
            voucher.max_discount_value,
            voucher.quantity,
            voucher.start_date,
            voucher.end_date,
            voucher.is_active,
            id,
        ]
    );
    return result.affectedRows > 0;
};

// Xóa voucher
exports.delete = async (id) => {
    const [result] = await db.query("DELETE FROM vouchers WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// Lấy sản phẩm thuộc voucher
exports.getProducts = async (voucherId) => {
    const [rows] = await db.query(
        `SELECT p.* 
     FROM products p
     JOIN voucher_products vp ON p.id = vp.product_id
     WHERE vp.voucher_id = ?`,
        [voucherId]
    );
    return rows;
};
