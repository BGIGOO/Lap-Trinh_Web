"use client";
import { useState } from "react";
import { Banknote, CreditCard, Wallet, QrCode } from "lucide-react";

const underlineInput =
    "w-full bg-transparent border-0 border-b border-gray-200 focus:border-[#FC4126] focus:ring-0 outline-none py-3 placeholder:text-gray-400 text-sm";

const radioLike = `
appearance-none relative w-5 h-5 rounded-full border-[2.5px] border-gray-300
grid place-content-center cursor-pointer transition-colors
before:content-[''] before:w-2.5 before:h-2.5 before:rounded-full before:bg-[#FC4126] before:scale-0 before:transition-transform
checked:border-[#FC4126] checked:before:scale-100
focus:outline-none focus:ring-2 focus:ring-[#FC4126]/30 focus:ring-offset-1
`;

export default function CheckoutForm() {
    const [pay, setPay] = useState("cash");

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-0 py-6">
            {/* ===== Thông tin người nhận hàng ===== */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="px-6 py-5">
                    <h3 className="text-[#FC4126] text-xl font-extrabold">
                        Thông tin người nhận hàng
                    </h3>
                </div>

                <div className="px-6 pb-6 space-y-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Họ và tên{" "}
                            <span className="text-red-500">(Bắt buộc)</span>
                        </label>
                        <input
                            className={underlineInput}
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Số điện thoại{" "}
                            <span className="text-red-500">(Bắt buộc)</span>
                        </label>
                        <input
                            className={underlineInput}
                            placeholder="Nhập số điện thoại của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            className={underlineInput}
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Ghi chú
                        </label>
                        <input
                            className={underlineInput}
                            placeholder="Nhập ghi chú của bạn"
                        />
                    </div>
                </div>
            </div>

            {/* ===== Phương thức thanh toán ===== */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm mt-6">
                <div className="px-6 py-5">
                    <h3 className="text-[#FC4126] text-xl font-extrabold">
                        Phương thức thanh toán
                    </h3>
                </div>

                <div className="px-6 pb-6">
                    <div className="divide-y divide-gray-100">
                        {/* Hàng 1: Tiền mặt & MoMo */}
                        <div className="grid md:grid-cols-2 gap-6 py-3">
                            <PaymentOption
                                id="cash"
                                checked={pay === "cash"}
                                onChange={() => setPay("cash")}
                                icon={
                                    <Banknote className="w-5 h-5 text-[#28a745]" />
                                }
                                label="Tiền mặt"
                            />

                            <PaymentOption
                                id="zalopay"
                                checked={pay === "zalopay"}
                                onChange={() => setPay("zalopay")}
                                icon={
                                    <div className="flex items-center gap-1">
                                        <QrCode className="w-5 h-5 text-[#1BB4E8]" />
                                    </div>
                                }
                                label="QR Code"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Nút hoàn tất ===== */}
            <div className="flex justify-center mt-8">
                <button
                    type="button"
                    className="px-10 md:px-14 py-4 rounded-full bg-[#FC4126] hover:bg-[#ff6347] active:bg-[#FC4126]
                     text-white font-extrabold text-sm md:text-base shadow cursor-pointer"
                >
                    Hoàn tất đơn hàng
                </button>
            </div>
        </section>
    );
}

function PaymentOption({ id, checked, onChange, icon, label }) {
    return (
        <label
            htmlFor={id}
            className="flex items-center gap-3 cursor-pointer select-none"
        >
            <input
                id={id}
                type="radio"
                name="payment"
                className={radioLike}
                checked={checked}
                onChange={onChange}
            />
            <span className="flex items-center gap-3">
                <span className="shrink-0">
                    {icon ?? <CreditCard className="w-5 h-5" />}
                </span>
                <span className="text-gray-700 font-semibold">{label}</span>
            </span>
        </label>
    );
}
