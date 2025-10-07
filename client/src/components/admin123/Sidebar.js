import {
  ShoppingCart,
  Users,
  UserCog,
  Package,
  ClipboardList,
  Briefcase,
  DollarSign,
  BarChart3,
  CalendarDays,
  Settings,
} from "lucide-react";
import UserCard from "./UserCard";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      {/* Thông tin nhân viên */}
      <UserCard
        name="NMN"
        role="Chào mừng bạn trở lại"
        avatar="/manh.jpg" // đặt hình avatar trong public/
      />

      {/* Nút POS bán hàng */}
      <div className="p-4">
        <a
          href="/admin123/pos"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold flex items-center justify-center gap-2 p-3 rounded-lg transition no-underline"
        >
          <ShoppingCart className="w-5 h-5" />
          POS Bán Hàng
        </a>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <a
          href="/admin123/employees"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <UserCog className="w-5 h-5 text-white" /> Quản lý nhân viên
        </a>
        <a
          href="/admin123/customers"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <Users className="w-5 h-5 text-white no-underline" /> Quản lý khách hàng
        </a>
        <a
          href="/admin123/products"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <Package className="w-5 h-5 text-white" /> Quản lý sản phẩm
        </a>
        <a
          href="/admin123/orders"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <ClipboardList className="w-5 h-5 text-white" /> Quản lý đơn hàng
        </a>
        <a
          href="/admin123/internal"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <Briefcase className="w-5 h-5 text-white" /> Quản lý nội bộ
        </a>
        <a
          href="/admin123/payroll"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <DollarSign className="w-5 h-5 text-white" /> Bảng kê lương
        </a>
        <a
          href="/admin123/reports"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <BarChart3 className="w-5 h-5 text-white" /> Báo cáo doanh thu
        </a>
        <a
          href="/admin123/schedule"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <CalendarDays className="w-5 h-5 text-white" /> Lịch công tác
        </a>
        <a
          href="/admin123/settings"
          className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded font-semibold text-white no-underline"
        >
          <Settings className="w-5 h-5 text-white" /> Cài đặt tài khoản
        </a>
      </nav>
    </aside>
  );
}