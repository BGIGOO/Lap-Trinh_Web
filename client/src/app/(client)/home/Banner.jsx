"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";

const images = [img1, img2, img3];

export default function Banner() {
    return (
        <section className="py-4 md:py-4">
            <div className="max-w-7xl mx-auto px-6">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1}
                    loop={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    className="rounded-2xl overflow-hidden shadow-md"
                >
                    {images.map((src, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative w-full h-[240px] md:h-[380px] bg-[#FFF2E0] group">
                                <Image
                                    src={src}
                                    alt={`slide ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />

                                <div
                                    className="
                    absolute inset-0 flex flex-col items-center justify-center 
                    opacity-0 group-hover:opacity-100 
                    bg-black/15 group-hover:bg-black/15 
                    transition-all duration-500
                  "
                                >
                                    <Link
                                        href="/order"
                                        className="
                      bg-[#FC4126] text-white text-sm md:text-base font-semibold uppercase 
                      rounded-full px-6 py-2 md:px-8 md:py-3 
                      hover:bg-[#ff6b47] transition-all shadow-lg
                      translate-y-4 group-hover:translate-y-0 duration-500
                    "
                                    >
                                        Đặt hàng ngay
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
