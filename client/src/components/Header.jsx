"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, UserRound } from "lucide-react";

export default function Header({ setOpenAuthModal }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "TRANG CHỦ" },
    { href: "/about", label: "VỀ CHÚNG TÔI" },
    { href: "/product", label: "SẢN PHẨM" },
    { href: "/services", label: "DỊCH VỤ" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FF3C1C] py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between bg-white rounded-full px-6 py-3 shadow-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_header.png"
              alt="CRisP"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Menu trung tâm */}
          <nav className="flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[#FF3C1C] font-semibold uppercase text-sm pb-1 transition-colors hover:text-[#FF6C3E] border-b-2 ${
                  pathname === item.href
                    ? "border-[#FF3C1C]"
                    : "border-transparent hover:border-[#FF6C3E]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Nút và Icon */}
          <div className="flex items-center gap-4">
            <Link
              href="/order"
              className="bg-[#FF3C1C] text-white text-sm font-semibold uppercase rounded-full px-5 py-2 hover:bg-[#ff6347] transition-colors"
            >
              ĐẶT HÀNG NGAY
            </Link>

            <button
              type="button"
              aria-label="Tài khoản"
              onClick={() => setOpenAuthModal?.(true)}
              className="text-[#FF3C1C] hover:text-[#FF6C3E] transition-colors"
            >
              <UserRound className="h-6 w-6" />
            </button>

            <Link
              href="/cart-detail"
              aria-label="Giỏ hàng"
              className="text-[#FF3C1C] hover:text-[#FF6C3E] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
