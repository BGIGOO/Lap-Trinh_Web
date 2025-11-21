"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!email.trim()) {
            setError("Vui lòng nhập email của bạn!");
            return;
        }

        // gửi email
        console.log("Gửi liên kết đến:", email);
    };

    return (
        <section className="w-full flex justify-center mt-10 px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl border-2 border-[#FF6A3D] px-10 py-10 shadow-md">
                <h1 className="text-center text-2xl font-extrabold text-[#FF3D2E] mb-6">
                    QUÊN MẬT KHẨU
                </h1>

                {/* Input Email */}
                <div>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn *"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className={`w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border ${
                            error ? "border-red-500" : "border-transparent"
                        } focus:border-[#FF6A3D]`}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1 px-2">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 py-3 rounded-full bg-[#FF3D2E] text-white font-bold hover:bg-[#FF573F] transition cursor-pointer"
                >
                    GỬI LIÊN KẾT
                </button>
            </div>
        </section>
    );
}
