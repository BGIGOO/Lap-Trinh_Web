"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";

const PAGE_SIZE = 4;

export default function PromotionPage() {
  const [promos, setPromos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách khuyến mãi từ backend
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/promotions");
        const data = await res.json();
        if (data.success) {
          // Sắp xếp mới nhất lên đầu (theo id)
          const sorted = [...data.data].sort((a, b) => b.id - a.id);
          setPromos(sorted);
        }
      } catch (err) {
        console.error("Fetch promotions failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-500">
        Đang tải danh sách khuyến mãi...
      </section>
    );
  }

  // Tính phân trang
  const totalPages = Math.ceil(promos.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const shown = promos.slice(start, start + PAGE_SIZE);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-0 my-10">
      {/* Lưới khuyến mãi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {shown.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
          >
            {/* Ảnh khuyến mãi */}
            <div className="bg-gray-50 aspect-[4/4.2] relative">
              <Image
  src={
    p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `http://localhost:3001${p.imageUrl}`
  }
  alt={p.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 25vw"
  priority
/>

            </div>

            {/* Nội dung */}
            <div className="px-4 py-4 text-center">
              <h3 className="text-neutral-800 font-semibold text-[14px] md:text-[15px] min-h-[44px] md:min-h-[48px]">
                {p.title}
              </h3>

              {p.is_active ? (
                <Link href={`/promotion/${p.slug}`}>
                  <button
                    className="mt-3 w-full h-11 rounded-full bg-[#FF8A00] text-white
                               font-bold hover:bg-[#FFA33A] transition-colors text-sm"
                  >
                    Đặt ngay
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-3 w-full h-11 rounded-full bg-gray-200 text-gray-600
                             font-bold cursor-not-allowed text-sm"
                >
                  Không khả dụng hôm nay
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Phân trang */}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  );
}
