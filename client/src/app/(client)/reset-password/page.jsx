"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Component con để xử lý logic, vì useSearchParams() cần <Suspense>
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    if (!email || !token) {
       setMessage({ type: "error", text: "Liên kết không hợp lệ hoặc đã hết hạn." });
       return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token: token,
          new_password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }

      setMessage({ type: "success", text: data.message || "Đổi mật khẩu thành công!" });
      // Tùy chọn: Chuyển hướng về trang chủ sau vài giây
      setTimeout(() => {
        router.push('/'); // Chuyển về trang chủ
      }, 3000);

    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const InputWithShowHide = ({ id, value, onChange, label }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#475d5b] mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          required
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FC4126]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#00473e] mb-6">
          Đặt Lại Mật Khẩu
        </h2>

        {message.type === "success" ? (
          // Trạng thái thành công
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Thành công!</h3>
            <p className="text-[#475d5b]">{message.text}</p>
            <p className="text-sm text-gray-500 mt-2">
              Đang chuyển hướng về trang chủ...
            </p>
            <Link href="/" className="mt-6 inline-block text-[#FC4126] font-semibold hover:underline">
              Về Trang chủ ngay
            </Link>
          </div>
        ) : (
          // Trạng thái form
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-center text-[#475d5b]">
              Vui lòng nhập mật khẩu mới của bạn.
            </p>
            
            <InputWithShowHide
              id="new_password"
              label="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <InputWithShowHide
              id="confirm_password"
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#FC4126] text-white font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-[#ff6347] transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Đặt Lại Mật Khẩu"
              )}
            </button>

            {message.text && (
              <div className="flex items-center p-3 rounded-lg bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{message.text}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// Bọc component trong <Suspense> để dùng useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}