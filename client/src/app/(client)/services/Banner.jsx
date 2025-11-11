import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="flex justify-center py-6">
      <div className="relative w-[90%] md:w-[80%] overflow-hidden rounded-3xl bg-[#FFE9C5]">
        <Image
          src="/Banner/banner_1.png"
          alt="Gà Lắc Cay"
          width={1920}
          height={600}
          className="w-full h-auto object-cover rounded-3xl"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center pt-40 text-center px-4">
          <h2 className="text-3xl md:text-[45px] font-extrabold text-[#FC4126] mb-5">
            Gà Lắc Cay – Shake It Up!
          </h2>
          <p className="text-[#FC4126] mb-5 font-medium">
            Gà popcorn tẩm bột giòn, lắc cùng bột ớt đặc trưng. <br />
            Càng lắc càng thấm, càng ăn càng cuốn.
          </p>
          <div className="flex justify-center mt-10 mb-16">
            <Link
              href="/product"
              className="bg-[#FC4126] text-white font-extrabold uppercase text-sm py-3 px-8 rounded-full hover:bg-[#e2371f] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ĐẶT HÀNG NGAY
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
