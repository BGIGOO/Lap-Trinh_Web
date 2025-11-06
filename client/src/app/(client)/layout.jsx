"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Cityline from "@/components/CityLines";
// Không cần AuthProvider ở đây nữa

export default function ClientLayout({ children }) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  
  return (
    // Không có <html>, <body>
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
  );
}