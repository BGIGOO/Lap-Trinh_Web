"use client";

import { useState, useEffect } from "react";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductList() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [products, setProducts] = useState([]);

    // 🚀 Lấy danh sách sản phẩm từ backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/products", {
                    method: "GET",
                    cache: "no-store",
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(json.data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", err);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    // Khi click vào sản phẩm
    const loadProductAndOpen = async (id) => {
        try {
            setOpen(true);
            setLoading(true);
            const res = await fetch(
                `http://localhost:3001/api/products/${encodeURIComponent(id)}`,
                { method: "GET", cache: "no-store" }
            );
            const json = await res.json();
            setModalData(json.data || null);
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
            setModalData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (payload) => {
        console.log("🛒 ADD TO CART:", payload);
        setOpen(false);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-4">
            <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-2xl md:text-[28px] font-extrabold tracking-wide text-[#FF523B]">
                    CHICKEN TODAY
                </h2>
            </div>

            {/* Grid sản phẩm */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
                {products.length > 0 ? (
                    products.map((p) => (
                        <article
                            key={p.id}
                            onClick={() => loadProductAndOpen(p.id)}
                            className="flex flex-col rounded-2xl border border-[#FC4126] overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                        >
                            <div className="h-36 md:h-60 bg-white/60">
                                <img
                                    src={`http://localhost:3001${p.image_url}`}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-3 flex flex-col grow">
                                <h3
                                    className="text-center text-[#FF523B] font-bold leading-snug text-[13px] md:text-[15px] min-h-[40px] md:min-h-[48px]"
                                    title={p.name}
                                >
                                    {p.name}
                                </h3>

                                <div className="mt-auto text-center font-semibold text-neutral-900 pb-5">
                                    <span className="tabular-nums text-[13px] md:text-[15px] font-bold">
                                        {Number(p.sale_price).toLocaleString(
                                            "vi-VN"
                                        )}
                                    </span>
                                    <span className="ml-1 text-sm md:text-base underline font-bold">
                                        đ
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        Không có sản phẩm nào.
                    </p>
                )}
            </div>

            {/* Modal chi tiết sản phẩm */}
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
