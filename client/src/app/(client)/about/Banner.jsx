"use client";
import Image from "next/image";
import Link from "next/link";
import { Protest_Strike } from "next/font/google";

const protest = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
});

export default function Banner() {
  return (
    <section className={`flex justify-center py-6 ${protest.className}`}>
      <div className="relative w-[1343px] h-[627px] overflow-hidden rounded-3xl bg-[#FFE9C5]">
        <Image
          src="/Banner/banner_1.png"
          alt="Gà Lắc Cay"
          width={1343}
          height={672}
          className="w-full h-auto object-cover rounded"
          priority
        />

        {/* TEXT OVERLAY */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-[45px] font-extrabold text-[#FC4126] mb-5 uppercase leading-tight">
            Gà Lắc Cay – Shake It Up!
          </h2>
          <p className="text-[#FC4126] mb-6 text-base md:text-lg font-normal">
            Gà popcorn tẩm bột giòn, lắc cùng bột ớt đặc trưng. <br />
            Càng lắc càng thấm, càng ăn càng cuốn.
          </p>
          <Link
            href="/product"
            className="bg-[#FC4126] text-white font-extrabold uppercase text-sm py-3 px-8 rounded-full hover:bg-[#e2371f] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Đặt hàng ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
