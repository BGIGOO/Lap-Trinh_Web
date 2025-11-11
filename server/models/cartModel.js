const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// 🟢 Hàm tạo UUID cho cart
exports.createCart = async (userId = null) => {
    const cartId = uuidv4();
    await db.query(
        "INSERT INTO carts (id, user_id, total_quantity, total_price, discount, final_price) VALUES (?, ?, 0, 0, 0, 0)",
        [cartId, userId]
    );
    return cartId;
};

// 🟢 Lấy giỏ hàng theo ID
exports.getCartById = async (id) => {
    const [rows] = await db.query("SELECT * FROM carts WHERE id = ?", [id]);
    return rows[0];
};

// 🟢 Lấy danh sách sản phẩm trong giỏ (có options)
exports.getCartItems = async (cartId) => {
    const [rows] = await db.query(
        `SELECT ci.*, p.name, p.image_url, p.sale_price, p.original_price
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ?`,
        [cartId]
    );

    return rows.map((r) => ({
        id: r.id,
        product_id: r.product_id,
        name: r.name,
        image_url: r.image_url,
        quantity: r.quantity,
        price: Number(r.price),
        sale_price: Number(r.sale_price),
        original_price: Number(r.original_price),
        options: r.options_json ? JSON.parse(r.options_json) : [],
    }));
};

// 🟢 Thêm sản phẩm (có options)
exports.addItem = async (cartId, productId, quantity, price, options = []) => {
    // 1️⃣ Tạo hash duy nhất dựa trên options
    const normalizedOptions = JSON.stringify(options);
    const hash = crypto
        .createHash("md5")
        .update(normalizedOptions)
        .digest("hex");

    // 2️⃣ Kiểm tra xem có item trùng product + hash không
    const [existing] = await db.query(
        "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND options_hash = ?",
        [cartId, productId, hash]
    );

    if (existing.length > 0) {
        // ✅ Nếu trùng → tăng quantity
        await db.query(
            "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
            [quantity, existing[0].id]
        );
    } else {
        // ✅ Nếu khác → thêm mới
        await db.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity, price, options_json, options_hash)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [cartId, productId, quantity, price, normalizedOptions, hash]
        );
    }

    await exports.recalculateCart(cartId);
};

// 🟢 Cập nhật số lượng
exports.updateItem = async (cartId, itemId, quantity) => {
    await db.query(
        "UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?",
        [quantity, itemId, cartId]
    );
    await exports.recalculateCart(cartId);
};

// 🟢 Xóa sản phẩm
exports.deleteItem = async (cartId, itemId) => {
    await db.query("DELETE FROM cart_items WHERE id = ? AND cart_id = ?", [
        itemId,
        cartId,
    ]);
    await exports.recalculateCart(cartId);
};

// 🟢 Tính lại tổng giỏ hàng
exports.recalculateCart = async (cartId) => {
    const [rows] = await db.query(
        `SELECT SUM(quantity) AS total_quantity, 
                SUM(quantity * price) AS total_price 
         FROM cart_items WHERE cart_id = ?`,
        [cartId]
    );

    const { total_quantity = 0, total_price = 0 } = rows[0] || {};
    await db.query(
        `UPDATE carts 
         SET total_quantity = ?, 
             total_price = ?, 
             final_price = total_price - discount 
         WHERE id = ?`,
        [total_quantity || 0, total_price || 0, cartId]
    );
};

// 🟢 Áp dụng voucher
exports.applyVoucher = async (cartId, voucherCode, discount) => {
    await db.query(
        `UPDATE carts 
         SET voucher_code = ?, 
             discount = ?, 
             final_price = total_price - ? 
         WHERE id = ?`,
        [voucherCode, discount, discount, cartId]
    );
};
