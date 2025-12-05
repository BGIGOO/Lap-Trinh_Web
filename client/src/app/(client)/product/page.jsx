"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductFilter from "./ProductFilter";
import ProductCategory from "./ProductCategory";
import CategoryProducts from "./CategoryProducts";

export default function ProductPage() {
  const params = useSearchParams();
  const slug = params.get("category") || "tat-ca";

  const [categoryName, setCategoryName] = useState("");

  // 🔥 Lấy tên danh mục theo slug
  useEffect(() => {
    async function loadCategory() {
      if (slug === "tat-ca") {
        setCategoryName("");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3001/api/categories/slug/${slug}`
        );
        const json = await res.json();

        if (json.success && json.data) {
          setCategoryName(json.data.name);
        } else {
          setCategoryName("");
        }
      } catch (err) {
        console.error("Lỗi load category:", err);
        setCategoryName("");
      }
    }

    loadCategory();
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* THANH FILTER */}
      <ProductFilter />

      {/* Nếu là trang TẤT CẢ → Hiện tất cả danh mục + 4 sản phẩm */}
      {slug === "tat-ca" ? (
        <CategoryProducts />
      ) : (
        <>
          {/* ⭐ CHỈNH LẠI — tiêu đề danh mục từ database */}
          <h2 className="text-center text-[#FF523B]   text-2xl font-bold my-6 pb-3">
            {categoryName || ""}
          </h2>

          {/* Hiện sản phẩm theo danh mục */}
          <ProductCategory slug={slug} />
        </>
      )}
    </div>
  );
}
