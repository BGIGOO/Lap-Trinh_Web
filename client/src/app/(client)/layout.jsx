"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Cityline from "@/components/CityLines";
// <-- THAY ĐỔI: Import thêm ForgotPasswordModal
import ForgotPasswordModal from "@/components/public/ForgotPasswordModal";

export default function ClientLayout({ children }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  // <-- THAY ĐỔI: Thêm state cho modal quên mật khẩu
  const [openForgotModal, setOpenForgotModal] = useState(false);

  // <-- THAY ĐỔI: Thêm hàm xử lý để "trao đổi" modal
  // Hàm này sẽ đóng AuthModal và mở ForgotPasswordModal
  const handleOpenForgotPassword = () => {
    setOpenAuthModal(false);
    setOpenForgotModal(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden flex flex-col">
      <Header setOpenAuthModal={() => setOpenAuthModal(true)} />
      <main className="flex-1">{children}</main>
   
      <Footer />
      
      {/* Modal Đăng nhập / Đăng ký */}
      <AuthModal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        // <-- THAY ĐỔI: Truyền hàm xử lý mới vào AuthModal
        onOpenForgotPassword={handleOpenForgotPassword}
      />

      {/* <-- THAY ĐỔI: Render thêm ForgotPasswordModal */}
      <ForgotPasswordModal
        isOpen={openForgotModal}
        onClose={() => setOpenForgotModal(false)}
      />
    </div>
  );
}