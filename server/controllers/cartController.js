const Cart = require("../models/cartModel");
const db = require("../config/db");

// ✅ Tạo giỏ hàng mới
exports.createCart = async (req, res) => {
    try {
        const { user_id } = req.body;
        const cartId = await Cart.createCart(user_id);
        res.status(201).json({
            success: true,
            message: "Tạo giỏ hàng thành công",
            data: { cart_id: cartId, user_id },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tạo giỏ hàng",
        });
    }
};

// ✅ Lấy chi tiết giỏ hàng
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.getCartById(req.params.id);
        if (!cart)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy giỏ hàng" });

        const items = await Cart.getCartItems(req.params.id);

        res.json({
            success: true,
            message: "Lấy giỏ hàng thành công",
            data: { ...cart, items },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy giỏ hàng",
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { cart_id } = req.params;

        if (!cart_id) {
            return res.status(400).json({
                success: false,
                message: "Thiếu cart_id",
            });
        }

        await Cart.deleteCartById(cart_id);

        res.json({
            success: true,
            message: "Đã xóa giỏ hàng thành công",
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa giỏ hàng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa giỏ hàng",
        });
    }
};

// ✅ Thêm sản phẩm
exports.addItem = async (req, res) => {
    try {
        const cartId = req.params.id;
        const { product_id, quantity, price, options } = req.body;

        if (!product_id || !quantity || !price) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu bắt buộc (product_id, quantity, price)",
            });
        }

        await Cart.addItem(cartId, product_id, quantity, price, options || []);

        const cart = await Cart.getCartById(cartId);
        const items = await Cart.getCartItems(cartId);

        res.json({
            success: true,
            message: "Thêm sản phẩm vào giỏ thành công",
            data: {
                cart_id: cartId,
                total_quantity: cart.total_quantity,
                total_price: cart.total_price,
                final_price: cart.final_price,
                items,
            },
        });
    } catch (err) {
        console.error("❌ Lỗi khi thêm sản phẩm vào giỏ:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm sản phẩm vào giỏ",
        });
    }
};

// ✅ Cập nhật số lượng
exports.updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        await Cart.updateItem(req.params.id, req.params.itemId, quantity);
        res.json({
            success: true,
            message: "Cập nhật số lượng sản phẩm thành công",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật số lượng sản phẩm",
        });
    }
};

// ✅ Xóa sản phẩm
exports.deleteItem = async (req, res) => {
    try {
        await Cart.deleteItem(req.params.id, req.params.itemId);
        res.json({
            success: true,
            message: "Xóa sản phẩm khỏi giỏ thành công",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa sản phẩm",
        });
    }
};

// ✅ Áp dụng voucher
exports.applyVoucher = async (req, res) => {
    try {
        const { voucher_code } = req.body;
        const cartId = req.params.id;

        // 🔍 Lấy giỏ hàng
        const cart = await Cart.getCartById(cartId);
        if (!cart)
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giỏ hàng",
            });

        // Nếu đã có voucher, không áp dụng lại
        if (cart.voucher_code && cart.voucher_code === voucher_code) {
            return res.status(200).json({
                success: false,
                message: "Mã voucher này đã được bạn sử dụng trước đó rồi",
                data: {
                    code: cart.voucher_code,
                    discount: Number(cart.discount),
                    total_before: Number(cart.total_price),
                    total_after: Number(cart.final_price),
                },
            });
        }

        // 🔍 Lấy thông tin voucher
        const [vouchers] = await db.query(
            "SELECT * FROM vouchers WHERE code = ?",
            [voucher_code]
        );
        const voucher = vouchers[0];
        if (!voucher)
            return res.status(200).json({
                success: false,
                message: "Mã voucher này không tồn tại rồi",
            });

        if (!voucher.is_active)
            return res
                .status(200)
                .json({ success: false, message: "Voucher đã bị vô hiệu hóa" });

        // ⏳ Kiểm tra thời hạn
        const now = new Date();
        if (now < new Date(voucher.start_date))
            return res.status(200).json({
                success: false,
                message: "Voucher chưa bắt đầu hiệu lực",
            });
        if (voucher.end_date && now > new Date(voucher.end_date))
            return res
                .status(200)
                .json({ success: false, message: "Voucher đã hết hạn" });

        // 💰 Nếu chưa có voucher, tính mới
        const total = Number(cart.total_price);
        let discount = 0;

        if (voucher.discount_type === "percent") {
            discount = (total * voucher.discount_value) / 100;
            if (
                voucher.max_discount_value &&
                discount > voucher.max_discount_value
            ) {
                discount = voucher.max_discount_value;
            }
        } else {
            discount = voucher.discount_value;
        }

        const finalPrice = Math.max(total - discount, 0);

        // 🔄 Cập nhật giỏ hàng
        await Cart.applyVoucher(cartId, voucher.code, discount);

        res.json({
            success: true,
            message: "Áp dụng voucher thành công",
            data: {
                code: voucher.code,
                discount,
                total_before: total,
                total_after: finalPrice,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi áp dụng voucher",
        });
    }
};
