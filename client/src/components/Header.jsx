"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, UserRound } from "lucide-react";

export default function Header({ setOpenAuthModal }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/promotion", label: "KHUYẾN MÃI" },
    { href: "/product", label: "THỰC ĐƠN" },
    { href: "/services", label: "CỬA HÀNG" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F97316]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_header.png"
            alt="CRisP"
            width={140}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        {/* MENU TRUNG TÂM */}
        <nav className="flex items-center gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white font-extrabold uppercase text-lg tracking-wide border-b-2 pb-1 transition-all ${
                pathname === item.href
                  ? "border-white"
                  : "border-transparent hover:border-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ICON BÊN PHẢI */}
        <div className="flex items-center gap-6">
          {/* User */}
          <button
            type="button"
            onClick={() => setOpenAuthModal?.(true)}
            className="text-white hover:opacity-80 transition"
          >
            <UserRound className="h-6 w-6" />
          </button>

          {/* Cart */}
          <Link href="/cart" className="text-white hover:opacity-80 transition">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
