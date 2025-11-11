"use client";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

// demo ảnh local
import img1 from "@/assets/4.png";
import img2 from "@/assets/5.jpg";
import img3 from "@/assets/6.jpg";

const PRODUCTS = [
    {
        id: 1,
        name: "BOGO WINGS DELI 167K",
        price: "167.000",
        img: img1,
        slug: "BOGO WINGS DELI 167K-7174", // slug thật, có khoảng trắng
    },
    {
        id: 2,
        name: "Sản phẩm 2 (demo)",
        price: "59.000",
        img: img2,
        slug: "BOGO WINGS DELI 167K-7174",
    },
    {
        id: 3,
        name: "Sản phẩm 3 (demo)",
        price: "79.000",
        img: img3,
        slug: "BOGO WINGS DELI 167K-7174",
    },
    {
        id: 4,
        name: "Sản phẩm 4 (demo)",
        price: "129.000",
        img: img1,
        slug: "BOGO WINGS DELI 167K-7174",
    },
];

export default function ProductList() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null);

    const loadProductAndOpen = async (slug) => {
        try {
            setOpen(true);
            setLoading(true);

            const url = `https://api.popeyes.vn/api/v1/products/${encodeURIComponent(
                slug
            )}`;
            const res = await fetch(url, { method: "GET", cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data = json?.data;

            const normalized = mapApiToModal(data);
            setModalData(normalized);
        } catch (e) {
            console.error("Load product failed:", e);
            setModalData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (payload) => {
        console.log("ADD TO CART:", payload);
        // TODO: dispatch vào cart store của bạn
        setOpen(false);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-8">
            <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-2xl md:text-[28px] font-extrabold tracking-wide text-[#FF523B]">
                    CHICKEN TODAY
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
                {PRODUCTS.slice(0, 4).map((p) => (
                    <article
                        key={p.id}
                        onClick={() => loadProductAndOpen(p.slug)}
                        className="flex flex-col rounded-4xl border border-[#e0e0e0] overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                    >
                        <div className="h-36 md:h-60 bg-white/60">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-3 flex flex-col grow">
                            <h3
                                className="text-center text-[#FF523B] font-bold leading-snug text-[13px] md:text-[15px] min-h-[40px] md:min-h-[48px] pl-1 pr-1"
                                title={p.name}
                            >
                                {p.name}
                            </h3>

                            <div className="mt-auto text-center font-semibold text-neutral-900 pb-5">
                                <span className="tabular-nums text-[13px] md:text-[15px] font-bold">
                                    {p.price}
                                </span>
                                <span className="ml-1 text-sm md:text-base underline font-bold">
                                    đ
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Modal */}
            <ProductDetailModal
                open={open}
                loading={loading}
                product={modalData}
                onClose={() => setOpen(false)}
                onAddToCart={handleAddToCart}
            />
        </section>
    );
}

/** Chuẩn hoá object từ API Popeyes -> shape cho Modal */
function mapApiToModal(data) {
    if (!data) {
        return {
            id: 0,
            title: "",
            summary: "",
            image: "",
            price: 0,
            sections: [],
        };
    }

    const image =
        data?.images?.find((i) => i?.isDefault)?.desktopUrl ||
        data?.images?.[0]?.desktopUrl ||
        "";

    const sections = (data?.addOns || [])
        // Nếu muốn ẩn luôn group bị hidden, bỏ comment dòng dưới:
        .filter((g) => g?.hidden === false)
        .map((g) => {
            // CHỈ LẤY OPTION hidden === false
            const visibleOptions = (g?.options || []).filter(
                (o) => o?.hidden === false
            );

            return {
                id: g.id,
                title: g.name,
                note:
                    g.minTotalQuantity || g.maxTotalQuantity
                        ? `Chọn ${g.minTotalQuantity ?? 0}${
                              g.maxTotalQuantity
                                  ? ` - ${g.maxTotalQuantity}`
                                  : ""
                          }`
                        : undefined,
                multiple: !!g.multipleSelectAllowed,
                min: g.minTotalQuantity ?? 0,
                max: g.maxTotalQuantity ?? 0,
                items: visibleOptions.map((o) => ({
                    id: o.id,
                    label: o.name,
                    qty: o.isDefault ? o.defaultValue ?? 1 : 0,
                    min: o.minQuantity ?? 0,
                    max: o.maxQuantity ?? 99,
                    priceDelta: Number(o.additionalPrice || 0),
                })),
            };
        })
        // Nếu group sau khi lọc không còn option nào thì bỏ luôn:
        .filter((g) => g.items.length > 0);

    return {
        id: data.id,
        title: data.name || "",
        summary: data.description || "",
        image,
        price: Number(data.price || 0),
        sections,
    };
}
