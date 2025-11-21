"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Banknote, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001/api";

// INPUT STYLE giống Login/Register
const inputClass =
    "w-full rounded-full bg-[#FFF3D7] px-5 py-3 text-sm outline-none border " +
    "border-transparent focus:border-[#FF6A3D] placeholder:text-gray-400";

const radioLike = `
appearance-none relative w-5 h-5 rounded-full border-[2.5px] border-gray-300
grid place-content-center cursor-pointer transition-colors
before:content-[''] before:w-2.5 before:h-2.5 before:rounded-full before:bg-[#FC4126] before:scale-0 before:transition-transform
checked:border-[#FC4126] checked:before:scale-100
focus:outline-none focus:ring-2 focus:ring-[#FC4126]/30 focus:ring-offset-1
`;

export default function CheckoutForm() {
    const router = useRouter();

    const [pay, setPay] = useState("cod");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        note: "",
    });
    const [errors, setErrors] = useState({});

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const addressRef = useRef(null);
    const noteRef = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("address");
            if (saved) {
                const addr = JSON.parse(saved);
                setForm((p) => ({ ...p, address: addr?.name || "" }));
            } else {
                setErrors((e) => ({
                    ...e,
                    address: "Bạn chưa chọn địa chỉ giao hàng!",
                }));
            }
        } catch {}
    }, []);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Vui lòng không bỏ trống họ tên!";
        if (!form.phone.trim())
            e.phone = "Vui lòng không bỏ trống số điện thoại!";
        else if (!/^(0|\+84)[0-9]{7,8}$/.test(form.phone.trim()))
            e.phone = "Số điện thoại không hợp lệ!";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            e.email = "Email không hợp lệ!";
        if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ!";
        return e;
    };

    const focusFirstError = (e) => {
        const order = [
            ["name", nameRef],
            ["phone", phoneRef],
            ["email", emailRef],
            ["address", addressRef],
            ["note", noteRef],
        ];
        for (const [k, r] of order) {
            if (e[k]) {
                r.current?.focus();
                break;
            }
        }
    };

    const handleCheckout = async () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) {
            focusFirstError(e);
            return;
        }

        setLoading(true);
        try {
            const cartId = localStorage.getItem("cart_id");
            if (!cartId) {
                setErrors((prev) => ({
                    ...prev,
                    _global: "Không tìm thấy giỏ hàng!",
                }));
                setLoading(false);
                return;
            }

            const payload = {
                cart_id: cartId,
                customer: {
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim(),
                    address: form.address.trim(),
                },
                payment_method: pay,
                note: form.note.trim(),
            };

            const res = await axios.post(`${API_URL}/orders`, payload);

            if (res.data?.success) {
                const order = res.data.data;
                localStorage.removeItem("cart_id");
                localStorage.removeItem("address");

                if (order.payment_method === "qr") {
                    router.push(
                        `/payment/${order.order_code}?amount=${order.final_price}`
                    );
                } else {
                    router.push(`/order-success/${order.order_code}`);
                }
            } else {
                setErrors((prev) => ({
                    ...prev,
                    _global: res.data?.message || "Không thể tạo đơn hàng!",
                }));
            }
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                _global: "Có lỗi khi gửi đơn hàng. Vui lòng thử lại!",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-5xl mx-auto px-4 md:px-0 py-6">
            {errors._global && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors._global}
                </div>
            )}

            {/* FORM HỘP */}
            <div className="rounded-3xl border-2 border-[#FF6A3D] bg-white px-8 py-10 shadow">
                {/* <h1 className="text-center text-2xl font-extrabold text-[#FF3D2E] mb-8">
                    THÔNG TIN NGƯỜI NHẬN HÀNG
                </h1> */}
                <h2 className="mb-8 text-xl font-bold text-[#FF3D2E]">
                    Thông tin người nhận hàng
                </h2>

                <div className="space-y-7">
                    <InputRow
                        refObj={nameRef}
                        label="Họ và tên"
                        required
                        placeholder="Nhập họ và tên của bạn"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={errors.name}
                    />

                    <InputRow
                        refObj={phoneRef}
                        label="Số điện thoại"
                        required
                        placeholder="Nhập số điện thoại"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        error={errors.phone}
                    />

                    <InputRow
                        refObj={emailRef}
                        label="Email"
                        placeholder="Nhập email của bạn"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                    />

                    <InputRow
                        refObj={addressRef}
                        label="Địa chỉ giao hàng"
                        required
                        readOnly
                        placeholder="Chưa chọn địa chỉ"
                        value={form.address}
                        error={errors.address}
                    />

                    <InputRow
                        refObj={noteRef}
                        label="Ghi chú"
                        placeholder="Ghi chú cho đơn hàng"
                        value={form.note}
                        onChange={(e) => handleChange("note", e.target.value)}
                        error={errors.note}
                    />
                </div>

                {/* PAYMENT */}
                <h2 className="mt-10 mb-4 text-xl font-bold text-[#FF3D2E]">
                    Phương thức thanh toán
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <PaymentOption
                        id="cod"
                        checked={pay === "cod"}
                        onChange={() => setPay("cod")}
                        icon={<Banknote className="text-green-600" />}
                        label="Thanh toán khi nhận hàng (COD)"
                    />

                    <PaymentOption
                        id="qr"
                        checked={pay === "qr"}
                        onChange={() => setPay("qr")}
                        icon={<QrCode className="text-blue-500" />}
                        label="QR / ZaloPay / MoMo"
                    />
                </div>

                {errors.pay && (
                    <p className="mt-1 text-sm text-red-600">{errors.pay}</p>
                )}

                {/* SUBMIT */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`w-60 py-3 rounded-full text-white font-bold text-base shadow-md transition
                            ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#FF3D2E] hover:bg-[#FF5A42]"
                            }
                        `}
                    >
                        {loading ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ===== INPUT COMPONENT (giống login/register) ===== */
function InputRow({
    refObj,
    label,
    placeholder,
    value,
    onChange,
    required,
    readOnly,
    error,
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}{" "}
                {required && <span className="text-[#FF3D2E]">(Bắt buộc)</span>}
            </label>

            <input
                ref={refObj}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                className={`${inputClass} ${
                    readOnly ? "cursor-not-allowed" : ""
                } ${error ? "border-red-500" : ""}`}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

/* ===== PAYMENT OPTION ===== */
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
            <span className="flex items-center gap-2 font-semibold text-gray-700">
                <span>{icon}</span>
                {label}
            </span>
        </label>
    );
}
