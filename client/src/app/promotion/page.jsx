"use client";

import { useState } from "react";
import Image from "next/image";
import Pagination from "./Pagination";

import promo01 from "@/assets/promotion01.jpg";
import promo02 from "@/assets/promotion02.jpg";
import promo03 from "@/assets/promotion03.jpg";
import promo04 from "@/assets/promotion04.jpg";
import promo05 from "@/assets/promotion04.jpg";
import promo06 from "@/assets/promotion03.jpg";
import promo07 from "@/assets/promotion02.jpg";
import promo08 from "@/assets/promotion01.jpg";

const PROMOS = [
    { id: 1, title: "Thứ 2 Mua 1 Tặng 1", img: promo01, available: false },
    {
        id: 2,
        title: "Đặt đơn online nhận thêm ưu đãi",
        img: promo02,
        available: true,
    },
    {
        id: 3,
        title: "Combo tiệc gà 7 món chỉ từ 99,000đ",
        img: promo03,
        available: true,
    },
    { id: 4, title: "Mua 1 tặng 1 Thứ 4", img: promo04, available: false },
    {
        id: 5,
        title: "Siêu tiệc Mì Ý Thứ 3 & Thứ 5 hằng tuần",
        img: promo05,
        available: false,
    },
    {
        id: 6,
        title: "Chính thức ra mắt bộ sưu tập Mì Ý Phô Mai mới toanh",
        img: promo06,
        available: true,
    },
    {
        id: 7,
        title: "Đình lưu Cajun Cheese chính thức trở lại (Gà xốt phô mai)",
        img: promo07,
        available: true,
    },
    {
        id: 8,
        title: "Combo 1 người 'Siêu No' chỉ 89K",
        img: promo08,
        available: true,
    },
    {
        id: 9,
        title: "Combo 1 người 'Siêu No' chỉ 89K",
        img: promo08,
        available: true,
    },
    {
        id: 10,
        title: "Combo 1 người 'Siêu No' chỉ 89K",
        img: promo08,
        available: true,
    },
];

const PAGE_SIZE = 8; // giữ nguyên như bạn đang dùng

export default function Promotion() {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(PROMOS.length / PAGE_SIZE);

    const start = (page - 1) * PAGE_SIZE;
    const shown = PROMOS.slice(start, start + PAGE_SIZE); // ✅ dùng shown để phân trang

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {shown.map((p) => (
                    <article
                        key={p.id}
                        className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                    >
                        <div className="relative bg-gray-50 aspect-[4/4.2] md:aspect-[4/4.2]">
                            <Image
                                src={p.img}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                            />
                        </div>

                        <div className="px-4 py-4 text-center">
                            <h3 className="text-neutral-800 font-semibold text-[14px] md:text-[15px] min-h-[44px] md:min-h-[48px]">
                                {p.title}
                            </h3>

                            {p.available ? (
                                <button
                                    className="mt-3 w-full h-11 rounded-full bg-[#FF8A00] text-white
                             font-bold hover:bg-[#FFA33A] transition-colors text-sm cursor-pointer"
                                >
                                    Đặt ngay
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="mt-3 w-full h-11 rounded-full bg-gray-200 text-gray-600
                             font-bold cursor-not-allowed text-sm"
                                >
                                    Không khả dụng hôm nay
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
            />
        </section>
    );
}
