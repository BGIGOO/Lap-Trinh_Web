'use client';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import {
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import StatCard from "@/components/admin123/StatCard";

// Đây là Server Component
export default function DashboardPage() {
  // Dữ liệu mẫu cho danh sách hoạt động
  const recentActivities = [
    {
      id: 1,
      icon: <ShoppingCart className="h-5 w-5 text-[#fa5246]" />,
      bgColor: "bg-red-100",
      title: "Đơn hàng mới #8291",
      subtitle: "từ Nguyễn Văn A - 2 phút trước",
    },
    {
      id: 2,
      icon: <Users className="h-5 w-5 text-[#ffa8ba]" />,
      bgColor: "bg-pink-100",
      title: "Người dùng mới đăng ký",
      subtitle: "user@example.com - 1 giờ trước",
    },
    {
      id: 3,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-100",
      title: "Thanh toán thành công",
      subtitle: "1,280,500đ - 3 giờ trước",
    },
  ];

  return (
    <AuthGuard allowedRoles={[1]}>
    <div className="p-6 md:p-8">
      {/* Tiêu đề trang và Nút hành động */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">
            Chào mừng trở lại, Admin!
          </h1>
          <p className="text-base text-[#475d5b] mt-1">
            Đây là tổng quan nhanh về cửa hàng của bạn.
          </p>
        </div>
        <button className="bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center">
          Tạo Báo Cáo
        </button>
      </div>

      {/* Lưới Thẻ Thống Kê (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Doanh Thu"
          value="1,280,500đ"
          icon={<DollarSign />}
          change="+12.5%"
          changeType="positive"
        />
        <StatCard
          title="Đơn Hàng Mới"
          value="320"
          icon={<ShoppingCart />}
          change="+8.2%"
          changeType="positive"
        />
        <StatCard
          title="Người Dùng Mới"
          value="150"
          icon={<Users />}
          change="-1.4%"
          changeType="negative"
        />
        <StatCard
          title="Lượt Truy Cập"
          value="25,890"
          icon={<Activity />}
          change="+5.0%"
          changeType="positive"
        />
      </div>

      {/* Lưới Nội Dung Chính (Biểu đồ và Hoạt động) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ (Cột chính) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-[#00473e] mb-4">
            Phân tích Doanh thu
          </h4>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
            <div className="text-center">
              <BarChart2 className="h-16 w-16 text-gray-400 mx-auto" />
              <p className="text-[#475d5b] mt-2">
                Dữ liệu biểu đồ sẽ được hiển thị ở đây
              </p>
              <p className="text-xs text-gray-400">
                (Cần tích hợp thư viện biểu đồ)
              </p>
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây (Cột phụ) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-[#00473e] mb-4">
            Hoạt động gần đây
          </h4>
          <ul className="space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#00332c]">
                    {activity.title}
                  </p>
                  <p className="text-xs text-[#475d5b]">{activity.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-6 w-full text-center text-[#00473e] font-semibold py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}