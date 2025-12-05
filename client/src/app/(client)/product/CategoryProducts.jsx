"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryProducts() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllCategories();
  }, []);

  // ============================================
  // 🔥 Load tất cả danh mục + 4 sản phẩm mỗi mục
  // ============================================
  async function loadAllCategories() {
    try {
      const cateRes = await fetch("http://localhost:3001/api/categories");
      const cateJson = await cateRes.json();

      if (!cateJson.success) return;

      // ⭐ Chỉ lấy active + sắp xếp theo độ ưu tiên
      const categories = [...cateJson.data]
        .filter((c) => c.is_active === 1)
        .sort((a, b) => a.priority - b.priority);


      const sectionList = [];

      for (const c of categories) {
        const productRes = await fetch(
          `http://localhost:3001/api/products/category/${c.id}`
        );
        const productJson = await productRes.json();

        if (!productJson.success) continue;

        sectionList.push({
          title: c.name,
          slug: c.slug,
          products: productJson.data.slice(0, 4),
        });
      }

      setSections(sectionList);
    } catch (err) {
      console.error("Load categories failed:", err);
    } finally {
      setLoading(false);
    }
  }


  // =============================
  // 🔥 Template thẻ sản phẩm
  // =============================
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

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-0">
      {sections.map((sec) => (
        <div key={sec.slug} className="mb-16">
          {/* 🟠 Tên danh mục */}
          <h2 className="text-center text-xl font-bold text-[#FC4126] mb-6">
            {sec.title}
          </h2>

          {/* 🟡 Grid 4 sản phẩm */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {sec.products.map((p) => renderProductCard(p))}
          </div>

          {/* 🟢 Nút xem thêm */}
          <div className="text-center mt-6">
            <Link
              href={`/product?category=${sec.slug}`}
              className="px-6 py-2 bg-[#19BFB0] text-white rounded-full hover:bg-[#17a89c] transition"
            >
              Xem thêm thực đơn
            </Link>
          </div>

          <hr className="my-12 border-gray-200" />
        </div>
      ))}
    </section>
  );
}
