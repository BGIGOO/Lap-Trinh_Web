"use client";
import Image from "next/image";
import { Protest_Strike } from "next/font/google";

// import font
const protest = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
});

export default function Booking() {
  return (
    <section className={`py-16 bg-white text-center ${protest.className}`}>
      {/* TIÊU ĐỀ */}
      <h2 className="text-[#FC4126] font-extrabold text-[50px] uppercase leading-tight">
        Dịch vụ đặt bàn CrispC
        <br />
        <span className="text-[#FC4126]">“Bùng vị mọi khoảnh khắc”</span>
      </h2>

      {/* HÌNH ẢNH */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <div className="w-[249px] h-[311px] overflow-hidden rounded-2xl">
          <Image
            src="/Services/1.png"
            alt="CrispC 1"
            width={249}
            height={311}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-[260px] h-[325px] overflow-hidden rounded-2xl">
          <Image
            src="/Services/2.png"
            alt="CrispC 2"
            width={260}
            height={325}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-[256px] h-[323px] overflow-hidden rounded-2xl">
          <Image
            src="/Services/3.png"
            alt="CrispC 3"
            width={256}
            height={323}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-[246px] h-[326px] overflow-hidden rounded-2xl">
          <Image
            src="/Services/4.png"
            alt="CrispC 4"
            width={246}
            height={326}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
