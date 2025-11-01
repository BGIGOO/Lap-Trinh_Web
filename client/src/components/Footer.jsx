import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Music2, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FC4126] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <Image
              src="/logo_footer.png"
              alt="CRisPC"
              width={160}
              height={60}
              className="mb-4"
              priority
            />

            {/* Social icons */}
            <div className="flex items-center gap-4 mb-5">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" aria-label="TikTok">
                <Music2 className="h-6 w-6 hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" aria-label="Threads">
                <AtSign className="h-6 w-6 hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Email subscribe (chuẩn pixel theo Figma) */}
            <p className="uppercase text-sm font-semibold mb-2 ml-1">
              NHẬP HỘI CÙNG CRISPC!
            </p>

            <div className="flex w-full max-w-[280px] -ml-3 rounded-full border border-white overflow-hidden">
              <input
                type="email"
                placeholder="Email..."
                className="flex-1 bg-transparent text-white placeholder:text-white/80 text-sm px-4 py-[10px] outline-none"
              />
              <button className="flex items-center justify-center w-[83px] h-[51px] bg-white text-[#FC4126] text-[40px] leading-none border border-white rounded-[32.5px]">
                &gt;
              </button>
            </div>
          </div>

          {/* ===== MIDDLE COLUMN ===== */}
          <div className="lg:col-span-1">
            <p className="font-bold uppercase text-sm mb-3">
              HOTLINE ĐẶT HÀNG NHANH
            </p>

            <div className="inline-block bg-white text-[#FC4126] font-extrabold text-2xl px-6 py-2 rounded-full mb-3">
              1900-1224
            </div>

            <p className="text-sm leading-relaxed">
              Thời gian hoạt động: 8h00 – 22h00
              <br />
              Địa chỉ: 19 Nguyễn Hữu Thọ, Tân Hưng,
              <br />
              Tp Hồ Chí Minh
            </p>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:underline">
                  Hướng dẫn đặt món
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:underline">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/book-party" className="hover:underline">
                  Đặt tiệc
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="md:col-span-1 lg:col-span-2 flex flex-col md:flex-row justify-between gap-8">
            {/* App download */}
            <div>
              <h4 className="font-bold uppercase text-sm mb-4 leading-snug">
                TẢI ỨNG DỤNG ĐẶT HÀNG VỚI
                <br />
                NHIỀU ƯU ĐÃI HƠN
              </h4>

              <div className="flex items-center gap-3">
                <Image
                  src="/appstore.png"
                  alt="App Store"
                  width={150}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
                <Image
                  src="/chplay.png"
                  alt="Google Play"
                  width={150}
                  height={60}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-bold uppercase text-sm mb-4">CHÍNH SÁCH</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:underline">
                    Chính sách và quy định chung
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Chính sách hoạt động
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Chính sách cookie
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Chính sách bảo mật thông tin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t border-white pt-3 text-sm text">
          CRISPC VIETNAM | 2024
        </div>
      </div>
    </footer>
  );
}
