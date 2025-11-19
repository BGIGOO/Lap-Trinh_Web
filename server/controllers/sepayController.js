const db = require("../config/db");
require("dotenv").config();

/**
 * 📩 SePay Callback — xử lý thanh toán tự động
 * URL: POST /api/sepay/callback
 */
exports.sepayCallback = async (req, res) => {
    try {
        // 1️⃣ Xác thực API Key từ header
        const apiKey = req.headers.authorization?.replace("Apikey ", "");
        const expectedKey = process.env.SEPAY_API_KEY;

        if (!apiKey || apiKey !== expectedKey) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid API key",
            });
        }

        // 2️⃣ Lấy thông tin giao dịch từ body
        const {
            id,
            gateway,
            transactionDate,
            accountNumber,
            code,
            content,
            transferType,
            transferAmount,
            referenceCode,
        } = req.body;

        console.log("📩 SePay Callback received:", {
            id,
            gateway,
            transactionDate,
            accountNumber,
            transferType,
            transferAmount,
            content,
            referenceCode,
        });

        // 3️⃣ Chỉ xử lý tiền vào (in)
        if (transferType !== "in") {
            return res.status(200).json({
                success: true,
                message: "Transaction ignored (not inbound)",
            });
        }

        // 4️⃣ Lấy mã đơn hàng từ code hoặc content (VD: ORD202511140003)
        let orderCode = null;

        if (code && code.startsWith("ORD")) orderCode = code;
        if (!orderCode && content) {
            const match = content.match(/ORD\d+/i);
            if (match) orderCode = match[0];
        }

        if (!orderCode) {
            console.log("⚠️ Không tìm thấy mã đơn hàng trong nội dung:", content);
            return res.status(200).json({
                success: true,
                message: "Payment received but cannot match any order",
            });
        }

        // 5️⃣ Tìm order trong DB
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE order_code = ? LIMIT 1",
            [orderCode]
        );
        const order = orders[0];

        if (!order) {
            console.log("❌ Order not found:", orderCode);
            return res.status(200).json({
                success: true,
                message: `Order ${orderCode} not found`,
            });
        }

        // 6️⃣ Kiểm tra số tiền
        const expectedAmount = Number(order.final_price);
        const received = Number(transferAmount);

        if (received < expectedAmount) {
            console.log("⚠️ Số tiền thanh toán chưa đủ:", {
                orderCode,
                expectedAmount,
                received,
            });

            await db.query(
                "UPDATE orders SET payment_status = 'failed', note = CONCAT(IFNULL(note,''), '\\nThanh toán thiếu: ', ?) WHERE order_code = ?",
                [expectedAmount - received, orderCode]
            );

            return res.status(200).json({
                success: true,
                message: "Payment amount insufficient",
            });
        }

        // 7️⃣ Cập nhật order thành đã thanh toán
        await db.query(
            `UPDATE orders
             SET payment_status = 'paid',
                 order_status = 'processing',
                 note = CONCAT(IFNULL(note,''), '\\nThanh toán QR thành công. Giao dịch ID: ', ?),
                 updated_at = NOW()
             WHERE order_code = ?`,
            [id, orderCode]
        );

        console.log(`✅ Đơn hàng ${orderCode} cập nhật thành 'paid'`);

        res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            data: {
                order_code: orderCode,
                payment_status: "paid",
                order_status: "processing",
                transaction_id: id,
                amount: received,
            },
        });
    } catch (error) {
        console.error("❌ Error processing SePay callback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
