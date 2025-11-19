"use client";

import { useState } from "react";

export default function ResetPasswordForm() {
    const [form, setForm] = useState({
        password: "",
        confirm: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((e) => ({ ...e, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.password.trim()) e.password = "Vui lòng nhập mật khẩu mới!";
        if (!form.confirm.trim()) e.confirm = "Vui lòng xác nhận mật khẩu!";
        if (form.password !== form.confirm)
            e.confirm = "Mật khẩu xác nhận không khớp!";
        return e;
    };

    const handleReset = () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        console.log("Đặt lại mật khẩu:", form.password);
    };

    return (
        <section className="w-full flex justify-center mt-10 px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl border-2 border-[#FF6A3D] px-10 py-10 shadow-md">
                <h1 className="text-center text-2xl font-extrabold text-[#FF3D2E] mb-6">
                    ĐẶT LẠI MẬT KHẨU
                </h1>

                <div className="space-y-6">
                    {/* Mật khẩu mới */}
                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới *"
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

                    {/* Xác nhận */}
                    <div>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu *"
                            value={form.confirm}
                            onChange={(e) =>
                                handleChange("confirm", e.target.value)
                            }
                            className={`w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border ${
                                errors.confirm
                                    ? "border-red-500"
                                    : "border-transparent"
                            } focus:border-[#FF6A3D]`}
                        />
                        {errors.confirm && (
                            <p className="text-red-500 text-sm mt-1 px-2">
                                {errors.confirm}
                            </p>
                        )}
                    </div>

                    {/* Nút submit */}
                    <button
                        onClick={handleReset}
                        className="w-full py-3 rounded-full bg-[#FF3D2E] text-white font-bold hover:bg-[#FF573F] transition cursor-pointer"
                    >
                        ĐẶT LẠI MẬT KHẨU
                    </button>
                </div>
            </div>
        </section>
    );
}
