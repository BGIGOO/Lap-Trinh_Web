"use client";
import Image from "next/image";
import { Protest_Strike } from "next/font/google";

const protest = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
});

export default function MenuVariety() {
  return (
    <section
      className={`w-full flex flex-col md:flex-row items-center justify-center bg-[#FFE9BF] ${protest.className}`}
    >
      {/* HÌNH ẢNH BÊN TRÁI */}
      <div className="md:w-1/2 w-full flex justify-center md:justify-end">
        <Image
          src="/Services/10.png"
          alt="Đa dạng các món ăn"
          width={735}
          height={600}
          className="object-cover w-full  h-auto"
        />
      </div>

      {/* NỘI DUNG BÊN PHẢI */}
      <div className="md:w-1/2 w-full text-left px-8 md:px-16 py-12 md:py-0">
        <h2 className="text-[#FC4126] font-extrabold text-[36px] md:text-[42px] uppercase mb-5 leading-tight">
          ĐA DẠNG CÁC MÓN ĂN
        </h2>
        <p className="text-[#FC4126] leading-relaxed text-[15px] md:text-[16px] mb-8">
          Tại CrispC, mỗi món ăn là một “cuộc phiêu lưu vị giác” dành riêng cho
          dân mê cay, thích giòn và luôn muốn thử cái mới. Từ gà rán đa vị –
          giòn tan bên ngoài, đậm đà bên trong, với đủ cấp độ cay từ “nóng hổi”
          đến “bốc lửa” – cho đến hamburger gà cay, mỳ Ý phô mai béo ngậy, hay
          khoai chiên giòn tan, tất cả đều được chế biến chuẩn vị, tươi ngon mỗi
          ngày.
        </p>
        <button className="bg-[#FC4126] text-white font-extrabold uppercase text-sm py-3 px-8 rounded-full hover:bg-[#e2371f] transition-all duration-300 shadow-md hover:shadow-lg">
          Xem thêm
        </button>
      </div>
    </section>
  );
}
