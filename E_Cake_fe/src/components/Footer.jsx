// src/components/Footer.jsx
import { PhoneCall } from "lucide-react";
import LogoUrl from "@/assets/crispc.svg";

export default function Footer() {
    return (
        <footer className="bg-[#FF5A3E] text-white">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
                    {/* Logo + brand */}
                    <div>
                        <img
                            src={LogoUrl}
                            alt="CRISPC"
                            className="h-30 w-auto object-contain mb-4"
                        />
                        <p className="text-[12px]/[1.4] opacity-90">
                            CRISPC VIETNAM | 2024
                        </p>
                    </div>

                    {/* Cột 1: Liên hệ */}
                    <div>
                        <h4 className="font-bold uppercase text-sm tracking-wide mb-3">
                            LIÊN HỆ
                        </h4>

                        <div className="mb-3">
                            <div className="uppercase font-bold text-[12px] opacity-90 mb-1">
                                Hotline đặt hàng
                            </div>
                            <div className="flex items-center gap-2 text-2xl font-extrabold">
                                <PhoneCall className="h-5 w-5" />
                                <span>1900-1224</span>
                            </div>
                        </div>

                        <div>
                            <div className="uppercase font-bold text-[12px] opacity-90 mb-1">
                                Hướng dẫn đặt món
                            </div>
                            <p className="text-[12px]/[1.5] font-bold uppercase">
                                Địa chỉ: 19 Nguyễn Thị Thập, Phường Tân Quy,
                                Quận 7, Thành phố Hồ Chí Minh, Việt Nam
                            </p>
                        </div>
                    </div>

                    {/* Cột 2: Link */}
                    <div>
                        <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
                            VỀ CHÚNG TÔI
                        </h4>
                        <ul className="space-y-2 text-[13px]">
                            <li>
                                <a href="#" className="hover:underline">
                                    Hướng dẫn đặt món
                                </a>
                            </li>
                        </ul>

                        <h4 className="mt-5 font-extrabold uppercase text-sm tracking-wide mb-3">
                            CỬA HÀNG
                        </h4>
                        <ul className="space-y-2 text-[13px]">
                            <li>
                                <a href="#" className="hover:underline">
                                    Tuyển dụng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Đặt tiệc
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Tải ứng dụng */}
                    <div>
                        <h4 className="font-extrabold uppercase text-sm tracking-wide mb-3">
                            TẢI ỨNG DỤNG ĐẶT HÀNG{" "}
                            <br className="hidden sm:block" />
                            VỚI NHIỀU ƯU ĐÃI HƠN
                        </h4>

                        <div className="flex items-center gap-3">
                            {/* Thay bằng badge thật nếu có */}
                            <a
                                href="#"
                                className="h-9 w-28 rounded-md bg-[#FFF2E0] block"
                                aria-label="Tải trên App Store"
                            />
                            <a
                                href="#"
                                className="h-9 w-28 rounded-md bg-[#FFF2E0] block"
                                aria-label="Tải trên Google Play"
                            />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-6 md:mt-8 h-px bg-white/40" />
            </div>
        </footer>
    );
}
