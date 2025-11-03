"use client";
import { useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Cityline from "@/components/CityLines";

// 1. Import AuthProvider từ file Context
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  
  return (
    <html lang="en">
      <body>
        {/* 2. Bọc toàn bộ ứng dụng của bạn bằng AuthProvider */}
        <AuthProvider>
          <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden flex flex-col">
            <Header setOpenAuthModal={() => setOpenAuthModal(true)} />
            <main className="flex-1">{children}</main>
            <Cityline />
            <Footer />
            <AuthModal
              open={openAuthModal}
              onClose={() => setOpenAuthModal(false)}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}