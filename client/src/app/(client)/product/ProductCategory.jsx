"use client";

import { useEffect, useState } from "react";

const renderProductCard = (p, loadProductAndOpen) => (
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

export default function ProductCategory({ slug }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      if (slug === "tat-ca") return;

      const cateRes = await fetch(
        `http://localhost:3001/api/categories/slug/${slug}`
      );
      const cateJson = await cateRes.json();

      if (!cateJson?.data?.id) return;

      const pid = cateJson.data.id;

      const res = await fetch(
        `http://localhost:3001/api/products/category/${pid}`
      );
      const json = await res.json();

      if (json.success) setProducts(json.data);
    }

    load();
  }, [slug]);

  const loadProductAndOpen = (id) => {
    console.log("Open product", id);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 mt-6">
      {products.map((p) => renderProductCard(p, loadProductAndOpen))}
    </div>
  );
}
