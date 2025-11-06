import Image from "next/image";

export default function OurStory() {
  return (
    <section
      id="about"
      className="relative w-full flex flex-col md:flex-row overflow-hidden min-h-[848px]"
    >
      {/* --- LEFT CONTENT --- */}
      <div className="w-full md:w-1/2 flex flex-col  px-8 md:px-16 py-8 bg-white ">
        <div className="">
          <h2 className="text-[#FC4126] text-3xl md:text-5xl font-extrabold uppercase mb-4 leading-tight">
            Câu chuyện CrispC
          </h2>

          <h3 className="text-[#FC4126] font-bold uppercase mb-6 leading-relaxed text-lg md:text-xl">
            Biến món gà rán quen thuộc thành trải nghiệm bùng vị thật sự
          </h3>

          <p className="text-[#FC4126] leading-relaxed mb-5 text-base md:text-lg">
            Chúng tôi tin rằng những bữa ăn đáng nhớ nhất thường là những bữa ăn
            có một chút phá cách. Với nhiều người thuộc thế hệ X và các gia
            đình, ý tưởng đó trùng khớp với ký ức về những buổi tối “xõa” hết
            mình, khi cha mẹ tạm gác lại các quy tắc và cả nhà cùng nhau thưởng
            thức một bữa ăn thật sảng khoái.
          </p>

          <p className="text-[#FC4126] leading-relaxed text-base md:text-lg">
            Với nhiều gia đình và thế hệ X, chúng tôi nhớ về những ngày mà một
            bữa ăn ngon không chỉ là để no bụng, mà còn là một phần thưởng, một
            sự “nổi loạn” nho nhỏ khỏi những bữa cơm thường ngày. Đó là âm thanh
            của tiếng cười giòn tan khi cả nhà quây quần bên nhau. CrispC tượng
            trưng cho niềm vui được phá vỡ khuôn khổ và chia sẻ những bữa ăn đậm
            đà, hứng khởi bên những người thân yêu.
          </p>
        </div>
      </div>

      {/* --- RIGHT IMAGE --- */}
      <div className="w-full md:w-1/2 relative min-h-[800px] md:min-h-[550px] overflow-hidden">
        <Image
          src="/story_img.png"
          alt="Câu chuyện CrispC"
          fill
          className=""
          priority
        />
      </div>

      {/* --- ICON DƯỚI CÙNG, NẰM NGOÀI NỘI DUNG --- */}
      <div className="absolute bottom-0 left-0 w-1/2 z-20">
        <Image
          src="/story_icon.png"
          alt="CrispC Chicken Icon"
          width={1200}
          height={200}
          className="w-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
