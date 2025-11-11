"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Cart() {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState(null);
    const [voucherInput, setVoucherInput] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(20000); // cố định hoặc có thể tính động
    const [loading, setLoading] = useState(false);
    const [voucherError, setVoucherError] = useState("");

    // 🧱 API base
    const API_URL = "http://localhost:3001/api";

    // 🧩 Lấy cart_id trong localStorage
    const getCartId = () => localStorage.getItem("cart_id");

    // 🟢 Gọi API lấy giỏ hàng
    const fetchCart = async () => {
        const cartId = getCartId();
        if (!cartId) return;

        try {
            const res = await axios.get(`${API_URL}/carts/${cartId}`);
            if (res.data?.success) {
                setCart(res.data.data);
                setItems(res.data.data.items || []);

                setDiscount(res.data.data.discount || 0);
                setAppliedVoucher(res.data.data.voucher_code || "");
            }
        } catch (err) {
            console.error("❌ Lỗi khi tải giỏ hàng:", err);
        }
    };

    // 🟢 Cập nhật số lượng (trên server)
    const updateQuantity = async (itemId, newQty) => {
        const cartId = getCartId();
        if (!cartId) return;

        try {
            await axios.put(`${API_URL}/carts/${cartId}/items/${itemId}`, {
                quantity: newQty,
            });
            fetchCart();
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật số lượng:", err);
        }
    };

    // 🟢 Xóa sản phẩm khỏi giỏ
    const removeItem = async (itemId) => {
        const cartId = getCartId();
        if (!cartId) return;

        try {
            await axios.delete(`${API_URL}/carts/${cartId}/items/${itemId}`);
            fetchCart();
        } catch (err) {
            console.error("❌ Lỗi khi xóa sản phẩm:", err);
        }
    };

    const applyVoucher = async () => {
        const cartId = getCartId();
        setVoucherError("");

        if (!cartId) {
            setVoucherError("Không tìm thấy giỏ hàng.");
            return;
        }
        if (!voucherInput.trim()) {
            setVoucherError("Vui lòng nhập mã voucher.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${API_URL}/carts/${cartId}/apply-voucher`,
                {
                    voucher_code: voucherInput,
                }
            );

            if (res.data?.success) {
                const { discount: discountValue } = res.data.data;
                setDiscount(discountValue);
                setVoucherError("");
                fetchCart();
            } else {
                setVoucherError(
                    res.data?.message || "Không thể áp dụng voucher."
                );
            }
        } catch (err) {
            console.error("❌ Lỗi khi áp dụng voucher:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Tăng / giảm local trước khi sync API
    const inc = (it) => updateQuantity(it.id, it.quantity + 1);
    const dec = (it) => {
        if (it.quantity > 1) updateQuantity(it.id, it.quantity - 1);
    };

    // 🧩 Tải dữ liệu ban đầu
    useEffect(() => {
        fetchCart();
    }, []);

    const totalQty = cart?.total_quantity || 0;
    const totalPrice = cart?.total_price || 0;

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <h1 className="text-2xl font-bold text-[#FC4126] mb-8">GIỎ HÀNG</h1>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
                {/* LEFT: CART ITEMS */}
                <div className="flex-1 bg-white border border-[#FC4126]/40 rounded-xl p-4 overflow-y-auto max-h-[400px]">
                    {!items.length ? (
                        <p className="text-gray-500 text-center py-8">
                            🛒 Giỏ hàng trống
                        </p>
                    ) : (
                        items.map((it) => (
                            <div
                                key={it.id}
                                className="flex items-center justify-between border-b border-[#FC4126]/20 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={`http://localhost:3001${it.image_url}`}
                                        alt={it.name}
                                        width={70}
                                        height={70}
                                        className="rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-[#FC4126]">
                                            {it.name}
                                        </h3>

                                        {it.options?.length > 0 && (
                                            <ul className="text-xs text-gray-500">
                                                {it.options.map(
                                                    (opt, i) =>
                                                        opt.quantity > 0 && (
                                                            <li key={i}>
                                                                <b>
                                                                    {
                                                                        opt.option_name
                                                                    }
                                                                </b>{" "}
                                                                ×{opt.quantity}
                                                            </li>
                                                        )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Quantity Control */}
                                    <div className="flex items-center bg-[#fff4f2] border border-[#FC4126]/30 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => dec(it)}
                                            className="px-3 py-2 text-[#FC4126] hover:bg-[#ffe6e1] cursor-pointer"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-medium text-[#FC4126]">
                                            {it.quantity}
                                        </span>
                                        <button
                                            onClick={() => inc(it)}
                                            className="px-3 py-2 text-[#FC4126] hover:bg-[#ffe6e1] cursor-pointer"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right font-semibold text-gray-700">
                                        {(
                                            it.price * it.quantity
                                        ).toLocaleString("vi-VN")}{" "}
                                        VND
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={() => removeItem(it.id)}
                                        className="text-gray-400 hover:text-[#FC4126] transition cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="w-full md:w-[350px] bg-[#fff4f2] rounded-xl p-4 flex flex-col justify-between h-fit">
                    {/* Nhập mã voucher */}
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={voucherInput}
                            onChange={(e) => setVoucherInput(e.target.value)}
                            placeholder="Điền mã voucher"
                            className="flex-1 px-3 py-2 text-sm border border-[#FC4126] rounded-l-full outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#ff6b47]"
                        />
                        <button
                            onClick={applyVoucher}
                            disabled={loading}
                            className={`px-4 py-2 rounded-r-full font-semibold text-sm cursor-pointer ${
                                loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#FC4126] text-white hover:bg-[#ff6b47]"
                            } transition-colors`}
                        >
                            {loading ? "..." : "Áp dụng"}
                        </button>
                    </div>

                    {/* 🔻 Thông báo lỗi voucher */}
                    {voucherError && (
                        <p className="text-red-500 text-sm mb-2">
                            {voucherError}
                        </p>
                    )}

                    {/* Hiển thị chi tiết giá */}
                    <div className="text-sm text-gray-700 space-y-2 mb-4">
                        {discount > 0 && (
                            <div className="flex justify-between text-[#FC4126] font-semibold text-base">
                                <span>{appliedVoucher}</span>
                                <span>
                                    -{discount.toLocaleString("vi-VN")} đ
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between border-t border-[#FC4126]/20 pt-2">
                            <span>Tổng</span>
                            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span>
                                    -{discount.toLocaleString("vi-VN")} đ
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span>Phí giao hàng</span>
                            <span>{shippingFee.toLocaleString("vi-VN")} đ</span>
                        </div>

                        <div className="flex justify-between font-semibold text-lg border-t border-[#FC4126]/20 pt-2">
                            <span>Tổng cộng</span>
                            <span className="text-[#FC4126]">
                                {(
                                    totalPrice -
                                    discount +
                                    shippingFee
                                ).toLocaleString("vi-VN")}{" "}
                                đ
                            </span>
                        </div>
                    </div>

                    {/* Nút thanh toán */}
                    <button className="w-full bg-[#FC4126] text-white font-bold py-2 rounded-full hover:bg-[#ff6347] transition cursor-pointer">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
}
