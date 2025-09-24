"use client";
import { useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function RootLayout({ children }) {
    const [openAuthModal, setOpenAuthModal] = useState(false);
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden flex flex-col">
                    <Header setOpenAuthModal={() => setOpenAuthModal(true)} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <AuthModal
                        open={openAuthModal}
                        onClose={() => setOpenAuthModal(false)}
                    />
                </div>
            </body>
        </html>
    );
}
