"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/3.jpg";
import Pagination from "../promotion/Pagination";

const images = [img1, img2, img3, img4];

export default function Banner() {
  return (
    <section className="py-4 w-full">
      <Swiper
        modules={[Autoplay,Pagination]}
        slidesPerView={"auto"}
        centeredSlides={true}
        loop={true}
        loopAdditionalSlides={2}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="overflow-visible"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide-custom transition-all duration-500"
          >
            <Link href="/product">
              <div className="relative w-[986px] h-[300px] mx-auto rounded-3xl overflow-hidden">
                <Image
                  src={src}
                  alt="banner"
                  fill
                  className="object-cover rounded-3xl transition-all duration-500"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-slide-custom {
          width: 986px !important; /* set đúng size Popeyes */
          opacity: 0.28;
          transform: scale(0.93);
          transition: all 0.45s ease;
        }

        .swiper-slide-active {
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        .swiper-slide-prev,
        .swiper-slide-next {
          opacity: 0.28 !important;
          transform: scale(0.93) !important;
        }
      `}</style>
    </section>
  );
}
