// src/components/ProductList.jsx
import img1 from "@/assets/4.png";
import img2 from "@/assets/4.png";
import img3 from "@/assets/4.png";

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
            {/* Heading */}
            <div className="flex flex-col items-center gap-2 mb-4">
                <div className="h-3 w-40 rounded-full bg-[#FFF2E0]" />
                <h2 className="text-2xl md:text-[28px] font-extrabold tracking-wide text-[#FF523B]">
                    CHICKEN TODAY
                </h2>
            </div>

            {/* 4 cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
                {featured.map((p) => (
                    <article
                        key={p.id}
                        className="flex flex-col rounded-4xl border border-[#e0e0e0]  overflow-hidden transition-shadow hover:shadow-md"
                    >
                        {/* Ảnh: aspect để đồng nhất, không méo */}
                        <div className="h-36 md:h-60 bg-white/60">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Nội dung: đẩy giá xuống đáy cho đều */}
                        <div className="p-3 flex flex-col grow">
                            <h3
                                className="text-center text-[#FF523B] font-semibold leading-snug
                           text-[13px] md:text-[15px] min-h-[40px] md:min-h-[48px] pl-1 pr-1"
                                title={p.name}
                            >
                                {p.name}
                            </h3>

                            <div className="mt-auto text-center font-semibold text-neutral-900 pb-5">
                                <span className="tabular-nums text-[13px] md:text-[15px]">
                                    {p.price}
                                </span>
                                <span className="ml-1 text-sm md:text-base">
                                    đ
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
