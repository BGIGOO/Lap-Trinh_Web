import { useState } from "react";
import { ChevronDown } from "lucide-react";
import banner from "@/assets/bookparty.jpg";

const underlineInput =
    "w-full bg-transparent border-0 border-b border-gray-200 focus:border-[#FF8A00] " +
    "focus:ring-0 outline-none py-2 placeholder:text-gray-400 text-sm";

const label = "text-sm font-semibold text-gray-700";

const radioLike = `
  appearance-none w-4 h-4 md:w-5 md:h-5 rounded-full
  border-[2px] border-gray-300 bg-white       
  hover:border-gray-400 transition-colors duration-150
  grid place-content-center cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/40 focus:ring-offset-1
  checked:border-[#FF8A00]                        
  before:content-[''] before:w-2.5 before:h-2.5 md:before:w-3 md:before:h-3
  before:rounded-full before:bg-[#FF8A00]
  before:transition-transform before:duration-150
  before:scale-0 checked:before:scale-100           
`;

export default function BookParty() {
    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 my-8">
            <div className="rounded-xl overflow-hidden">
                <img
                    src={banner}
                    alt="Ưu đãi đặt tiệc"
                    className="w-full h-36 md:h-56 object-cover"
                />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
                <button
                    onClick={() => setTab("info")}
                    className="px-10 py-2 rounded-full text-sm font-bold shadow bg-[#FF8A00] text-white"
                >
                    Đặt tiệc ngay
                </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                    <h3 className="font-extrabold text-[#FF523B] mb-4">
                        Thông tin liên hệ
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <div className={label}>Họ và tên bé</div>
                            <input
                                className={underlineInput}
                                placeholder="Nhập họ và tên bé"
                            />
                        </div>

                        <div>
                            <div className={label}>
                                Họ và tên người đặt{" "}
                                <span className="text-red-500">(Bắt buộc)</span>
                            </div>
                            <input
                                className={underlineInput}
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>

                        <div>
                            <div className={label}>
                                Số điện thoại{" "}
                                <span className="text-red-500">(Bắt buộc)</span>
                            </div>
                            <input
                                className={underlineInput}
                                placeholder="Nhập số điện thoại của bạn"
                            />
                        </div>

                        <div>
                            <div className={label}>
                                Email{" "}
                                <span className="text-red-500">(Bắt buộc)</span>
                            </div>
                            <input
                                className={underlineInput}
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                    <h3 className="font-extrabold text-[#FF523B] mb-4">
                        Thông tin buổi tiệc
                    </h3>

                    <div className="mb-5">
                        <div className={label + " mb-2"}>Loại tiệc</div>

                        <label className="flex items-center gap-3 text-sm mb-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                defaultChecked
                                className={radioLike}
                            />
                            Tiệc sinh nhật
                        </label>

                        <label className="flex items-center gap-3 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                className={radioLike}
                            />
                            Tiệc liên hoan
                        </label>
                    </div>

                    <div className="mb-5">
                        <div className={label + " mb-2"}>Ngày tổ chức</div>
                        <div className="grid grid-cols-3 gap-3">
                            <Select placeholder="Ngày">
                                {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1}>{i + 1}</option>
                                ))}
                            </Select>
                            <Select placeholder="Tháng">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1}>{i + 1}</option>
                                ))}
                            </Select>
                            <Select placeholder="Năm">
                                {["2024", "2025", "2026"].map((y) => (
                                    <option key={y}>{y}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className={label + " mb-2"}>
                            Số lượng người tham dự
                        </div>
                        <input
                            className={underlineInput}
                            placeholder="Nhập số lượng người tham dự"
                        />
                    </div>

                    <div className="mb-5">
                        <div className={label + " mb-2"}>Địa điểm tổ chức</div>
                        <div className="space-y-3">
                            <Select placeholder="Chọn thành phố">
                                <option>Hà Nội</option>
                                <option>Hồ Chí Minh</option>
                                <option>Đà Nẵng</option>
                            </Select>
                            <Select placeholder="Chọn quận/huyện">
                                <option>Quận 1</option>
                                <option>Quận 7</option>
                                <option>Cầu Giấy</option>
                            </Select>
                            <Select placeholder="Cửa hàng gà rán CRISPC">
                                <option>CRISPC Nguyễn Thị Thập</option>
                                <option>CRISPC Cầu Giấy</option>
                                <option>CRISPC Phú Nhuận</option>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <div className={label + " mb-2"}>Ghi chú</div>
                        <textarea
                            rows={3}
                            className="w-full rounded-md border border-gray-200 focus:border-[#FF8A00] focus:ring-0 outline-none p-3 text-sm"
                            placeholder="Nhập ghi chú cho bữa tiệc"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer
                     text-white font-bold text-sm"
                >
                    Xác nhận đặt tiệc
                </button>
            </div>
        </section>
    );
}

function Select({ children, placeholder }) {
    return (
        <div className="relative">
            <select
                className="w-full h-10 rounded-md border border-gray-200 bg-white
                   pl-3 pr-9 appearance-none outline-none focus:border-[#FF8A00] text-sm cursor-pointer"
                defaultValue=""
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
    );
}
