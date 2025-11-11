"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductFilter({ value = "", onChange, onSearchClick }) {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(value);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const trackRef = useRef(null);

  // 🟡 Fetch dữ liệu từ API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        // thêm 1 mục "Tất cả" ở đầu
        const cats = [{ id: 0, name: "Tất cả", image: "/tatca.png" }, ...data];
        setCategories(cats);
      } catch (err) {
        console.error("Lỗi khi lấy categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => setActive(value), [value]);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    el.addEventListener("scroll", updateArrows);
    return () => {
      window.removeEventListener("resize", onResize);
      el?.removeEventListener("scroll", updateArrows);
    };
  }, []);

  const select = (id) => {
    setActive(id);
    onChange?.(id);
  };

  const scrollByStep = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.6);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-0">
      <div className="relative flex items-center gap-3 py-3">
        {/* Prev */}
        <button
          onClick={() => scrollByStep(-1)}
          disabled={!canLeft}
          className={`shrink-0 grid place-items-center w-10 h-10 rounded-full transition-colors ${
            canLeft
              ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-6 overflow-x-auto scroll-smooth no-scrollbar flex-1"
        >
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => select(c.id)}
                className="shrink-0 flex flex-col items-center gap-1 cursor-pointer"
              >
                <ColorIcon src={c.image} active={isActive} />
                <span
                  className={`text-xs md:text-sm font-semibold transition ${
                    isActive ? "text-[#FF8A00]" : "text-gray-400"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => scrollByStep(1)}
          disabled={!canRight}
          className={`shrink-0 grid place-items-center w-10 h-10 rounded-full transition-colors ${
            canRight
              ? "bg-[#FF8A00] text-white hover:bg-[#FFA33A]"
              : "bg-orange-100 text-white/60 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Search */}
        <button
          onClick={onSearchClick}
          className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-[#19BFB0] text-white hover:opacity-90 transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

function ColorIcon({ src, active, className = "" }) {
  const url = typeof src === "string" ? src : src?.src;
  return (
    <span
      aria-hidden="true"
      className={`${className} block w-10 h-10 md:w-14 md:h-14 transition ${
        active ? "bg-[#FF8A00]" : "bg-gray-400 opacity-50"
      }`}
      style={{
        WebkitMaskImage: `url("${url}")`,
        maskImage: `url("${url}")`,
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
