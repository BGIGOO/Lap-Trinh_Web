// src/pages/cart/CartDetail.jsx
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, Edit3, Check } from "lucide-react";
import sampleImg from "@/assets/5.jpg";

const formatVND = (n) =>
    (n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

const ITEM_PRICE = 115000; // giá sản phẩm mẫu
const SHIPPING = 20000; // phí giao hàng
const VOUCHER_VALUE = 20000; // giảm giá khi dùng voucher
const VOUCHER_CODE = "POPEYES20";

export default function CartDetail() {
    // state giỏ hàng demo: 1 sản phẩm
    const [qty, setQty] = useState(1);
    const [voucher, setVoucher] = useState("");
    const [applied, setApplied] = useState(false);

    const subtotal = useMemo(() => qty * ITEM_PRICE, [qty]);
    const discount = applied ? VOUCHER_VALUE : 0;
    const grandTotal = Math.max(0, subtotal - discount + SHIPPING);

    const applyVoucher = () => {
        if (voucher.trim().toUpperCase() === VOUCHER_CODE) {
            setApplied(true);
        }
    };

    const removeVoucher = () => {
        setApplied(false);
        setVoucher("");
    };

    const addRecomToCart = (price) => {
        // demo: coi như thêm món phụ -> cộng vào subtotal bằng cách +1 sản phẩm chính
        setQty((q) => q + 1);
        // bạn có thể mở rộng: push item riêng vào list giỏ hàng
        console.log("Added recommended item (price:", price, ")");
    };

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Cart detail */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-extrabold mb-4">
                        Giỏ hàng của bạn:
                    </h2>

                    {/* Item row */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                        <div className="flex gap-3">
                            <img
                                src={sampleImg}
                                alt="Sản phẩm"
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="flex-1">
                                <div className="font-semibold leading-snug">
                                    Gà Cánh Tỏi Xốt Phô Mai 6 miếng (Alacarte)
                                </div>

                                {/* actions text */}
                                <div className="text-sm text-[#FF5A3E] mt-1 flex gap-3">
                                    <button className="hover:underline inline-flex items-center gap-1 cursor-pointer">
                                        <Edit3 className="w-4 h-4" />
                                        Điều chỉnh
                                    </button>
                                    <button className="hover:underline inline-flex items-center gap-1 cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                        Xoá
                                    </button>
                                </div>
                            </div>

                            {/* qty controller */}
                            <div className="shrink-0">
                                <div className="inline-flex items-center rounded-full overflow-hidden">
                                    <button
                                        onClick={() =>
                                            setQty((q) => Math.max(1, q - 1))
                                        }
                                        className="grid place-items-center w-9 h-9 hover:bg-gray-50 cursor-pointer"
                                        aria-label="Giảm"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="w-12 text-center select-none">
                                        {qty}
                                    </div>
                                    <button
                                        onClick={() => setQty((q) => q + 1)}
                                        className="grid place-items-center w-9 h-9 hover:bg-gray-50 cursor-pointer"
                                        aria-label="Tăng"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* voucher badge khi đã áp dụng */}
                        {applied && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-[#FF5A3E] font-bold">
                                    {VOUCHER_CODE}
                                </div>
                                <div className="text-[#FF5A3E] font-bold">
                                    -{formatVND(VOUCHER_VALUE)}
                                </div>
                            </div>
                        )}

                        {applied && (
                            <button
                                onClick={removeVoucher}
                                className="mt-1 text-sm text-[#FF5A3E] hover:underline cursor-pointer"
                            >
                                Xoá mã giảm giá
                            </button>
                        )}

                        {/* voucher input */}
                        <div className="mt-3 flex gap-2">
                            <input
                                value={voucher}
                                onChange={(e) => setVoucher(e.target.value)}
                                type="text"
                                placeholder="Nhập mã giảm giá"
                                className="flex-1 h-11 rounded-md border border-gray-300 px-3 outline-none focus:border-[#FF8A00]"
                            />
                            <button
                                onClick={applyVoucher}
                                className="px-5 h-11 rounded-md bg-[#FF8A00] text-white font-extrabold hover:bg-[#FFA33A] cursor-pointer"
                            >
                                Áp dụng
                            </button>
                        </div>

                        {applied && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
                                <Check className="w-4 h-4" />
                                Mã E-voucher đã được áp dụng vào hóa đơn.
                            </div>
                        )}

                        {/* totals */}
                        <div className="mt-4 space-y-2 text-[15px]">
                            <Row label="Tổng" value={formatVND(subtotal)} />
                            <Row
                                label="Giảm voucher"
                                value={
                                    applied
                                        ? `-${formatVND(VOUCHER_VALUE)}`
                                        : formatVND(0)
                                }
                            />
                            <Row
                                label="Phí giao hàng"
                                value={formatVND(SHIPPING)}
                            />
                            <Row
                                label="Tổng cộng"
                                value={formatVND(grandTotal)}
                                strong
                            />
                        </div>

                        <div className="mt-5">
                            <button className="w-full h-12 rounded-full bg-[#FF8A00] text-white font-extrabold hover:bg-[#FFA33A] cursor-pointer">
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Recommended */}
                <aside className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                    <h3 className="text-xl font-extrabold mb-3">
                        Món ngon phải thử
                    </h3>

                    <div className="space-y-5">
                        <RecomItem
                            img={sampleImg}
                            title="Thêm sốt Nước Mắm cho mỗi miếng gà (Alacarte)"
                            price={8000}
                            onAdd={() => addRecomToCart(8000)}
                        />
                        <RecomItem
                            img={sampleImg}
                            title="Khoai tây chiên size nhỏ (Alacarte)"
                            price={25000}
                            onAdd={() => addRecomToCart(25000)}
                        />
                        <RecomItem
                            img={sampleImg}
                            title="2 miếng Snack cá (Alacarte)"
                            price={18000}
                            onAdd={() => addRecomToCart(18000)}
                            largeThumb
                        />
                    </div>
                </aside>
            </div>
        </section>
    );
}

/* ------- helpers ------- */

function Row({ label, value, strong }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700">{label}</span>
            <span className={strong ? "font-bold text-[#FF5A3E]" : ""}>
                {value}
            </span>
        </div>
    );
}

function RecomItem({ img, title, price, onAdd }) {
    return (
        <div className="flex items-start gap-3">
            <img
                src={img}
                alt={title}
                className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
                <div className="font-semibold leading-snug">{title}</div>
                <div className="text-sm text-gray-600 mt-1">
                    {formatVND(price)}
                </div>

                <button
                    onClick={onAdd}
                    className="mt-2 inline-flex items-center justify-center
                     px-4 h-10 rounded-full border-2 border-[#FF8A00] text-[#FF8A00]
                     font-bold hover:bg-[#FF8A00] hover:text-white transition-colors cursor-pointer text-sm"
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
}
