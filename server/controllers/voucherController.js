const Voucher = require("../models/voucherModel");

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
        const { code, cart_items, total_amount } = req.body;

        if (!code || !cart_items || cart_items.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Thiếu dữ liệu: cần có mã voucher và danh sách sản phẩm trong giỏ hàng",
            });
        }

        // Tìm voucher theo mã
        const [rows] = await db.query("SELECT * FROM vouchers WHERE code = ?", [
            code,
        ]);
        const voucher = rows[0];

        if (!voucher)
            return res
                .status(404)
                .json({ success: false, message: "Mã voucher không tồn tại" });

        // Kiểm tra trạng thái hoạt động
        if (!voucher.is_active)
            return res.status(400).json({
                success: false,
                message: "Mã voucher đã bị vô hiệu hóa",
            });

        // Kiểm tra hạn sử dụng
        const now = new Date();
        const start = new Date(voucher.start_date);
        const end = new Date(voucher.end_date);
        if (now < start)
            return res.status(400).json({
                success: false,
                message: "Voucher chưa bắt đầu hiệu lực",
            });
        if (end && now > end)
            return res
                .status(400)
                .json({ success: false, message: "Voucher đã hết hạn" });

        // Kiểm tra số lượng mã còn lại
        if (voucher.used_count >= voucher.quantity)
            return res
                .status(400)
                .json({ success: false, message: "Voucher đã được dùng hết" });

        // Lấy danh sách sản phẩm áp dụng cho voucher (nếu có)
        const [voucherProducts] = await db.query(
            "SELECT product_id FROM voucher_products WHERE voucher_id = ?",
            [voucher.id]
        );
        const productIds = voucherProducts.map((v) => v.product_id);

        // Kiểm tra sản phẩm trong giỏ có được áp dụng không
        let eligibleItems = [];
        if (productIds.length > 0) {
            eligibleItems = cart_items.filter((item) =>
                productIds.includes(item.product_id)
            );
            if (eligibleItems.length === 0)
                return res.status(400).json({
                    success: false,
                    message:
                        "Voucher không áp dụng cho sản phẩm nào trong giỏ hàng",
                });
        } else {
            eligibleItems = cart_items; // Áp dụng toàn bộ
        }

        // Kiểm tra giá trị tối thiểu
        if (total_amount < voucher.min_order_value) {
            return res.status(400).json({
                success: false,
                message: `Đơn hàng phải có giá trị tối thiểu ${voucher.min_order_value.toLocaleString()}đ`,
            });
        }

        // Tính tiền giảm
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

        // Trả kết quả
        res.json({
            success: true,
            message: "Áp dụng voucher thành công",
            data: {
                code: voucher.code,
                discount_type: voucher.discount_type,
                discount_value: voucher.discount_value,
                discount_applied: discount,
                total_before: total_amount,
                total_after: finalAmount,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi áp dụng voucher",
        });
    }
};
