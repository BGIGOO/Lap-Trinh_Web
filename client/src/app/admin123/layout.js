import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}