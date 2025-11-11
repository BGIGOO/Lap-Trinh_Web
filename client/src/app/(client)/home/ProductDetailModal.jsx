"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductDetailModal({
    open,
    loading,
    product,
    onClose,
    onAddToCart,
}) {
    const [addOns, setAddOns] = useState([]);
    const [quantity, setQuantity] = useState(1);

    // 🧩 Khởi tạo addon
    useEffect(() => {
        if (product?.addOns?.length) {
            const mapped = product.addOns.map((g) => {
                const maxQty = g.max_total_quantity || 1;
                const minQty = g.min_total_quantity || 0;

                const opts = g.options || [];

                // ✅ option đầu tiên có qty = max_total_quantity, các option khác = 0
                const options = opts.map((o, idx) => ({
                    id: o.id,
                    label: o.name,
                    qty: idx === 0 ? maxQty : 0,
                }));

                // ✅ Giữ lại cờ is_hidden để lọc khi render
                return {
                    id: g.id,
                    title: g.name,
                    note: g.note || "",
                    min: minQty,
                    max: maxQty,
                    is_hidden: Boolean(g.is_hidden),
                    options, // 👈 đổi từ items → options
                };
            });

            setAddOns(mapped);
        } else {
            setAddOns([]);
        }
    }, [product]);

    // 🧮 Tổng qty group
    const groupTotal = (g) => g.options.reduce((s, it) => s + it.qty, 0);

    // ➕ Tăng
    const inc = (gid, oid) => {
        setAddOns((prev) =>
            prev.map((g) => {
                if (g.id !== gid) return g;

                let options = g.options.map((it) => ({ ...it }));
                const idx = options.findIndex((it) => it.id === oid);
                if (idx === -1) return g;

                const total = groupTotal(g);

                if (total < g.max) {
                    options[idx].qty += 1;
                } else {
                    // Giảm từ option khác để nhường chỗ
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].id !== oid && options[i].qty > 0) {
                            options[i].qty -= 1;
                            options[idx].qty += 1;
                            break;
                        }
                    }
                }

                return { ...g, options };
            })
        );
    };

    // ➖ Giảm
    const dec = (gid, oid) => {
        setAddOns((prev) =>
            prev.map((g) => {
                if (g.id !== gid) return g;

                let options = g.options.map((it) => ({ ...it }));
                const idx = options.findIndex((it) => it.id === oid);
                if (idx === -1) return g;

                if (options[idx].qty > 0) options[idx].qty -= 1;

                let sum = options.reduce((s, it) => s + it.qty, 0);
                if (sum < g.min && options.length > 0) {
                    options[0].qty += g.min - sum;
                }

                options = options.map((it) => ({
                    ...it,
                    qty: Math.max(0, it.qty),
                }));

                return { ...g, options };
            })
        );
    };

    // 💰 Tổng tiền
    const subtotal = useMemo(() => {
        const base = Number(product?.sale_price || 0);
        return base * quantity;
    }, [product, addOns, quantity]);

    const canAddToCart = useMemo(() => {
        if (!product) return false;
        if (!addOns.length) return true;
        return addOns.every((g) => {
            const total = groupTotal(g);
            return total >= g.min && total <= g.max;
        });
    }, [product, addOns]);

    const handleAdd = async () => {
        if (!product) return;

        const toastId = toast.loading("🛠️ Đang thêm sản phẩm vào giỏ hàng...");

        try {
            const user_id = localStorage.getItem("user_id")
                ? Number(localStorage.getItem("user_id"))
                : null;
            let cartId = localStorage.getItem("cart_id");

            // 🧱 1️⃣ Nếu chưa có giỏ hàng → Tạo mới
            if (!cartId) {
                const resCreate = await axios.post(
                    "http://localhost:3001/api/carts",
                    {
                        ...(user_id ? { user_id } : {}),
                    }
                );

                if (!resCreate.data?.success) {
                    toast.error("❌ Không thể tạo giỏ hàng!", { id: toastId });
                    return;
                }

                cartId =
                    resCreate.data.data?.cart_id ||
                    resCreate.data.data?.id ||
                    resCreate.data?.id;

                if (!cartId) {
                    toast.error("⚠️ Không nhận được cart_id từ API!", {
                        id: toastId,
                    });
                    return;
                }

                localStorage.setItem("cart_id", cartId);
            }

            // 🧩 2️⃣ Chuẩn bị payload theo API thực tế
            const payload = {
                product_id: product.id,
                quantity,
                price: Number(product.sale_price || product.price || 0),
                options: addOns.flatMap((g) =>
                    g.options.map((it) => ({
                        option_id: it.id,
                        option_name: it.label,
                        option_group_name: g.title,
                        quantity: it.qty,
                    }))
                ),
            };

            // 🧩 3️⃣ Gửi request thêm sản phẩm
            const resAdd = await axios.post(
                `http://localhost:3001/api/carts/${cartId}/items`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            if (!resAdd.data?.success) {
                toast.error("❌ Không thể thêm sản phẩm vào giỏ hàng!", {
                    id: toastId,
                });
                return;
            }

            // ✅ 4️⃣ Thành công
            toast.success("🛒 Sản phẩm đã được thêm vào giỏ hàng!", {
                id: toastId,
            });
            onAddToCart?.(payload);
            onClose?.();
        } catch (error) {
            console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
            toast.error("⚠️ Có lỗi xảy ra khi thêm sản phẩm!", { id: toastId });
        }
    };

    if (!open) return null;

    console.log(addOns);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#f5f1ef] rounded-xl shadow-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            >
                {/* Left image */}
                <div className="bg-gray-100 relative">
                    {loading ? (
                        <div className="h-full grid place-content-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <img
                            src={
                                product?.image_url
                                    ? `http://localhost:3001${product.image_url}`
                                    : "/no-image.jpg"
                            }
                            alt={product?.name || ""}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Right content */}
                <div className="p-6 flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-lg md:text-xl font-bold text-[#FC4126] mb-2">
                        {product?.name}
                    </h2>
                    {product?.description && (
                        <p className="text-base text-gray-600 mb-4 leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    <div className="text-right font-extrabold text-[#333] mb-4">
                        <span className="text-sm text-gray-500 line-through mr-2">
                            {product?.price && formatMoney(product.price)}đ
                        </span>
                        <span className="text-lg text-[#FF523B]">
                            {formatMoney(product?.sale_price)} đ
                        </span>
                    </div>

                    {/* Addons */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        {addOns
                            .filter((g) => !g.is_hidden)
                            .map((g) => (
                                <div
                                    key={g.id}
                                    className="border-t border-[#e0e0e0] pt-3 mt-3"
                                >
                                    <div className="flex items-baseline justify-between">
                                        <h4 className="font-bold">{g.title}</h4>
                                        <span className="text-sm text-gray-500">
                                            Tối đa {g.max}
                                        </span>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        {g.options.map((it) => (
                                            <div
                                                key={it.id}
                                                className="flex items-center justify-between border border-[#e0e0e0] rounded-lg px-3 py-2"
                                            >
                                                <div className="text-base">
                                                    {it.label}
                                                </div>
                                                <div className="flex items-center overflow-hidden rounded-full bg-gray-50">
                                                    <button
                                                        onClick={() =>
                                                            dec(g.id, it.id)
                                                        }
                                                        disabled={it.qty <= 0}
                                                        className={`w-7 h-7 grid place-content-center text-gray-700 ${
                                                            it.qty <= 0
                                                                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                                                                : "bg-[#e0e0e0] hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="w-8 text-center text-sm font-medium bg-white select-none">
                                                        {it.qty}
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            inc(g.id, it.id)
                                                        }
                                                        className="w-7 h-7 grid place-content-center text-gray-700 bg-[#e0e0e0] hover:bg-gray-200"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 border-t border-[#e0e0e0] pt-4 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center overflow-hidden rounded-full bg-gray-50">
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                className="w-10 h-10 grid place-content-center text-gray-700 bg-[#e0e0e0] hover:bg-gray-200"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-12 text-center font-semibold select-none bg-white text-gray-900">
                                {quantity}
                            </div>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-10 h-10 grid place-content-center text-gray-700 bg-[#e0e0e0] hover:bg-gray-200"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            disabled={!canAddToCart || loading}
                            onClick={handleAdd}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-full font-bold text-white text-base transition-colors cursor-pointer ${
                                canAddToCart && !loading
                                    ? "bg-[#FC4126] hover:bg-[#ff6b47]"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            {loading
                                ? "Đang tải..."
                                : `Thêm vào giỏ hàng • ${formatMoney(
                                      subtotal
                                  )} đ`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatMoney(n) {
    try {
        return (Number(n) || 0).toLocaleString("vi-VN");
    } catch {
        return n;
    }
}
