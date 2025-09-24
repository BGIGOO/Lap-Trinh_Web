import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import LogoUrl from "@/assets/crispc.svg";

export default function Footer() {
  return (
    <footer className="bg-[#FF5A3E] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-start">
          <div>
            <Image
              src={LogoUrl}
              alt="CRISPC"
              width={120}
              height={96}
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
              priority={false}
            />
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
              LIÊN HỆ
            </h4>

            <div className="uppercase text-[12px] opacity-90 mb-1">
              Hotline đặt hàng
            </div>
            <div className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold mb-4">
              <PhoneCall className="h-5 w-5" />
              {/* tel: để bấm gọi trên mobile */}
              <a href="tel:19001224" className="hover:underline">
                1900-1224
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
              VỀ CHÚNG TÔI
            </h4>
            <div className="uppercase text-[12px] opacity-90 mb-2">
              Hướng dẫn đặt món
            </div>
            <p className="text-[12px]/[1.5]">
              Địa chỉ: 19 Nguyễn Thị Thập, Phường Tân Quy, Quận 7, Thành Phố Hồ
              Chí Minh, Việt Nam
            </p>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
              CỬA HÀNG
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                {/* Dùng Link cho route nội bộ nếu có trang tương ứng */}
                <Link href="/careers" className="hover:underline">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/book-party" className="hover:underline">
                  Đặt tiệc
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
              TẢI ỨNG DỤNG ĐẶT HÀNG{" "}
              <br className="hidden sm:block" />
              VỚI NHIỀU ƯU ĐÃI HƠN
            </h4>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Tải trên App Store"
                className="block"
                rel="noreferrer"
              >
                <Image
                  src="/appstore-vn.png"
                  alt="Tải trên App Store"
                  width={180}
                  height={60}
                  className="h-9 md:h-10 w-auto object-contain"
                  loading="lazy"
                />
              </a>
              <a
                href="#"
                aria-label="Tải trên Google Play"
                className="block"
                rel="noreferrer"
              >
                <Image
                  src="/playstore-vn.png"
                  alt="Tải trên Google Play"
                  width={180}
                  height={60}
                  className="h-9 md:h-10 w-auto object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 h-px bg-white/40" />
        <p className="mt-2 text-[12px]/[1.4] opacity-90">
          CRISPC VIETNAM | 2024
        </p>
      </div>
    </footer>
  );
}
