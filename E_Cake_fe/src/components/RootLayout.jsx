import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function RootLayout() {
    const [openAuthModal, setOpenAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
            <Header setOpenAuthModal={() => setOpenAuthModal(true)} />
            <Outlet />
            <Footer />
            <AuthModal
                open={openAuthModal}
                onClose={() => setOpenAuthModal(false)}
            />
        </div>
    );
}
