const db = require("../config/db");

// 🟢 Tạo đơn hàng mới
exports.createOrder = async (orderData, items) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [max] = await conn.query("SELECT COUNT(*) AS count FROM orders");
        const orderCode = `ORD${new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")}${(max[0].count + 1)
            .toString()
            .padStart(4, "0")}`;

        const [result] = await conn.query(
            `INSERT INTO orders (
        order_code, user_id, cart_id,
        customer_name, customer_phone, customer_email, customer_address,
        total_price, discount, shipping_fee, final_price,
        voucher_code, payment_method, payment_status, order_status, note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderCode,
                orderData.user_id || null,
                orderData.cart_id || null,
                orderData.customer_name,
                orderData.customer_phone,
                orderData.customer_email || null,
                orderData.customer_address,
                orderData.total_price,
                orderData.discount || 0,
                orderData.shipping_fee || 20000,
                orderData.final_price,
                orderData.voucher_code || null,
                orderData.payment_method || "cod",
                "pending",
                "pending",
                orderData.note || null,
            ]
        );

        const orderId = result.insertId;

        // copy items sang order_items
        for (const it of items) {
            await conn.query(
                `INSERT INTO order_items (order_id, product_id, product_name, image_url, quantity, price, options_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    it.product_id,
                    it.name,
                    it.image_url,
                    it.quantity,
                    it.price,
                    JSON.stringify(it.options || []),
                ]
            );
        }

        await conn.commit();
        return orderCode;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

// 🟢 Lấy đơn hàng theo ID hoặc Code
exports.getOrderById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM orders WHERE id = ? OR order_code = ?",
        [id, id]
    );
    if (!rows.length) return null;

    const order = rows[0];
    const [items] = await db.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id]
    );

    return {
        ...order,
        items: items.map((it) => ({
            ...it,
            options_json: it.options_json ? JSON.parse(it.options_json) : [],
        })),
    };
};

// 🟢 Lấy tất cả đơn hàng
exports.getAllOrders = async () => {
    const [rows] = await db.query(`
        SELECT *
        FROM orders
        ORDER BY created_at DESC
    `);
    return rows;
};


exports.getOrderStatus = async (orderCode) => {
     const [rows] = await db.query(
            `SELECT order_code, payment_status, order_status, final_price 
             FROM orders 
             WHERE order_code = ? 
             LIMIT 1`,
            [orderCode]
        );
        return rows[0] || null;
};

// 🟢 Lấy danh sách đơn hàng theo user
exports.getOrdersByUser = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

// 🟢 Cập nhật trạng thái đơn hàng
exports.updateStatus = async (id, status) => {
    const [result] = await db.query(
        "UPDATE orders SET order_status = ? WHERE id = ?",
        [status, id]
    );
    return result.affectedRows > 0;
};

// 🟢 Cập nhật trạng thái thanh toán
exports.updatePayment = async (id, status) => {
    const [result] = await db.query(
        "UPDATE orders SET payment_status = ? WHERE id = ?",
        [status, id]
    );
    return result.affectedRows > 0;
};

// 🟢 Xóa đơn hàng
exports.deleteOrder = async (id) => {
    const [result] = await db.query("DELETE FROM orders WHERE id = ?", [id]);
    return result.affectedRows > 0;
};
