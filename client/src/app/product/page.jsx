"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export default function Product() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Gọi API categories khi load trang
  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sắp xếp theo priority tăng dần
          const sorted = data.data.sort((a, b) => a.priority - b.priority);
          setCategories(sorted);
          setActiveCategory(sorted[0]?.id); // chọn danh mục đầu tiên
        }
      })
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  // ✅ Gọi API products khi đổi danh mục
  useEffect(() => {
    if (!activeCategory) return;
    setLoading(true);

    fetch(`http://localhost:3001/api/products?category_id=${activeCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="py-10 text-center px-4 sm:px-6 lg:px-10">
      {/* ===== Tiêu đề ===== */}
      <h2 className="text-[#FF3C1C] text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-10">
        SẢN PHẨM
      </h2>

      {/* ===== Thanh danh mục ===== */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 md:px-6 py-2 rounded-full font-semibold uppercase text-xs md:text-sm transition-all duration-200 
              ${
                activeCategory === cat.id
                  ? "bg-[#FF3C1C] text-white shadow-md"
                  : "border border-[#FF3C1C] text-[#FF3C1C] hover:bg-[#FF3C1C] hover:text-white"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ===== Danh sách sản phẩm ===== */}
      {loading ? (
        <p className="text-gray-500 text-sm">Đang tải sản phẩm...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Chưa có sản phẩm trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative border-2 border-[#FF3C1C] rounded-[20px] p-5 flex flex-col items-center text-center bg-white hover:shadow-lg transition-all duration-300"
            >
              {/* Tag HOT */}
              {product.priority < 105 && (
                <div className="absolute -top-3 -left-3 bg-[#FF3C1C] text-white text-[11px] font-bold px-3 py-[3px] rounded-full shadow-md">
                  🔥 HOT
                </div>
              )}

              {/* Ảnh sản phẩm */}
              <div className="w-full flex justify-center mb-4 mt-3">
                <Image
                  src={`http://localhost:3001${product.image_url}`}
                  alt={product.name}
                  width={260}
                  height={180}
                  className="object-contain h-auto w-[85%]"
                />
              </div>

              {/* Tên sản phẩm */}
              <h3 className="text-[#FF3C1C] font-extrabold text-sm md:text-base uppercase mb-2">
                {product.name}
              </h3>

              {/* Giá tiền */}
              <div className="flex items-center justify-between w-full px-2 mb-4">
                <p className="text-xs md:text-sm text-[#FF3C1C]/80">
                  🍗🍗🍗🍗🍗
                </p>
                <p className="text-[#FF3C1C] font-extrabold text-xs md:text-sm">
                  {parseInt(product.original_price).toLocaleString("vi-VN")} VND
                </p>
              </div>

              {/* Gạch ngăn cách */}
              <div className="w-full h-[1px] bg-[#FF3C1C]/30 mb-4" />

              {/* Nút Mua Ngay + Giỏ hàng */}
              <div className="flex items-center justify-between w-full">
                <button className="bg-[#FF3C1C] text-white text-xs md:text-sm font-bold uppercase rounded-full px-5 py-2 hover:bg-[#ff6347] transition-colors">
                  MUA NGAY
                </button>
                <div className="border border-[#FF3C1C] rounded-full p-2 text-[#FF3C1C] hover:bg-[#FF3C1C] hover:text-white transition-colors cursor-pointer">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
