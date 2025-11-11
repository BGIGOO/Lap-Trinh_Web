"use client";
import Image from "next/image";
import { Protest_Strike } from "next/font/google";

const protest = Protest_Strike({
  subsets: ["latin"],
  weight: "400",
});

export default function PartySection() {
  return (
    <section
      className={`w-full bg-[#FFE9BF] flex flex-col md:flex-row items-center justify-center py-16 px-8 md:px-24 ${protest.className}`}
    >
      {/* LEFT TEXT */}
      <div className="md:w-1/2 w-full text-left md:pr-16">
        <h2 className="text-[#FC4126] text-[36px] md:text-[42px] font-extrabold uppercase mb-6 leading-tight">
          NHẬP TIỆC CÙNG CRISPC
        </h2>

        <p className="text-[#FC4126] leading-relaxed mb-4 text-[15px]">
          Tại CrispC, mỗi buổi gặp gỡ đều đáng để bùng vị! Dù là tiệc sinh nhật
          rộn ràng, tụ hội bạn bè cháy vibe, họp mặt gia đình ấm cúng, hay Kid
          Club cho bé vui hết nấc, chúng tôi đều có không gian và combo riêng để
          bữa ăn trở nên trọn vẹn hơn bao giờ hết. CrispC không chỉ là nơi
          thưởng thức gà rán cay giòn trứ danh, mà còn là điểm hẹn để bạn ăn
          ngon – vui trọn – chill đúng vibe.
        </p>

        <p className="text-[#FC4126] leading-relaxed mb-8 text-[15px]">
          <span className="font-semibold text-[#FC4126]">
            Đặt bàn ngay hôm nay để CrispC “chiêu đãi” bạn theo cách đậm chất
            Gen Z nhất!
          </span>
        </p>

        {/* BUTTON */}
        <div className="flex justify-center md:justify-start">
          <button className="bg-[#FC4126] text-white font-extrabold uppercase text-sm py-3 px-8 rounded-full hover:bg-[#e2371f] transition-all duration-300 shadow-md hover:shadow-lg">
            Xem thêm
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="md:w-1/2 w-full mt-10 md:mt-0 flex justify-center">
        <Image
          src="/Services/5.png"
          alt="Nhập tiệc cùng CrispC"
          width={762}
          height={600}
          className="rounded-xl shadow-md object-cover"
        />
      </div>
    </section>
  );
}
