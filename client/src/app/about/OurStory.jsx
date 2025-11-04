import Image from "next/image";

export default function OurStory() {
  return (
    <section
      id="about"
      className="w-full flex flex-col md:flex-row items-stretch overflow-hidden"
    >
      {/* LEFT CONTENT */}
      <div className="w-full md:w-1/2  flex flex-col justify-between px-8 md:px-16 py-10 ">
        <div>
          <h2 className="text-[#FC4126] text-3xl md:text-4xl font-extrabold uppercase mb-3">
            Câu chuyện CrispC
          </h2>

          <h3 className="text-[#FC4126] font-bold uppercase mb-5 leading-relaxed">
            Biến món gà rán quen thuộc thành trải nghiệm bùng vị thật sự
          </h3>

          <p className="text-[#FC4126] leading-relaxed mb-4">
            Chúng tôi tin rằng những bữa ăn đáng nhớ nhất thường là những bữa ăn
            có một chút phá cách. Với nhiều người thuộc thế hệ X và các gia
            đình, ý tưởng đó trùng khớp với ký ức về những buổi tối “xõa” hết
            mình, khi cha mẹ tạm gác lại các quy tắc và cả nhà cùng nhau thưởng
            thức một bữa ăn thật sảng khoái.
          </p>

          <p className="text-[#FC4126] leading-relaxed">
            Với nhiều gia đình và thế hệ X, chúng tôi nhớ về những ngày mà một
            bữa ăn ngon không chỉ là để no bụng, mà còn là một phần thưởng, một
            sự “nổi loạn” nho nhỏ khỏi những bữa cơm thường ngày. Đó là âm thanh
            của tiếng cười giòn tan khi cả nhà quây quần bên nhau. CrispC tượng
            trưng cho niềm vui được phá vỡ khuôn khổ và chia sẻ những bữa ăn đậm
            đà, hứng khởi bên những người thân yêu.
          </p>
        </div>

        {/* Chicken Icon + Line */}
        <div className="mt-20 w-full bottom-0 left-0">
          <Image
            src="/story_icon.png"
            alt="CrispC Chicken Mascot"
            width={800}
            height={120}
            className="w-full object-contain"
          />
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-full md:w-1/2 relative h-[350px] md:h-auto">
        <Image
          src="/story_img.png"
          alt="Câu chuyện CrispC"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
