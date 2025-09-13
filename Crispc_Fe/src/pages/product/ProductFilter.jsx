// src/components/ProductFilter.jsx
import { useEffect, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import imgAll from "@/assets/tatca.png";
import imgDeal from "@/assets/uudaihomnay.png";
import imgNew from "@/assets/monmoi.png";
import imgCrispy from "@/assets/gagion.png";
import imgCheese from "@/assets/gaxotphomai.png";

const CATS = [
    { key: "all", label: "Tất cả", img: imgAll },
    { key: "deal", label: "Ưu đãi hôm nay", img: imgDeal },
    { key: "new", label: "Món mới", img: imgNew },
    { key: "crispy", label: "Gà giòn", img: imgCrispy },
    { key: "cheese", label: "Gà xốt phô mai", img: imgCheese },
    { key: "fishsauce", label: "Gà tẩm nước mắm", img: imgCrispy },
];

export default function ProductFilter({
    value = "deal",
    onChange,
    onSearchClick,
}) {
    const [active, setActive] = useState(value);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);
    const trackRef = useRef(null);

    useEffect(() => setActive(value), [value]);

    const updateArrows = () => {
        const el = trackRef.current;
        if (!el) return;
        const { scrollLeft, clientWidth, scrollWidth } = el;
        setCanLeft(scrollLeft > 0);
        setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        const onResize = () => updateArrows();
        window.addEventListener("resize", onResize);
        el.addEventListener("scroll", updateArrows);
        return () => {
            window.removeEventListener("resize", onResize);
            el?.removeEventListener("scroll", updateArrows);
        };
    }, []);

    const select = (k) => {
        setActive(k);
        onChange?.(k);
    };

    const scrollByStep = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const step = Math.round(el.clientWidth * 0.6);
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <section className="max-w-3xl mx-auto px-4 md:px-0">
            <div className="relative flex items-center gap-3 py-3">
                <button
                    onClick={() => scrollByStep(-1)}
                    aria-label="Prev"
                    disabled={!canLeft}
                    className={`shrink-0 grid place-items-center w-10 h-10 rounded-full
            transition-colors cursor-pointer
            ${
                canLeft
                    ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                    ref={trackRef}
                    className="flex items-center gap-6 overflow-x-auto scroll-smooth no-scrollbar flex-1"
                >
                    {CATS.map((c) => {
                        const isActive = active === c.key;
                        return (
                            <button
                                key={c.key}
                                onClick={() => select(c.key)}
                                className="shrink-0 flex flex-col items-center gap-1 cursor-pointer"
                                aria-pressed={isActive}
                            >
                                <ColorIcon src={c.img} active={isActive} />
                                <span
                                    className={`text-xs md:text-sm font-semibold transition
          ${isActive ? "text-[#FF8A00]" : "text-gray-400"}`}
                                >
                                    {c.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => scrollByStep(1)}
                    aria-label="Next"
                    disabled={!canRight}
                    className={`shrink-0 grid place-items-center w-10 h-10 rounded-full
            transition-colors cursor-pointer
            ${
                canRight
                    ? "bg-[#FF8A00] text-white hover:bg-[#FFA33A]"
                    : "bg-orange-100 text-white/60 cursor-not-allowed"
            }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                <button
                    onClick={onSearchClick}
                    aria-label="Tìm kiếm"
                    className="shrink-0 grid place-items-center w-10 h-10 rounded-full
                     bg-[#19BFB0] text-white hover:opacity-90 transition cursor-pointer"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}

function ColorIcon({ src, active, className = "" }) {
    return (
        <span
            aria-hidden="true"
            className={`${className} block w-10 h-10 md:w-14 md:h-14 transition
                  ${active ? "bg-[#FF8A00]" : "bg-gray-400 opacity-50"}`}
            style={{
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
            }}
        />
    );
}
