import img1 from "@/assets/4.png";
import img2 from "@/assets/5.jpg";
import img3 from "@/assets/6.jpg";
import img4 from "@/assets/6.jpg"; // demo thêm 1 ảnh

const PRODUCTS = [
    {
        id: 1,
        name: "[Gà Giòn] Combo Tiệc Gà 7 món",
        price: "167.000",
        img: img1,
    },
    {
        id: 2,
        name: "[Gà Nước Mắm] Combo Tiệc Gà 7 món",
        price: "181.000",
        img: img2,
    },
    {
        id: 3,
        name: "[Gà Giòn] Combo Tiệc Gà 7 món (Chọn Xốt)",
        price: "178.000",
        img: img3,
    },
    {
        id: 4,
        name: "[Gà Phô Mai] Combo Tiệc Gà 7 món",
        price: "188.000",
        img: img4,
    },
    {
        id: 5,
        name: "[Gà Giòn] Combo Tiệc Gà 7 món",
        price: "167.000",
        salePrice: "99.000",
        img: img4,
    },
    {
        id: 6,
        name: "[Gà Giòn] Combo Tiệc Gà 7 món",
        price: "167.000",
        salePrice: "99.000",
        img: img4,
    },
];

export default function CategoryProducts({ heading = "Ưu đãi hôm nay" }) {
    const VISIBLE = PRODUCTS.slice(0, 4); // chỉ lấy 4 sp

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-6">
            <div className="flex flex-col items-center gap-2 mb-6">
                <h2 className="text-2xl md:text-[28px] font-extrabold tracking-wide text-[#FF523B]">
                    {heading}
                </h2>
            </div>

            {/* Grid: mobile 2 cột, md 4 cột, không scroll ngang */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {VISIBLE.map((p) => (
                    <article
                        key={p.id}
                        className="w-full flex flex-col rounded-4xl border border-[#e0e0e0]
                       overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                    >
                        <div className="h-36 md:h-60 bg-white/60">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-3 flex flex-col grow">
                            <h3
                                className="text-center text-[#FF523B] font-bold leading-snug
                           text-[13px] md:text-[15px] min-h-[40px] md:min-h-[48px] pl-1 pr-1"
                                title={p.name}
                            >
                                {p.name}
                            </h3>

                            <div className="mt-auto text-center font-semibold text-neutral-900 pb-4">
                                <span className="tabular-nums text-[13px] md:text-[15px] font-bold">
                                    {p.price}
                                </span>
                                <span className="ml-1 text-sm md:text-base underline font-bold">
                                    đ
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <button
                className="block mx-auto mt-8 px-5 py-3 rounded-full
                   bg-[#FF8A00] text-white text-sm font-bold
                   transition-colors duration-200
                   hover:bg-[#FFC98D] active:bg-[#FFBD77] cursor-pointer"
            >
                Xem thêm thực đơn
            </button>

            <div className="mt-8 border-b-1 border-[#f2f2f2] w-full"></div>
        </section>
    );
}
