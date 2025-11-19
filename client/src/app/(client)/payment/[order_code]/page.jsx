"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export default function PaymentPage() {
    const { order_code } = useParams();
    const router = useRouter();

    const [status, setStatus] = useState("pending");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!order_code) return;

        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders/${order_code}/status`);
                if (res.data?.success) {
                    setStatus(res.data.data.payment_status);
                    setAmount(res.data.data.final_price);
                }
            } catch (err) {
                console.error("❌ Lỗi khi lấy trạng thái:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 10000); // 🔁 Kiểm tra mỗi 10s
        return () => clearInterval(interval);
    }, [order_code]);

    // 🔁 Khi thanh toán xong → tự redirect
    useEffect(() => {
        if (status === "paid") {
            setTimeout(() => {
                router.push(`/order-success/${order_code}`);
            }, 2000);
        }
    }, [status, router, order_code]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-10">
                Đang tải thông tin đơn hàng...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
            <h1 className="text-3xl font-bold text-[#FC4126] mb-3">
                Thanh toán đơn hàng
            </h1>
            <p className="text-gray-600 mb-2">
                Mã đơn hàng: <b>{order_code}</b>
            </p>
            <p className="text-gray-700 mb-5">
                Số tiền: <b>{Number(amount).toLocaleString("vi-VN")} đ</b>
            </p>

            {status === "paid" ? (
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                Thanh toán thành công!
            </h1>
            ) : (
                <>
                    <img
                        src={`https://qr.sepay.vn/img?acc=VQRQAFHGS9881&bank=MBBank&amount=${amount}&des=${order_code}`}
                        alt="QR Code"
                        className="w-64 h-64 rounded-xl border border-gray-300 mb-4"
                    />
                    <p className="text-gray-500 text-sm">
                        Quét mã QR để thanh toán qua MBBank / MoMo / ZaloPay
                    </p>
                    <p className="text-orange-500 mt-4 font-semibold animate-pulse">
                        Đang chờ xác nhận thanh toán...
                    </p>
                </>
            )}
        </div>
    );
}
