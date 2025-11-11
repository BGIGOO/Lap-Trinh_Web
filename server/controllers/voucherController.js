const Voucher = require("../models/voucherModel");
const db = require("../config/db");

exports.getAll = async (req, res) => {
    const data = await Voucher.getAll();
    res.json({
        success: true,
        message: "Lấy danh sách voucher thành công",
        data,
    });
};

exports.getById = async (req, res) => {
    const voucher = await Voucher.getById(req.params.id);
    if (!voucher)
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy voucher" });

    const products = await Voucher.getProducts(req.params.id);
    res.json({
        success: true,
        message: "Lấy voucher thành công",
        data: { ...voucher, products },
    });
};

exports.create = async (req, res) => {
    try {
        const { product_ids, ...voucher } = req.body;
        const id = await Voucher.create(voucher, product_ids || []);
        res.status(201).json({
            success: true,
            message: "Thêm voucher thành công",
            data: { id },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm voucher",
        });
    }
};

exports.update = async (req, res) => {
    const ok = await Voucher.update(req.params.id, req.body);
    if (!ok)
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy voucher" });
    res.json({ success: true, message: "Cập nhật voucher thành công" });
};

exports.delete = async (req, res) => {
    const ok = await Voucher.delete(req.params.id);
    if (!ok)
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy voucher" });
    res.json({ success: true, message: "Xóa voucher thành công" });
};

exports.apply = async (req, res) => {
    try {
        const { cart_id, voucher_code } = req.body;

        if (!cart_id || !voucher_code) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu: cần cart_id và voucher_code",
            });
        }

        // 🔍 Lấy thông tin voucher
        const [rows] = await db.query("SELECT * FROM vouchers WHERE code = ?", [
            voucher_code,
        ]);
        const voucher = rows[0];
        if (!voucher)
            return res
                .status(404)
                .json({ success: false, message: "Mã voucher không tồn tại" });

        if (!voucher.is_active)
            return res
                .status(400)
                .json({ success: false, message: "Voucher đã bị vô hiệu hóa" });

        // ⏳ Kiểm tra thời hạn
        const now = new Date();
        const start = new Date(voucher.start_date);
        const end = voucher.end_date ? new Date(voucher.end_date) : null;
        if (now < start)
            return res.status(400).json({
                success: false,
                message: "Voucher chưa bắt đầu hiệu lực",
            });
        if (end && now > end)
            return res
                .status(400)
                .json({ success: false, message: "Voucher đã hết hạn" });

        // 📦 Lấy giỏ hàng + sản phẩm
        const [cartRows] = await db.query("SELECT * FROM carts WHERE id = ?", [
            cart_id,
        ]);
        const cart = cartRows[0];
        if (!cart)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy giỏ hàng" });

        const [cartItems] = await db.query(
            "SELECT product_id, quantity, price FROM cart_items WHERE cart_id = ?",
            [cart_id]
        );

        if (!cartItems.length)
            return res
                .status(400)
                .json({ success: false, message: "Giỏ hàng trống" });

        // 💰 Tính tổng đơn hàng
        const total_amount = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        // 🧮 Kiểm tra giá trị tối thiểu
        if (total_amount < voucher.min_order_value) {
            return res.status(400).json({
                success: false,
                message: `Đơn hàng phải có giá trị tối thiểu ${voucher.min_order_value.toLocaleString()}đ`,
            });
        }

        // 💵 Tính tiền giảm
        let discount = 0;
        if (voucher.discount_type === "percent") {
            discount = (total_amount * voucher.discount_value) / 100;
            if (
                voucher.max_discount_value &&
                discount > voucher.max_discount_value
            ) {
                discount = voucher.max_discount_value;
            }
        } else if (voucher.discount_type === "fixed") {
            discount = voucher.discount_value;
        }

        const finalAmount = Math.max(total_amount - discount, 0);

        // 🔄 Cập nhật cart
        await db.query(
            "UPDATE carts SET voucher_code = ?, discount = ?, final_price = ? WHERE id = ?",
            [voucher.code, discount, finalAmount, cart_id]
        );

        // ✅ Trả kết quả
        res.json({
            success: true,
            message: "Áp dụng voucher thành công",
            data: {
                voucher_code: voucher.code,
                discount_type: voucher.discount_type,
                discount_value: Number(voucher.discount_value),
                discount_applied: discount,
                total_before: total_amount,
                total_after: finalAmount,
            },
        });
    } catch (error) {
        console.error("❌ Voucher error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi áp dụng voucher",
        });
    }
};
