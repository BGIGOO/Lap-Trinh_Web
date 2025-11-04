import Image from "next/image";

export default function IngredientsSection() {
  return (
    <section className="w-full">
      {/* --- PHẦN TRÊN: NGUYÊN LIỆU --- */}
      <div className="relative bg-[#FC4126] text-white text-center pt-10 pb-[600px] px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold pb-20">
          Chúng tôi chọn nguyên liệu tốt nhất, tạo nên món gà giòn – cay – khác
          biệt nhất
        </h2>

        {/* HÀNG HÌNH NGUYÊN LIỆU */}
        <div className="absolute w-full h-full top-0 left-0">
          <div className="absolute left-[10%] top-[60%]">
            <Image
              src="/Ingredients/ingre_1.png"
              alt="Bột chiên"
              width={300}
              height={110}
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="absolute left-[25%] top-[18%]">
            <Image
              src="/Ingredients/ingre_2.png"
              alt="Ớt"
              width={300}
              height={110}
              className=""
            />
          </div>

          <div className="absolute right-[25%] top-[18%]">
            <Image
              src="/Ingredients/ingre_3.png"
              alt="Ớt"
              width={300}
              height={110}
              className=""
            />
          </div>

          <div className="absolute right-[10%] top-[60%]">
            <Image
              src="/Ingredients/ingre_4.png"
              alt="Bột chiên"
              width={300}
              height={110}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* HÌNH GÀ CHÍNH — NẰM GIỮA HAI PHẦN */}
        <div className="absolute left-1/2 bottom-[-250px] -translate-x-1/2 z-20">
          <Image
            src="/Ingredients/ingre_5.png"
            alt="Gà giòn cay"
            width={500}
            height={500}
            className="rounded-full"
          />
        </div>
      </div>

      {/* --- PHẦN DƯỚI: HƯƠNG VỊ VÀ THÔNG TIN --- */}
      <div className="bg-white text-[#FC4126] text-center pt-[350px] pb-12 px-4 relative">
        {/* HÀNG 3 Ô THÔNG TIN */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
          <div className="border border-[#FC4126] bg-[#FFF5E8] rounded-2xl p-6 hover:shadow-md transition">
            <h4 className="font-bold mb-2">
              NGUỒN NGUYÊN LIỆU TƯƠI SẠCH, MINH BẠCH
            </h4>
            <p className="text-sm text-[#FC4126]/90">
              Chúng tôi tin rằng một món ăn ngon bắt đầu từ những nguyên liệu
              hoàn hảo. Gà được tuyển chọn kỹ lưỡng và ướp theo công thức đặc
              trưng.
            </p>
          </div>

          <div className="border border-[#FC4126] bg-[#FFF5E8] rounded-2xl p-6 hover:shadow-md transition">
            <h4 className="font-bold mb-2">GIA VỊ BÍ MẬT ĐÁNH THỨC VỊ GIÁC</h4>
            <p className="text-sm text-[#FC4126]/90">
              Công thức “gia vị tuyệt mật” kết hợp hơn 10 loại thảo mộc tự
              nhiên, tạo nên hương vị đậm đà, khó quên.
            </p>
          </div>

          <div className="border border-[#FC4126] bg-[#FFF5E8] rounded-2xl p-6 hover:shadow-md transition">
            <h4 className="font-bold mb-2">
              CĂN BẾP NGĂN NẮP, NIỀM AN TÂM TRỌN VẸN
            </h4>
            <p className="text-sm text-[#FC4126]/90">
              Mọi quy trình chế biến đều đảm bảo vệ sinh và sự tận tâm, mang lại
              sự yên tâm tuyệt đối trong từng miếng gà.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
