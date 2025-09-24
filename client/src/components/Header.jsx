"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, UserRound } from "lucide-react";
import LogoUrl from "@/assets/crispc.svg";

export default function Header({ setOpenAuthModal }) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-[#FF5A3E] text-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* ===== MOBILE BAR ===== */}
                <div className="flex items-center justify-between h-18 md:hidden">
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
                        <img
                            src={LogoUrl}
                            alt="CRISPC"
                            className="h-10 w-auto object-contain block"
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
                            onClick={setOpenAuthModal}
                        >
                            <UserRound className="h-7 w-7" />
                        </button>
                    </div>
                </div>

                {/* ===== DESKTOP BAR ===== */}
                <div className="hidden md:flex items-center justify-between h-18">
                    <Link
                        href="/"
                        className="inline-flex items-center cursor-pointer"
                    >
                        <img
                            src={LogoUrl}
                            alt="CRISPC"
                            className="h-14 w-auto object-contain shrink-0 block"
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
                            onClick={setOpenAuthModal}
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
                        <img
                            src={LogoUrl}
                            alt="CRISPC"
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
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="block"
                        >
                            <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                TRANG CHỦ
                            </span>
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setOpen(false)}
                            className="block"
                        >
                            <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                VỀ CHÚNG TÔI
                            </span>
                        </Link>
                        <Link
                            href="/product"
                            onClick={() => setOpen(false)}
                            className="block"
                        >
                            <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                THỰC ĐƠN
                            </span>
                        </Link>
                        <Link
                            href="/promotion"
                            onClick={() => setOpen(false)}
                            className="block"
                        >
                            <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                KHUYẾN MÃI
                            </span>
                        </Link>
                        <Link
                            href="/services"
                            onClick={() => setOpen(false)}
                            className="block"
                        >
                            <span className="block text-center px-4 py-3 rounded-sm shadow-sm bg-[#FFF2E0] text-[#FF523B] font-bold uppercase text-[13px]">
                                DỊCH VỤ
                            </span>
                        </Link>
                    </nav>
                </aside>
            </div>
        </header>
    );
}
