import "./globals.css"; //
import { AuthProvider } from "@/context/AuthContext"; //

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider bọc cả client và admin ở đây */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}