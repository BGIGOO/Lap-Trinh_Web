"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirm: "",
        agreePolicy: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((e) => ({ ...e, [field]: "" }));
    };

    // ================== Validate ==================
    const validate = () => {
        const e = {};

        if (!form.name.trim()) e.name = "Vui lòng nhập họ và tên!";
        if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại!";
        if (!form.email.trim()) e.email = "Vui lòng nhập email!";
        if (!form.password.trim()) e.password = "Vui lòng nhập mật khẩu!";
        if (form.password !== form.confirm)
            e.confirm = "Mật khẩu xác nhận không khớp!";
        if (!form.agreePolicy)
            e.agreePolicy = "Bạn phải đồng ý với chính sách trước khi đăng ký!";

        return e;
    };

    const handleRegister = () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        console.log("Đăng ký với:", form);
    };

    return (
        <section className="w-full flex justify-center mt-10 px-4">
            <div className="max-w-xl w-full bg-white rounded-3xl border-2 border-[#FF6A3D] px-10 py-10 shadow-md">
                {/* ---- Title ---- */}
                <h1 className="text-center text-3xl font-extrabold text-[#FF3D2E] mb-10">
                    ĐĂNG KÝ TÀI KHOẢN
                </h1>

                <div className="space-y-6">
                    {/* Họ tên */}
                    <InputField
                        placeholder="Họ và tên*"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={errors.name}
                    />

                    {/* Số điện thoại */}
                    <InputField
                        placeholder="Số điện thoại*"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        error={errors.phone}
                    />

                    {/* Email */}
                    <InputField
                        placeholder="Email*"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                    />

                    {/* Mật khẩu */}
                    <InputField
                        type="password"
                        placeholder="Mật khẩu*"
                        value={form.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={errors.password}
                    />

                    {/* Xác nhận mật khẩu */}
                    <InputField
                        type="password"
                        placeholder="Xác nhận mật khẩu*"
                        value={form.confirm}
                        onChange={(e) =>
                            handleChange("confirm", e.target.value)
                        }
                        error={errors.confirm}
                    />

                    {/* Checkbox – agree policy */}
                    <div className="space-y-3">
                        <CheckboxRow
                            checked={form.agreePolicy}
                            onChange={(v) => handleChange("agreePolicy", v)}
                            label={
                                <>
                                    Đồng ý với{" "}
                                    <span className="text-[#FF6A3D] underline cursor-pointer">
                                        Chính sách quy định chung và bảo mật cá
                                        nhân
                                    </span>
                                </>
                            }
                        />
                        {errors.agreePolicy && (
                            <p className="text-red-500 text-sm px-2">
                                {errors.agreePolicy}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleRegister}
                        className="w-full  py-3 rounded-full bg-[#FF3D2E] text-white font-bold hover:bg-[#FF573F] transition cursor-pointer"
                    >
                        ĐĂNG KÝ
                    </button>

                    {/* Footer */}
                    <div className="text-right text-base">
                        Bạn đã có tài khoản?
                        <Link
                            href="/account/login"
                            className="text-[#FF6A3D] font-semibold ml-2"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------- Sub components ------- */
function InputField({ placeholder, value, onChange, error, type = "text" }) {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border ${
                    error ? "border-red-500" : "border-transparent"
                } focus:border-[#FF6A3D]`}
            />
            {error && <p className="text-red-500 text-sm mt-1 px-2">{error}</p>}
        </div>
    );
}

function CheckboxRow({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 accent-[#FF6A3D] cursor-pointer"
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}
