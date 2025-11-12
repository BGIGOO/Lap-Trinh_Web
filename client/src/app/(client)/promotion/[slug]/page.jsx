"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PromotionDetail() {
  const { slug } = useParams();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPromotion = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/promotions/slug/${slug}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          setPromo(json.data);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [slug]);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Đang tải khuyến mãi...</p>
    );
  if (!promo)
    return (
      <p className="text-center py-10 text-gray-500">
        Không tìm thấy khuyến mãi.
      </p>
    );

  const imgSrc = promo.imageUrl?.startsWith("http")
    ? promo.imageUrl
    : `http://localhost:3001${promo.imageUrl}`;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/promotion"
        className="text-[#FC4126] font-semibold mb-6 inline-block hover:underline"
      >
        ← Quay lại danh sách
      </Link>

      {/* KHỐI CHI TIẾT: ảnh bên trái, nhích lên đầu */}
      <div className="relative flex flex-col lg:flex-row items-start gap-10">
        {/* ẢNH BÊN TRÁI */}
        <div className="w-full lg:w-[48%] relative">
          <div className="sticky top-20">
            <div className="relative aspect-[4/4]">
              <Image
                src={imgSrc}
                alt={promo.title}
                fill
                className="object-cover rounded-2xl shadow-md"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* NỘI DUNG BÊN PHẢI */}
        <div className="w-full lg:w-[52%] mt-[-20px]">
          <h1 className="text-3xl font-extrabold text-[#FC4126] mb-5">
            {promo.title}
          </h1>

          <div
            className="prose max-w-none text-gray-700 leading-relaxed prose-p:my-2"
            dangerouslySetInnerHTML={{ __html: promo.blogContent }}
          />
        </div>
      </div>
    </section>
  );
}
