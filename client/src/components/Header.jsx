"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, UserRound } from "lucide-react";

export default function Header({ setOpenAuthModal }) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-[#FF5A3E] text-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* ===== MOBILE BAR ===== */}
                <div className="flex items-center justify-between h-16 md:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Mở menu"
                        className="p-2 cursor-pointer hover:text-[#FFAF5A] transition-colors"
                    >
                        <Menu className="h-7 w-7" />
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center cursor-pointer"
                    >
                        <Image
                            src="/crispc.svg"
                            alt="CRISPC"
                            width={120}
                            height={40}
                            priority
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="flex items-center gap-1">
                        <Link
                            href="/cart-detail"
                            aria-label="Giỏ hàng"
                            className="p-2 cursor-pointer hover:text-[#FFAF5A] transition-colors"
                        >
                            <ShoppingCart className="h-7 w-7" />
                        </Link>
                        <button
                            type="button"
                            aria-label="Tài khoản"
                            className="p-2 cursor-pointer hover:text-[#FFAF5A] transition-colors"
                            onClick={() => setOpenAuthModal?.(true)}
                        >
                            <UserRound className="h-7 w-7" />
                        </button>
                    </div>
                </div>

                {/* ===== DESKTOP BAR ===== */}
                <div className="hidden md:flex items-center justify-between h-16">
                    <Link
                        href="/"
                        className="inline-flex items-center cursor-pointer"
                    >
                        <Image
                            src="/crispc.svg"
                            alt="CRISPC"
                            width={160}
                            height={56}
                            priority
                            className="h-14 w-auto object-contain shrink-0"
                        />
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="px-3 py-2 text-[#FF523B] text-[13px] font-bold uppercase rounded-sm bg-[#FFF2E0] hover:bg-[#FFAF5A] transition-colors duration-200 cursor-pointer"
                        >
                            TRANG CHỦ
                        </Link>
                        <Link
                            href="/product"
                            className="px-3 py-2 text-[#FF523B] text-[13px] font-bold uppercase rounded-sm bg-[#FFF2E0] hover:bg-[#FFAF5A] transition-colors duration-200 cursor-pointer"
                        >
                            THỰC ĐƠN
                        </Link>
                        <Link
                            href="/book-party"
                            className="px-3 py-2 text-[#FF523B] text-[13px] font-bold uppercase rounded-sm bg-[#FFF2E0] hover:bg-[#FFAF5A] transition-colors duration-200 cursor-pointer"
                        >
                            ĐẶT TIỆC
                        </Link>
                        <Link
                            href="/promotion"
                            className="px-3 py-2 text-[#FF523B] text-[13px] font-bold uppercase rounded-sm bg-[#FFF2E0] hover:bg-[#FFAF5A] transition-colors duration-200 cursor-pointer"
                        >
                            KHUYẾN MÃI
                        </Link>
                        <Link
                            href="/about"
                            className="px-3 py-2 text-[#FF523B] text-[13px] font-bold uppercase rounded-sm bg-[#FFF2E0] hover:bg-[#FFAF5A] transition-colors duration-200 cursor-pointer"
                        >
                            VỀ CRISPC
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/cart-detail"
                            aria-label="Giỏ hàng"
                            className="p-2 text-white hover:text-[#FFAF5A] transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="h-8 w-8" />
                        </Link>
                        <button
                            type="button"
                            aria-label="Tài khoản"
                            className="p-2 text-white hover:text-[#FFAF5A] transition-colors cursor-pointer"
                            onClick={() => setOpenAuthModal?.(true)}
                        >
                            <UserRound className="h-8 w-8" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE DRAWER ===== */}
            <div
                className={`fixed inset-0 z-50 md:hidden ${
                    open ? "" : "pointer-events-none"
                }`}
            >
                <div
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-black/30 transition-opacity ${
                        open ? "opacity-100" : "opacity-0"
                    }`}
                />
                <aside
                    className={`absolute left-0 top-0 h-full w-72 bg-[#FFAF5A] shadow-xl transition-transform duration-300 ${
                        open ? "translate-x-0" : "-translate-x-full"
                    }`}
                    aria-hidden={!open}
                >
                    <div className="p-4 flex items-center justify-between">
                        <Image
                            src="/crispc.svg"
                            alt="CRISPC"
                            width={112}
                            height={32}
                            className="h-8 w-auto object-contain"
                        />
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Đóng"
                            className="p-1"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="px-4 pb-8 space-y-3">
                        {[
                            { href: "/", label: "TRANG CHỦ" },
                            { href: "/about", label: "VỀ CHÚNG TÔI" },
                            { href: "/product", label: "THỰC ĐƠN" },
                            { href: "/promotion", label: "KHUYẾN MÃI" },
                            { href: "/services", label: "DỊCH VỤ" },
                        ].map((i) => (
                            <Link
                                key={i.href}
                                href={i.href}
                                onClick={() => setOpen(false)}
                                className="block"
                            >
                                <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                    {i.label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </aside>
            </div>
        </header>
    );
}
