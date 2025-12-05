"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductFilter() {
  const [categories, setCategories] = useState([]);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const router = useRouter();
  const params = useSearchParams();
  const activeSlug = params.get("category") || "tat-ca";

  const trackRef = useRef(null);

  // ================================
  // 🟡 Fetch categories từ backend
  // ================================
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const json = await res.json();

        if (!json.success) return;

        // ⭐ Lọc active + sort theo priority tăng dần
        const sorted = [...json.data]
          .filter((c) => c.is_active === 1)
          .sort((a, b) => a.priority - b.priority);

        const formatted = sorted.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.image_url?.startsWith("/uploads")
            ? `http://localhost:3001${c.image_url}`
            : c.image_url,
        }));

        // ⭐ Thêm mục "Tất cả"
        setCategories([
          { id: 0, name: "Tất cả", slug: "tat-ca", icon: "/tatca.png" },
          ...formatted,
        ]);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    }

    loadCategories();
  }, []);

  // ================================
  // 🔥 Chọn danh mục → update URL
  // ================================
  const selectCategory = (slug) => {
    router.push(`/product?category=${slug}`);
  };

  // ================================
  // 🧭 Cập nhật trạng thái nút scroll
  // ================================
  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;

    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByStep = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * dir * 0.6, behavior: "smooth" });
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-0 py-6">
      <div className="relative flex items-center gap-3">
        {/* Prev button */}
        <button
          disabled={!canLeft}
          onClick={() => scrollByStep(-1)}
          className={`w-10 h-10 grid place-items-center rounded-full transition ${
            canLeft
              ? "bg-gray-200 hover:bg-gray-300 text-gray-600"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* CATEGORY SCROLL TRACK */}
        <div
          ref={trackRef}
          className="flex items-center gap-7 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          {categories.map((c) => {
            const isActive = activeSlug === c.slug;

            return (
              <button
                key={c.slug}
                onClick={() => selectCategory(c.slug)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
              >
                <CategoryIcon src={c.icon} active={isActive} />

                <span
                  className={`text-sm font-semibold transition ${
                    isActive ? "text-[#FC4126]" : "text-gray-400"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          disabled={!canRight}
          onClick={() => scrollByStep(1)}
          className={`w-10 h-10 grid place-items-center rounded-full transition ${
            canRight
              ? "bg-[#FC4126] hover:bg-[#ff6b50] text-white"
              : "bg-orange-100 text-white/60 cursor-not-allowed"
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* Search button */}
        <button className="w-10 h-10 grid place-items-center rounded-full bg-[#19BFB0] text-white hover:opacity-90 ml-2">
          <Search size={20} />
        </button>
      </div>
    </section>
  );
}

// ======================================
// 🎨 CATEGORY ICON (Mask SVG thành màu)
// ======================================
function CategoryIcon({ src, active }) {
  return (
    <span
      className={`block w-10 h-10 md:w-14 md:h-14 transition ${
        active ? "bg-[#FC4126]" : "bg-gray-400 opacity-50"
      }`}
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
