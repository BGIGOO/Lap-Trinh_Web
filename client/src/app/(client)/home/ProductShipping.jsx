// src/components/ProductShipping.jsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function ProductShipping() {
    const [mode, setMode] = useState("delivery");

    const placeholder =
        mode === "delivery"
            ? "Nhập địa chỉ của bạn hoặc nơi gần bạn"
            : "Nhập địa chỉ, tỉnh/ thành phố của bạn";

    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: call your API
    };

    return (
        <section className="max-w-3xl mx-auto px-4 mt-5">
            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-3">
                <button
                    type="button"
                    aria-pressed={mode === "delivery"}
                    onClick={() => setMode("delivery")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold shadow cursor-pointer
            ${
                mode === "delivery"
                    ? "bg-[#FF8A00] text-white"
                    : "bg-[#EAEAEA] text-gray-600"
            }`}
                >
                    Giao hàng tận nơi
                </button>

                <button
                    type="button"
                    aria-pressed={mode === "pickup"}
                    onClick={() => setMode("pickup")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold shadow cursor-pointer
            ${
                mode === "pickup"
                    ? "bg-[#FF8A00] text-white"
                    : "bg-[#EAEAEA] text-gray-600"
            }`}
                >
                    Đặt đến lấy
                </button>
            </div>

            {/* Search bar */}
            <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 rounded-full border border-gray-300 shadow-sm bg-white px-1 h-10 md:h-12"
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    className="px-5 flex-1 h-full outline-none text-sm md:text-base placeholder:text-gray-400"
                />

                <button
                    type="submit"
                    aria-label="Tìm kiếm"
                    className="shrink-0 grid place-items-center w-16 h-9 md:w-18 md:h-10 rounded-full
                     bg-[#FF8A00] text-white hover:bg-[#FF9F33] transition-colors cursor-pointer"
                >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </form>
        </section>
    );
}
