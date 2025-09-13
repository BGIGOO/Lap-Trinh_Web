import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";

// Lấy ảnh theo index 0..2 (không dùng array)
function getSrc(n) {
    const m = ((n % 3) + 3) % 3;
    if (m === 0) return img1;
    if (m === 1) return img2;
    return img3;
}

export default function Banner() {
    const [idx, setIdx] = useState(0);

    const prev = () => setIdx((i) => (i - 1 + 3) % 3);
    const next = () => setIdx((i) => (i + 1) % 3);

    const leftIdx = (idx - 1 + 3) % 3;
    const midIdx = idx;
    const rightIdx = (idx + 1) % 3;

    return (
        <section className="py-2 md:py-4">
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
                <div className="relative h-[260px] md:h-[340px] px-2 md:px-4">
                    <div className="flex items-stretch h-full relative">
                        <div className="hidden md:block basis-1/4 flex-[1_0_0] opacity-60 scale-95 transition-all duration-500 z-0">
                            <div className="h-full rounded-2xl overflow-hidden bg-[#FFF2E0] shadow-sm">
                                <img
                                    src={getSrc(leftIdx)}
                                    alt="slide left"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            </div>
                        </div>

                        <div className="relative basis-1/2 flex-[2_0_0] opacity-100 scale-100 transition-all duration-500 z-20">
                            <div className="h-full rounded-2xl overflow-hidden bg-[#FFF2E0] shadow-sm">
                                <img
                                    src={getSrc(midIdx)}
                                    alt="slide center"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            </div>

                            <button
                                onClick={prev}
                                aria-label="Ảnh trước"
                                className="
                                absolute top-1/2 -translate-y-1/2
                                left-3 md:left-0
                                translate-x-0 md:-translate-x-1/2
                                w-9 h-9 md:w-12 md:h-12
                                rounded-full bg-[#FFAF5A]/70 md:bg-[#FFAF5A] 
                                hover:bg-[#FFAF5A]/90 md:hover:bg-[#FFAF5A]
                                text-white grid place-items-center shadow z-30 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </button>

                            <button
                                onClick={next}
                                aria-label="Ảnh sau"
                                className="
                                absolute top-1/2 -translate-y-1/2
                                right-3 md:right-0
                                translate-x-0 md:translate-x-1/2
                                w-9 h-9 md:w-12 md:h-12
                                rounded-full bg-[#FFAF5A]/70 md:bg-[#FFAF5A]
                                hover:bg-[#FFAF5A]/90 md:hover:bg-[#FFAF5A]
                                text-white grid place-items-center shadow z-30 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>

                        <div className="hidden md:block basis-1/4 flex-[1_0_0] opacity-60 scale-95 transition-all duration-500 z-0">
                            <div className="h-full rounded-2xl overflow-hidden bg-[#FFF2E0] shadow-sm">
                                <img
                                    src={getSrc(rightIdx)}
                                    alt="slide right"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
