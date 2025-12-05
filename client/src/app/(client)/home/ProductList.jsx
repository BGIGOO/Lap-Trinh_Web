"use client";

import { useState, useEffect } from "react";
import ProductDetailModal from "./ProductDetailModal";
import Link from "next/link";

export default function ProductList() {
  const [activeTab, setActiveTab] = useState("best-seller"); // ⭐ tab hiện tại
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [bestSeller, setBestSeller] = useState([]);
  const [promos, setPromos] = useState([]);

  // ============================
  // ⭐ LẤY CATEGORY BEST SELLER
  // ============================
  const getBestSellerCategoryId = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/categories/slug/best-seller"
      );
      const json = await res.json();
      if (json.success && json.data) return json.data.id;
      return null;
    } catch (err) {
      console.error("Lỗi lấy category Best Seller:", err);
      return null;
    }
  };

  // ============================
  // ⭐ LẤY SẢN PHẨM BEST SELLER
  // ============================
  const loadBestSellerProducts = async () => {
    try {
      const categoryId = await getBestSellerCategoryId();
      if (!categoryId) return;

      const res = await fetch(
        `http://localhost:3001/api/products/category/${categoryId}`
      );
      const json = await res.json();

      if (json.success) {
        setBestSeller(json.data.slice(0, 4)); // 🔥 CHỈ LẤY 4 SẢN PHẨM
      }
    } catch (err) {
      console.error("Lỗi lấy Best Seller:", err);
    }
  };

  // ============================
  // ⭐ LẤY KHUYẾN MÃI
  // ============================
  const loadPromotions = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/promotions");
      const json = await res.json();

      if (json.success) {
        const sorted = [...json.data].sort((a, b) => b.id - a.id);
        setPromos(sorted.slice(0, 4)); // 🔥 chỉ lấy 4 promo
      }
    } catch (err) {
      console.error("Lỗi lấy khuyến mãi:", err);
    }
  };

  // ============================
  // ⭐ CHẠY KHI MOUNT COMPONENT
  // ============================
  useEffect(() => {
    loadBestSellerProducts();
    loadPromotions();
  }, []);

  // ============================
  // ⭐ CLICK SẢN PHẨM
  // ============================
  const loadProductAndOpen = async (id) => {
    try {
      setOpen(true);
      setLoading(true);

      const res = await fetch(`http://localhost:3001/api/products/${id}`);
      const json = await res.json();

      setModalData(json.data || null);
    } catch (err) {
      console.error("Lỗi lấy chi tiết sản phẩm:", err);
      setModalData(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // ⭐ UI TABS
  // ============================
  const tabButton = (key, label) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`px-3 pb-2 text-[24px] font-extrabold transition border-b-4 ${
        activeTab === key
          ? "text-[#FF523B] border-[#FF523B]"
          : "text-gray-500 border-transparent"
      }`}
    >
      {label}
    </button>
  );


  const renderProductCard = (p) => (
    <article
      key={p.id}
      onClick={() => loadProductAndOpen(p.id)}
      className="flex flex-col rounded-3xl border border-[#DCDCDC] overflow-hidden cursor-pointer transition hover:shadow-lg"
    >
      <div className="h-40 md:h-62 overflow-hidden">
        <img
          src={`http://localhost:3001${p.image_url}`}
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </div>

      <div className="p-3 flex flex-col grow">
        <h3 className="text-center text-[#FF523B] font-bold text-sm md:text-[15px] min-h-[40px] leading-snug">
          {p.name}
        </h3>

        <div className="mt-auto text-center text-neutral-900 pb-3">
          <span className="font-bold text-[14px]">
            {Number(p.original_price).toLocaleString("vi-VN")}
          </span>
          <span className="ml-1 text-sm underline font-bold">đ</span>
        </div>
      </div>
    </article>
  );

  const renderPromoCard = (promo) => (
    <article
      key={promo.id}
      className="flex flex-col rounded-3xl border border-[#DCDCDC] overflow-hidden cursor-pointer transition hover:shadow-lg"
    >
      {/* Ảnh promo giống ảnh product */}
      <div className="h-40 md:h-62 overflow-hidden">
        <img
          src={`http://localhost:3001${promo.imageUrl}`}
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </div>

      {/* Nội dung */}
      <div className="p-7.5 flex flex-col grow justify-center items-center text-center">
        <h3 className="text-[#FF523B] font-bold text-sm md:text-[15px] leading-snug">
          {promo.title}
        </h3>
      </div>
    </article>
  );


  return (
    <section className="max-w-6xl mx-auto px-4 mt-6">
      {/* ⭐ TAB TITLE */}
      <div className="flex justify-center gap-6 mb-6">
        {tabButton("best-seller", "Món ngon phải thử")}
        {tabButton("promo", "Khuyến mãi")}
      </div>

      {/* ⭐ CONTENT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {activeTab === "best-seller"
          ? bestSeller.map(renderProductCard)
          : promos.map(renderPromoCard)}
      </div>

      {/* ⭐ BUTTON XEM THÊM */}
      <div className="flex justify-center mt-6">
        <Link
          href="/product"
          className="px-6 py-2 rounded-full bg-[#00AA63] text-white font-semibold hover:bg-[#009657] transition"
        >
          Xem thêm thực đơn
        </Link>
      </div>

      {/* ⭐ MODAL SẢN PHẨM */}
      <ProductDetailModal
        open={open}
        loading={loading}
        product={modalData}
        onClose={() => setOpen(false)}
        onAddToCart={() => setOpen(false)}
      />
    </section>
  );
}
