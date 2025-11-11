"use client";
import Image from "next/image";
import { Protest_Strike } from "next/font/google";

const protest = Protest_Strike({ subsets: ["latin"], weight: "400" });

export default function ServicesSection() {
  return (
    <section
      className={`w-full bg-[#FC4126] py-16 px-6 md:px-16 ${protest.className}`}
    >
      {/* TITLE */}
      <h2 className="text-white text-center text-[36px] md:text-[42px] font-extrabold uppercase mb-12">
        CÁC DỊCH VỤ CỦA CRISPC
      </h2>

      {/* GRID 4 CARD – mỗi card chỉnh riêng */}
      <div className="max-w-[1150px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {/* CARD 1 */}
        <div className="flex flex-col items-center text-center">
          {/* 👉 chỉnh size tại width/height + w-* h-* */}
          <div className="w-[220px] h-[289px]">
            <Image
              src="/Services/6.png"
              alt="TIỆC SINH NHẬT"
              width={220}
              height={289}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <h3 className="text-white uppercase tracking-wide text-[18px] mt-4 mb-2">
            TIỆC SINH NHẬT
          </h3>
          <p className="text-white/90 text-[14px] leading-relaxed max-w-[220px]">
            CrispC mang đến không gian sinh nhật ấm cúng, rộn ràng với set menu
            chọn sẵn, trang trí sinh nhật theo chủ đề, cùng ưu đãi quà tặng đặc
            biệt cho chủ tiệc.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[223px] h-[289px]">
            <Image
              src="/Services/7.png"
              alt="TIỆC GIA ĐÌNH"
              width={223}
              height={289}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <h3 className="text-white uppercase tracking-wide text-[18px] mt-4 mb-2">
            TIỆC GIA ĐÌNH
          </h3>
          <p className="text-white/90 text-[14px] leading-relaxed max-w-[223px]">
            Cuối tuần bên nhau, cùng chia sẻ từng miếng gà thơm ngon. Không gian
            thoải mái, phù hợp cho gia đình có trẻ nhỏ hoặc người lớn tuổi.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[244px] h-[289px]">
            <Image
              src="/Services/8.png"
              alt="TỤ HỢP BẠN BÈ"
              width={244}
              height={289}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <h3 className="text-white uppercase tracking-wide text-[18px] mt-4 mb-2">
            TỤ HỢP BẠN BÈ
          </h3>
          <p className="text-white/90 text-[14px] leading-relaxed max-w-[244px]">
            Không gian lý tưởng để “xõa” cùng hội bạn! Thưởng thức combo gà rán,
            khoai giòn, nước uống refill cùng chương trình “Happy Hour” sau giờ
            làm.
          </p>
        </div>

        {/* CARD 4 */}
        <div className="flex flex-col items-center text-center">
          {/* ví dụ ảnh 4 khác size một chút */}
          <div className="w-[230px] h-[289px]">
            <Image
              src="/Services/9.png"
              alt="KIDS CLUB"
              width={230}
              height={289}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <h3 className="text-white uppercase tracking-wide text-[18px] mt-4 mb-2">
            KIDS CLUB
          </h3>
          <p className="text-white/90 text-[14px] leading-relaxed max-w-[230px]">
            Câu lạc bộ dành riêng cho bé yêu – nơi các bé vừa thưởng thức gà rán
            giòn rụm vừa tham gia các hoạt động sáng tạo như tô màu, xếp hình,
            mini game.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-12">
        <button className="bg-white text-[#FC4126] uppercase text-sm py-3 px-10 rounded-full shadow-md hover:bg-[#ffe4dc] transition-all">
          Xem thêm
        </button>
      </div>
    </section>
  );
}
