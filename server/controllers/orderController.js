const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

exports.createOrder = async (req, res) => {
    try {
        const { cart_id, customer, payment_method, note } = req.body;
        if (
            !cart_id ||
            !customer?.name ||
            !customer?.phone ||
            !customer?.address
        )
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin cần thiết để đặt hàng.",
            });

        const cart = await Cart.getCartById(cart_id);
        if (!cart)
            return res
                .status(404)
                .json({ success: false, message: "Giỏ hàng không tồn tại." });

        const items = await Cart.getCartItems(cart_id);
        if (!items.length)
            return res
                .status(400)
                .json({ success: false, message: "Giỏ hàng trống." });

        const orderData = {
            user_id: cart.user_id,
            cart_id,
            customer_name: customer.name,
            customer_phone: customer.phone,
            customer_email: customer.email,
            customer_address: customer.address,
            total_price: Number(cart.total_price),
            discount: Number(cart.discount || 0),
            shipping_fee: 20000,
            final_price: Number(cart.final_price) + 20000,
            voucher_code: cart.voucher_code,
            payment_method,
            note,
        };

        const orderCode = await Order.createOrder(orderData, items);

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: {
                order_code: orderCode,
                ...orderData,
            },
        });
    } catch (err) {
        console.error("❌ Lỗi khi tạo đơn hàng:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo đơn hàng.",
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.getOrderById(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy đơn hàng." });
        res.json({ success: true, data: order });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy đơn hàng.",
        });
    }
};

exports.getOrderStatus = async (req, res) => {
    try {
        const { order_code } = req.params;

        const order = await Order.getOrderStatus(order_code);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }

        res.json({
            success: true,
            message: "Lấy trạng thái đơn hàng thành công",
            data: order,
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy trạng thái đơn hàng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy trạng thái đơn hàng",
        });
    }
};


exports.getOrdersByUser = async (req, res) => {
    try {
        const data = await Order.getOrdersByUser(req.params.userId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách đơn hàng.",
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const ok = await Order.updateStatus(req.params.id, req.body.status);
        if (!ok)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy đơn hàng." });
        res.json({
            success: true,
            message: "Cập nhật trạng thái đơn hàng thành công.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật trạng thái.",
        });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const ok = await Order.updatePayment(req.params.id, req.body.status);
        if (!ok)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy đơn hàng." });
        res.json({
            success: true,
            message: "Cập nhật trạng thái thanh toán thành công.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật thanh toán.",
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const ok = await Order.deleteOrder(req.params.id);
        if (!ok)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy đơn hàng." });
        res.json({ success: true, message: "Xóa đơn hàng thành công." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa đơn hàng.",
        });
    }
};

exports.getAllOrders = async (req, res) => {
  try {
    const data = await Order.getAllOrders();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Lỗi lấy tất cả đơn hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

