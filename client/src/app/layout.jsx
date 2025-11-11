import "./globals.css"; //
import { AuthProvider } from "@/context/AuthContext"; //
import { Afacad } from "next/font/google";

const afacad = Afacad({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-afacad",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={afacad.className}>
            <body>
                {/* AuthProvider bọc cả client và admin ở đây */}
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
