import Image from "next/image";
import Link from "next/link";

export default function MenuSection() {
  return (
    <section>
      {/* TIÊU ĐỀ */}
      <div className="text-[#FC4126] text-[40px] text-center font-extrabold uppercase pt-10 pb-15">
        Khám phá thực đơn
      </div>

      {/* GRID MENU */}
      <div className="w-[930px] h-[528px] mx-auto grid  md:grid-cols-3 justify-center items-stretch">
        {/* GÀ RÁN - Ô CAO GẤP ĐÔI */}
        <div className="w-[241px] h-[433px] row-span-2 bg-[#FC4126] rounded-2xl flex flex-col items-center justify-start">
          <h3 className="text-white text-[30px] font-extrabold uppercase mt-2 mb-[-10px]">
            Gà rán
          </h3>

          {/* Ảnh trên – miếng gà bay */}
          <div className="relative w-[276px] h-[276px] mb-[-110px] z-10">
            <Image
              src="/Menu_Section/GaRan_1.png"
              alt="Gà rán trên"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Ảnh dưới – hộp gà */}
          <div className="relative w-[286px] h-[243px] z-0">
            <Image
              src="/Menu_Section/GaRan_2.png"
              alt="Hộp gà"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* BURGER */}
        <div className="w-[273px] h-[185px] bg-[#FC4126] rounded-2xl flex flex-col items-center justify-start">
          <div className="relative w-[215px] h-[149px] mt-[-20px]">
            <Image
              src="/Menu_Section/Buger.png"
              alt="Burger"
              fill
              className=""
            />
          </div>
          <h3 className="text-white text-lg text-[28px] font-extrabold uppercase mb-2">
            Burger
          </h3>
        </div>

        {/* KHOAI TÂY */}
        <div className="w-[312px] h-[235px] bg-[#FC4126] rounded-2xl flex flex-col items-center justify-stat">
          <div className="relative w-[202px] h-[244px] mt-[-80px]">
            <Image
              src="/Menu_Section/KhoaiTay.png"
              alt="Khoai tây"
              fill
              className=""
            />
          </div>

          <h3 className="text-white text-[30px] text-lg font-extrabold uppercase mb-3">
            Khoai tây
          </h3>
        </div>

        {/* MÌ Ý */}
        <div className="w-[273px] h-[224px] bg-[#FC4126] rounded-2xl flex flex-col justify-start relative overflow-visible">
          <h3 className="text-white text-[30px] font-extrabold uppercase pt-6 pl-6 z-10">
            Mì Ý
          </h3>

          {/* ẢNH THÌA MÌ (nổi trên, tràn ra ngoài) */}
          <div className="absolute  right-[45px] w-[111px] h-[120px]">
            <Image
              src="/Menu_Section/ThiMiY.png"
              alt="Thìa Mì Ý"
              fill
              className=""
              priority
            />
          </div>

          {/* ẢNH ĐĨA MÌ (nổi xuống dưới nhẹ) */}
          <div className="relative w-[267px] h-[185px] right-[15px] translate-y-3">
            <Image
              src="/Menu_Section/MiY.png"
              alt="Mì Ý"
              fill
              className=""
              priority
            />
          </div>
        </div>

        {/* TRÁNG MIỆNG */}
        <div className="w-[309px] h-[174px] bg-[#FC4126] rounded-2xl flex flex-col justify-center relative overflow-visible">
          {/* TIÊU ĐỀ */}
          <h3 className="text-white text-[28px] font-extrabold uppercase pl-6 leading-tight z-20">
            Tráng <br /> miệng
          </h3>

          {/* LY FANTA (ở sau) */}
          <div className="absolute right-[40px] top-[-43px] w-[173px] h-[173px] z-0">
            <Image
              src="/Menu_Section/Fanta.png"
              alt="Ly Fanta"
              fill
              className=""
              priority
            />
          </div>

          {/* LY KEM (ở trước, lệch phải) */}
          <div className="absolute right-[-35px] bottom-[-25px] w-[208px] h-[167px] z-10">
            <Image
              src="/Menu_Section/kem.png"
              alt="Ly kem"
              fill
              className=""
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 mb-16">
        <Link
          href="/product"
          className="bg-[#FC4126] text-white font-extrabold uppercase text-sm py-3 px-8 rounded-full hover:bg-[#e2371f] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Xem sản phẩm
        </Link>
      </div>

      <div className="flex justify-center gap-20 overflow-x-auto px-6 pb-10">
        {/* Ảnh 1 */}
        <div className="relative w-[241px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_1.png"
            alt="Menu Line 1"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Ảnh 2 */}
        <div className="relative w-[229px] h-[272px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_2.png"
            alt="Menu Line 2"
            fill
            className="object-cover "
          />
        </div>

        {/* Ảnh 3 */}
        <div className="relative w-[230px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_3.png"
            alt="Menu Line 3"
            fill
            className="object-cover"
          />
        </div>

        {/* Ảnh 4 */}
        <div className="relative w-[230px] h-[272px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_4.png"
            alt="Menu Line 4"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Ảnh 5 */}
        <div className="relative w-[230px] h-[366px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/Menu_Section/MenuLine_5.png"
            alt="Menu Line 5"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
