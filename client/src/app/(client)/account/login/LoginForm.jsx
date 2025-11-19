"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
    const [form, setForm] = useState({
        account: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        account: "",
        password: "",
    });

    const handleChange = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((e) => ({ ...e, [field]: "" })); // clear error khi user nhập lại
    };

    // ================== Validate ==================
    const handleLogin = () => {
        let newErrors = {};

        if (!form.account.trim()) {
            newErrors.account = "Vui lòng nhập email hoặc số điện thoại!";
        }

        if (!form.password.trim()) {
            newErrors.password = "Vui lòng nhập mật khẩu!";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // Nếu hợp lệ thì xử lý đăng nhập
        console.log("Đăng nhập với:", form);
    };

    return (
        <section className="w-full flex justify-center mt-10 px-4">
            <div className="relative max-w-xl w-full bg-white rounded-3xl border-2 border-[#FF6A3D] px-10 py-10 shadow-md">
                {/* -------- Chicken Image -------- */}
                <div className="absolute -left-52 bottom-0 hidden md:block transform -translate-y-4">
                    <Image
                        src="/galogin.png"
                        width={220}
                        height={220}
                        alt="Chicken"
                        className="select-none pointer-events-none"
                    />
                </div>

                {/* -------- Title -------- */}
                <h1 className="text-center text-3xl font-extrabold text-[#FF3D2E] mb-8">
                    ĐĂNG NHẬP
                </h1>

                {/* -------- Input fields -------- */}
                <div className="space-y-6">
                    {/* Email / Phone */}
                    <div>
                        <input
                            type="text"
                            placeholder="Email/SĐT điện thoại *"
                            value={form.account}
                            onChange={(e) =>
                                handleChange("account", e.target.value)
                            }
                            className={`w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border ${
                                errors.account
                                    ? "border-red-500"
                                    : "border-transparent"
                            } focus:border-[#FF6A3D]`}
                        />
                        {errors.account && (
                            <p className="text-red-500 text-sm mt-1 px-2">
                                {errors.account}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu *"
                            value={form.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            className={`w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-transparent"
                            } focus:border-[#FF6A3D]`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1 px-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* ---- Forgot password ---- */}
                    <div className="flex justify-end items-center text-sm mt-2 px-2">
                        <Link
                            href="/forgot-password"
                            className="text-[#FF6A3D] font-semibold"
                        >
                            Quên mật khẩu
                        </Link>
                    </div>

                    {/* ---- Login button ---- */}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 rounded-full bg-[#FF3D2E] text-white font-bold hover:bg-[#FF5C45] transition cursor-pointer"
                    >
                        ĐĂNG NHẬP
                    </button>

                    {/* ---- Register ---- */}
                    <Link
                        href="/account/register"
                        className="w-full py-3 rounded-full border border-[#FF3D2E] text-[#FF3D2E] font-bold hover:bg-[#ffe5df] transition cursor-pointer text-center block"
                    >
                        ĐĂNG KÝ
                    </Link>
                </div>
            </div>
        </section>
    );
}
