"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Loader2 } from "lucide-react";

/**
 * Props:
 *  - open: boolean
 *  - loading: boolean
 *  - product: {
 *      id, title, summary, image, price,
 *      sections: [{ id, title, note, multiple, min, max, items: [{id, label, qty, min, max, priceDelta}] }]
 *    } | null
 *  - onClose: () => void
 *  - onAddToCart: (payload) => void
 */
export default function ProductDetailModal({
    open,
    loading,
    product,
    onClose,
    onAddToCart,
}) {
    // bản sao state có thể chỉnh số lượng
    const [sections, setSections] = useState([]);

    useEffect(() => {
        setSections(product?.sections || []);
    }, [product]);

    // helper: total qty trong group
    const groupTotal = (g) => g.items.reduce((s, it) => s + (it.qty || 0), 0);

    const canAddToCart = useMemo(() => {
        if (!product || !sections.length) return false;
        // mọi group phải thỏa min/max (nếu max > 0)
        return sections.every((g) => {
            const tot = groupTotal(g);
            const min = g.min ?? 0;
            const max = g.max ?? 0;
            if (tot < min) return false;
            if (max > 0 && tot > max) return false;
            return true;
        });
    }, [product, sections]);

    const subtotal = useMemo(() => {
        if (!product) return 0;
        const base = product.price || 0;
        const delta = sections.reduce((sum, g) => {
            return (
                sum +
                g.items.reduce(
                    (s, it) => s + (it.qty || 0) * Number(it.priceDelta || 0),
                    0
                )
            );
        }, 0);
        return base + delta;
    }, [product, sections]);

    const inc = (gid, oid) => {
        setSections((prev) =>
            prev.map((g) => {
                if (g.id !== gid) return g;
                // nếu không multiple => xem như radio; chọn item -> qty=1, còn lại 0
                if (!g.multiple) {
                    return {
                        ...g,
                        items: g.items.map((it) => ({
                            ...it,
                            qty: it.id === oid ? 1 : 0,
                        })),
                    };
                }
                // multiple: tăng nhưng không vượt item.max và group.max
                const tot = groupTotal(g);
                if (g.max && tot >= g.max) return g;
                return {
                    ...g,
                    items: g.items.map((it) => {
                        if (it.id !== oid) return it;
                        const next = (it.qty || 0) + 1;
                        if (it.max && next > it.max) return it;
                        return { ...it, qty: next };
                    }),
                };
            })
        );
    };

    const dec = (gid, oid) => {
        setSections((prev) =>
            prev.map((g) => {
                if (g.id !== gid) return g;
                // giảm nhưng không thấp hơn it.min; với radio (multiple=false) thì chỉ về 0/1
                return {
                    ...g,
                    items: g.items.map((it) => {
                        if (it.id !== oid) return it;
                        const min = it.min ?? 0;
                        const next = Math.max(min, (it.qty || 0) - 1);
                        return { ...it, qty: next };
                    }),
                };
            })
        );
    };

    const handleAdd = () => {
        if (!product) return;
        const payload = {
            productId: product.id,
            title: product.title,
            basePrice: product.price,
            selections: sections.map((g) => ({
                groupId: g.id,
                title: g.title,
                items: g.items
                    .filter((it) => (it.qty || 0) > 0)
                    .map((it) => ({
                        optionId: it.id,
                        label: it.label,
                        qty: it.qty,
                        priceDelta: it.priceDelta || 0,
                    })),
            })),
            totalPrice: subtotal,
        };
        onAddToCart?.(payload);
    };

    if (!open) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-3 
      bg-black/40 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0`}
            data-state={open ? "open" : "closed"}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-3xl rounded-xl bg-white shadow-2xl 
        transition-transform duration-200 data-[state=open]:scale-100 data-[state=closed]:scale-95`}
                data-state={open ? "open" : "closed"}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="absolute right-3 top-3 p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="px-5 pt-5">
                    <h2 className="text-lg md:text-xl font-extrabold text-[#FF523B] pr-12">
                        {product?.title || ""}
                    </h2>
                    {product?.summary ? (
                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                            {product.summary}
                        </p>
                    ) : null}
                </div>

                {/* Body */}
                <div className="px-5 pb-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Image */}
                    <div className="rounded-xl overflow-hidden bg-gray-50 border">
                        {loading ? (
                            <div className="h-64 grid place-content-center">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <img
                                src={product?.image || ""}
                                alt={product?.title || ""}
                                className="w-full h-64 object-cover"
                            />
                        )}
                    </div>

                    {/* Options */}
                    <div className="max-h-[60vh] overflow-auto pr-1">
                        {sections.map((g) => {
                            const tot = groupTotal(g);
                            const needText =
                                g.min || g.max
                                    ? `Chọn ${g.min ?? 0}${
                                          g.max ? ` - ${g.max}` : ""
                                      }`
                                    : null;
                            return (
                                <div
                                    key={g.id}
                                    className="mb-4 border-b last:border-b-0 pb-4"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="font-bold">{g.title}</h4>
                                        {needText ? (
                                            <span className="text-xs text-gray-500">
                                                ({needText})
                                            </span>
                                        ) : null}
                                        {g.multiple ? (
                                            <span className="ml-auto text-xs text-gray-500">
                                                Đã chọn: {tot}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        {g.items.map((it) => {
                                            const disabledMinus =
                                                (it.qty || 0) <= (it.min ?? 0);
                                            const disabledPlus =
                                                g.multiple && g.max
                                                    ? groupTotal(g) >= g.max
                                                    : (it.max ?? Infinity) <=
                                                      (it.qty || 0);

                                            return (
                                                <div
                                                    key={it.id}
                                                    className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {it.label}
                                                        </div>
                                                        {Number(it.priceDelta) >
                                                        0 ? (
                                                            <div className="text-xs text-gray-500">
                                                                +
                                                                {formatMoney(
                                                                    it.priceDelta
                                                                )}
                                                                đ
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                dec(g.id, it.id)
                                                            }
                                                            disabled={
                                                                disabledMinus
                                                            }
                                                            className={`w-8 h-8 grid place-content-center rounded-full border 
                              ${
                                  disabledMinus
                                      ? "text-gray-300"
                                      : "hover:bg-gray-50"
                              }`}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <div className="w-8 text-center tabular-nums">
                                                            {it.qty || 0}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                inc(g.id, it.id)
                                                            }
                                                            disabled={
                                                                disabledPlus
                                                            }
                                                            className={`w-8 h-8 grid place-content-center rounded-full border 
                              ${
                                  disabledPlus
                                      ? "text-gray-300"
                                      : "hover:bg-gray-50"
                              }`}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Tạm tính</div>
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-extrabold tabular-nums">
                            {formatMoney(subtotal)}{" "}
                            <span className="text-base">đ</span>
                        </div>
                        <button
                            type="button"
                            disabled={!canAddToCart || loading}
                            onClick={handleAdd}
                            className={`px-5 py-3 rounded-full text-sm font-bold cursor-pointer
                ${
                    canAddToCart && !loading
                        ? "bg-[#FF8A00] text-white hover:bg-[#FFA33A]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                        >
                            Thêm vào giỏ
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
        return `${n}`;
    }
}
