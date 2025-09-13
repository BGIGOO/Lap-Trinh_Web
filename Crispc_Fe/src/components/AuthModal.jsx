import { useState } from "react";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose }) {
    const [tab, setTab] = useState("login");

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[500px] rounded-xl bg-white shadow-2xl"
            >
                <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="absolute right-3 top-3 p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="pt-12 pb-2">
                    <div className="flex items-center justify-center gap-10">
                        <button
                            onClick={() => setTab("login")}
                            className={`pb-2 text-[15px] font-bold cursor-pointer ${
                                tab === "login"
                                    ? "text-[#FF523B]"
                                    : "text-gray-400"
                            }`}
                        >
                            Đăng nhập
                            {tab === "login" && (
                                <span className="block mx-auto mt-2 h-[3px] w-20 rounded-full bg-[#FF523B]" />
                            )}
                        </button>

                        <button
                            onClick={() => setTab("signup")}
                            className={`pb-2 text-[15px] font-bold cursor-pointer ${
                                tab === "signup"
                                    ? "text-[#FF523B]"
                                    : "text-gray-400"
                            }`}
                        >
                            Tạo tài khoản
                            {tab === "signup" && (
                                <span className="block mx-auto mt-2 h-[3px] w-24 rounded-full bg-[#FF523B]" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-12">
                    {tab === "login" ? <LoginForm /> : <SignupForm />}
                </div>
            </div>
        </div>
    );
}

function Label({ children }) {
    return (
        <label className="block text-sm font-semibold text-gray-700">
            {children}
        </label>
    );
}

function UnderlineInput({ placeholder, type = "text" }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="
        mt-2 w-full border-b border-gray-200
        focus:border-[#FF8A00] outline-none pb-2
        placeholder:text-gray-400 text-sm
      "
        />
    );
}

function PrimaryButton({ children }) {
    return (
        <button
            type="button"
            className="
        block mx-auto mt-5 w-[80%]
        rounded-full bg-[#FF8A00] text-white
        font-bold uppercase tracking-wide
        py-3 hover:bg-[#FFA33A] active:brightness-95
        transition-colors cursor-pointer
      "
        >
            {children}
        </button>
    );
}

function LoginForm() {
    return (
        <form className="mx-auto w-full max-w-[350px]">
            <div className="space-y-5">
                <div>
                    <Label>Số điện thoại</Label>
                    <UnderlineInput placeholder="Nhập số điện thoại của bạn" />
                </div>

                <div>
                    <Label>Mật khẩu</Label>
                    <UnderlineInput
                        type="password"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <div className="text-right">
                    <button
                        type="button"
                        className="text-sm font-semibold text-red-600 cursor-pointer"
                    >
                        Quên mật khẩu
                    </button>
                </div>
            </div>

            <PrimaryButton>Đăng nhập</PrimaryButton>
        </form>
    );
}

function SignupForm() {
    return (
        <form className="mx-auto w-full max-w-[350px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                    <Label>Họ</Label>
                    <UnderlineInput placeholder="Nhập họ" />
                </div>
                <div>
                    <Label>Tên</Label>
                    <UnderlineInput placeholder="Nhập tên" />
                </div>

                <div className="md:col-span-2">
                    <Label>Email</Label>
                    <UnderlineInput placeholder="Nhập địa chỉ email" />
                </div>

                <div className="md:col-span-2">
                    <Label>Số điện thoại</Label>
                    <UnderlineInput placeholder="Nhập số điện thoại của bạn" />
                </div>

                <div className="md:col-span-2">
                    <Label>Mật khẩu</Label>
                    <UnderlineInput
                        type="password"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label>Xác nhận mật khẩu</Label>
                    <UnderlineInput
                        type="password"
                        placeholder="Nhập lại mật khẩu để xác nhận"
                    />
                </div>
            </div>

            <PrimaryButton>Tạo tài khoản</PrimaryButton>
        </form>
    );
}
