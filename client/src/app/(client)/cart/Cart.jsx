"use client";
import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddressPopup from "@/components/AddressPopup";

export default function Cart() {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState(null);
    const [voucherInput, setVoucherInput] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [voucherError, setVoucherError] = useState("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const router = useRouter();
    const API_URL = "http://localhost:3001/api";
    const STORE_LOCATION = { lat: 10.8061, lon: 106.6368 };

    // 🧱 Lấy cart_id
    const getCartId = () => localStorage.getItem("cart_id");

    // 🧮 Khoảng cách Haversine
    const calcDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // 🟢 Lấy giỏ hàng
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

    // 🧭 Khi người dùng chọn địa chỉ
    const handleAddressSelect = (addr) => {
        setAddress(addr);
        localStorage.setItem("address", JSON.stringify(addr));

        const dist = calcDistance(
            STORE_LOCATION.lat,
            STORE_LOCATION.lon,
            addr.lat,
            addr.lon
        );

        if (dist <= 10) setShippingFee(20000);
        else setShippingFee(0);
    };

    // 🧩 Áp dụng voucher
    const applyVoucher = async () => {
        const cartId = getCartId();
        if (!cartId) return setVoucherError("Không tìm thấy giỏ hàng.");
        if (!voucherInput.trim()) return setVoucherError("Vui lòng nhập mã voucher.");

        setLoading(true);
        setVoucherError("");
        try {
            const res = await axios.post(`${API_URL}/carts/${cartId}/apply-voucher`, {
                voucher_code: voucherInput,
            });

            if (res.data?.success) {
                setDiscount(res.data.data.discount);
                setAppliedVoucher(voucherInput);
                fetchCart();
            } else {
                setVoucherError(res.data?.message || "Không thể áp dụng voucher.");
            }
        } catch (err) {
            console.error("❌ Lỗi khi áp dụng voucher:", err);
            setVoucherError("Lỗi khi áp dụng voucher.");
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Cập nhật số lượng
    const updateQuantity = async (itemId, newQty) => {
        const cartId = getCartId();
        if (!cartId) return;
        try {
            await axios.put(`${API_URL}/carts/${cartId}/items/${itemId}`, {
                quantity: newQty,
            });
            fetchCart();
        } catch (err) {
            console.error("❌ Lỗi cập nhật số lượng:", err);
        }
    };

    const removeItem = async (itemId) => {
    const cartId = getCartId();
    if (!cartId) return;

    try {
        // Xóa sản phẩm trong giỏ hàng
        await axios.delete(`${API_URL}/carts/${cartId}/items/${itemId}`);

        // Lấy lại giỏ hàng sau khi xóa
        const res = await axios.get(`${API_URL}/carts/${cartId}`);
        const currentItems = res.data?.data?.items || [];

        if (currentItems.length === 0) {
            // Nếu giỏ hàng rỗng -> xóa luôn trong DB
            await axios.delete(`${API_URL}/carts/${cartId}`);
            // Xóa cart_id khỏi localStorage
            localStorage.removeItem("cart_id");
            // Reset state
            setCart(null);
            setItems([]);
            setAppliedVoucher("");
            setDiscount(0);
            setShippingFee(0);
        } else {
            // Cập nhật state nếu vẫn còn sản phẩm
            setCart(res.data.data);
            setItems(currentItems);
        }
    } catch (err) {
        console.error("❌ Lỗi xóa sản phẩm hoặc giỏ hàng:", err);
    }
    };

    const inc = (it) => updateQuantity(it.id, it.quantity + 1);
    const dec = (it) => it.quantity > 1 && updateQuantity(it.id, it.quantity - 1);

    // 🧭 Load địa chỉ từ localStorage khi mở trang
    useEffect(() => {
        const saved = localStorage.getItem("address");
        if (saved) {
            const parsed = JSON.parse(saved);
            setAddress(parsed);

            const dist = calcDistance(
                STORE_LOCATION.lat,
                STORE_LOCATION.lon,
                parsed.lat,
                parsed.lon
            );
            setShippingFee(dist <= 10 ? 20000 : 0);
        }
        fetchCart();
    }, []);

    const totalPrice = Number(cart?.total_price || 0);
    const totalAmount = totalPrice - discount + shippingFee;

    const goToCheckout = () => {
        if (!address)
            return setVoucherError("⚠️ Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.");
        router.push("/checkout");
    };

    return (
        <div className="flex flex-col items-center justify-center py-10">
             {!items.length ? (
                       <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-2 text-[#FC4126]">
                Giỏ hàng trống
            </h2>
            <p className="text-sm mb-6 max-w-md leading-relaxed">
                Hiện tại bạn chưa đặt món nào trong giỏ hàng cả.
                <br />
                Dạo quanh chọn món nhé bạn ơi, ở đây nhiều món ngon lắm :)
            </p>
            <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-[#FC4126] hover:bg-[#ff6347] text-white font-semibold rounded-full transition cursor-pointer"
            >
                Tiếp tục mua hàng
            </button>
        </div>
                    ) : (
                        <>
                        <h1 className="text-2xl font-bold text-[#FC4126] mb-8">GIỎ HÀNG</h1>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
                {/* LEFT: CART ITEMS */}
                <div className="flex-1 bg-white border border-[#FC4126]/40 rounded-xl p-4 overflow-y-auto max-h-[400px]">
                    {!items.length ? (
                        <p className="text-gray-500 text-center py-8">🛒 Giỏ hàng trống</p>
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
                                        <h3 className="font-semibold text-[#FC4126]">{it.name}</h3>
                                        {it.options?.length > 0 && (
                                            <ul className="text-xs text-gray-500">
                                                {it.options.map(
                                                    (opt, i) =>
                                                        opt.quantity > 0 && (
                                                            <li key={i}>
                                                                <b>{opt.option_name}</b> ×{opt.quantity}
                                                            </li>
                                                        )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-[#fff4f2] border border-[#FC4126]/30 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => dec(it)}
                                            className="px-3 py-2 text-[#FC4126] hover:bg-[#ffe6e1]"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-medium text-[#FC4126]">
                                            {it.quantity}
                                        </span>
                                        <button
                                            onClick={() => inc(it)}
                                            className="px-3 py-2 text-[#FC4126] hover:bg-[#ffe6e1]"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right font-semibold text-gray-700">
                                        {(it.price * it.quantity).toLocaleString("vi-VN")} đ
                                    </div>

                                    <button
                                        onClick={() => removeItem(it.id)}
                                        className="text-gray-400 hover:text-[#FC4126]"
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
                    {/* Địa chỉ giao hàng */}
                    <div className="mb-4">
                        <label className="block text-base font-semibold text-gray-700 mb-1">
                            Địa chỉ giao hàng:
                        </label>
                        {address ? (
                            <div className="text-sm text-gray-700 mb-2">
                                {address.name}
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="text-[#FC4126] text-xs ml-2 hover:underline"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowPopup(true)}
                                className="w-full text-sm py-2 border border-[#FC4126] text-[#FC4126] rounded-full hover:bg-[#FC4126]/10 transition"
                            >
                                <MapPin className="inline mr-1" size={14} />
                                Nhập địa chỉ giao hàng
                            </button>
                        )}
                    </div>

                    {/* Voucher */}
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
                            className={`px-4 py-2 rounded-r-full font-semibold text-sm ${
                                loading
                                    ? "bg-gray-300 text-gray-500"
                                    : "bg-[#FC4126] text-white hover:bg-[#ff6b47]"
                            }`}
                        >
                            {loading ? "..." : "Áp dụng"}
                        </button>
                    </div>
                    {voucherError && (
                        <p className="text-red-500 text-sm mb-2">{voucherError}</p>
                    )}

                    {/* Chi tiết giá */}
                    <div className="text-sm text-gray-700 space-y-2 mb-4">
                        {discount > 0 && (
                            <div className="flex justify-between text-[#FC4126] font-semibold text-base">
                                <span>{appliedVoucher}</span>
                                <span>-{discount.toLocaleString("vi-VN")} đ</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-[#FC4126]/20 pt-2">
                            <span>Tổng</span>
                            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span>-{discount.toLocaleString("vi-VN")} đ</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Phí giao hàng</span>
                            <span>
                                {shippingFee > 0
                                    ? `${shippingFee.toLocaleString("vi-VN")} đ`
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t border-[#FC4126]/20 pt-2">
                            <span>Tổng cộng</span>
                            <span className="text-[#FC4126]">
                                {totalAmount.toLocaleString("vi-VN")} đ
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={goToCheckout}
                        className="w-full bg-[#FC4126] text-white font-bold py-2 rounded-full hover:bg-[#ff6347]"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>

            {/* Popup chọn địa chỉ */}
            <AddressPopup
                open={showPopup}
                onClose={() => setShowPopup(false)}
                onSelect={handleAddressSelect}
            />
                        </>
                    )

                }
        </div>
    );
}
