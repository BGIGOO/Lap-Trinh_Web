"use client";

import { useState } from "react";
import { X, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }

      // API BE trả về { success: true, message: "..." }
      setMessage({ type: "success", text: data.message || "Yêu cầu thành công! Vui lòng kiểm tra email của bạn." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#00473e]">
            Quên mật khẩu
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-[#475d5b]">
            Vui lòng nhập email của bạn. Chúng tôi sẽ gửi cho bạn một liên kết
            để đặt lại mật khẩu.
          </p>
          <div>
            <label htmlFor="email-forgot" className="block text-sm font-medium text-[#475d5b] mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="email-forgot"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FC4126]"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={loading || message.type === 'success'}
            className="w-full flex items-center justify-center bg-[#FC4126] text-white font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-[#ff6347] transition-colors disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Gửi liên kết"
            )}
          </button>

          {/* Thông báo */}
          {message.text && (
            <div
              className={`flex items-center p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}