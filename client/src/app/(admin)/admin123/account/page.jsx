"use client";

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { User, Lock, Save, Loader2, Mail, Phone, Home, Image as ImageIcon } from "lucide-react";

// Component con cho Input để dễ dàng tái sử dụng
function FormInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  icon,
  autoComplete = "off",
}) {
  return (
    <div>
{/* ... existing code ... */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#475d5b] mb-1"
      >
        {label}
      </label>
{/* ... existing code ... */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
{/* ... existing code ... */}
          {icon || <User className="h-5 w-5 text-gray-400" />}
        </span>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] focus:border-transparent"
        />
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, fetchWithAuth, updateUserInContext } = useAuth(); // <-- Lấy updateUserInContext, bỏ refreshAndLoadUser

  // State cho Form Thông Tin
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // State cho Form Mật Khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Tải dữ liệu từ context vào form khi user có sẵn
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Xử lý thay đổi input cho Form Thông Tin
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý thay đổi input cho Form Mật Khẩu
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Xử lý Submit Form Thông Tin (PUT /api/users/me)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const res = await fetchWithAuth("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Payload này khớp với route.js
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // data = {success: true, message: "...", data: {...}}
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

      // SỬA LẠI: Dùng message từ API
      setProfileMessage({
        type: "success",
        text: data.message || "Cập nhật thông tin thành công!",
      });
      
      // SỬA LẠI: Cập nhật user ngay lập tức, không cần fetch lại
      updateUserInContext(data); // data = {success: true, data: {...}}
      // await refreshAndLoadUser(); // <-- Bỏ dòng này đi
    } catch (err) {
      setProfileMessage({ type: "error", text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  // Xử lý Submit Form Mật Khẩu (PATCH /api/users/me/password)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới không khớp." });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const res = await fetchWithAuth("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Payload này khớp với yêu cầu của bạn (old_password, new_password)
        body: JSON.stringify({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await res.json(); // data = {success: true, message: "..."}
      if (!res.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");

      // SỬA LẠI: Dùng message từ API
      setPasswordMessage({
        type: "success",
        text: data.message || "Đổi mật khẩu thành công!",
      });
      // Xóa các trường mật khẩu sau khi thành công
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Hiển thị loading nếu user chưa được tải từ context
  if (!user) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-[#00473e]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-[#00473e] mb-6">
        Quản Lý Tài Khoản
      </h1>

      {/* Lưới nội dung */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Thông tin cá nhân (2/3 chiều rộng) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-[#00473e] mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Thông tin cá nhân
          </h4>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="name"
                name="name"
                label="Họ tên"
                value={formData.name}
                onChange={handleProfileChange}
                icon={<User className="h-5 w-5 text-gray-400" />}
              />
              <FormInput
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />
              <FormInput
                id="phone"
                name="phone"
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleProfileChange}
                icon={<Phone className="h-5 w-5 text-gray-400" />}
              />
              <FormInput
                id="address"
                name="address"
                label="Địa chỉ"
                value={formData.address}
                onChange={handleProfileChange}
                icon={<Home className="h-5 w-5 text-gray-400" />}
              />
              <div className="md:col-span-2">
                <FormInput
                  id="avatar"
                  name="avatar"
                  label="Link Avatar"
                  value={formData.avatar}
                  onChange={handleProfileChange}
                  icon={<ImageIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Nút Submit và Thông báo */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {profileLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                <span>Lưu thay đổi</span>
              </button>
              {profileMessage.text && (
                <p
                  className={`text-sm ${
                    profileMessage.type === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {profileMessage.text}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Card Đổi mật khẩu (1/3 chiều rộng) */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-[#00473e] mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Đổi mật khẩu
          </h4>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <FormInput
                id="currentPassword"
                name="currentPassword"
                label="Mật khẩu hiện tại"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="current-password"
              />
              <FormInput
                id="newPassword"
                name="newPassword"
                label="Mật khẩu mới"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="new-password"
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="new-password"
              />
            </div>

            {/* Nút Submit và Thông báo */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full flex items-center justify-center bg-[#00473e] text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {passwordLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                <span>Đổi mật khẩu</span>
              </button>
              {passwordMessage.text && (
                <p
                  className={`text-sm text-center mt-4 ${
                    passwordMessage.type === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {passwordMessage.text}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}