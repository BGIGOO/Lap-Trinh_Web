import img1 from "@/assets/4.png";
import img2 from "@/assets/5.jpg";
import img3 from "@/assets/6.jpg";

const PRODUCTS = [
    {
        id: 1,
        name: "Combo Gà giòn - 1 miếng (Alacarte)",
        price: "69.000",
        img: img1,
    },
    {
        id: 2,
        name: "Combo Gà giòn - 2 miếng (Alacarte)",
        price: "59.000",
        img: img2,
    },
    { id: 3, name: "1 Miếng gà giòn (Alacarte)", price: "79.000", img: img3 },
    {
        id: 4,
        name: "Khoai tây chiên size vừa (Alacarte)",
        price: "129.000",
        img: img1,
    },
];

export default function ProductList() {
    const featured = PRODUCTS.slice(0, 4);

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-8">
            <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-2xl md:text-[28px] font-extrabold tracking-wide text-[#FF523B]">
                    CHICKEN TODAY
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
                {featured.map((p) => (
                    <article
                        key={p.id}
                        className="flex flex-col rounded-4xl border border-[#e0e0e0]  overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
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

                            <div className="mt-auto text-center font-semibold text-neutral-900 pb-5">
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
        </section>
    );
}
