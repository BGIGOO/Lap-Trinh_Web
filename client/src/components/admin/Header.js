"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [time, setTime] = useState(new Date());
  const pathname = usePathname();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Map đường dẫn -> tiêu đề
  const pageTitles = {
    "/admin123/dashboard": "Dashboard",
    "/admin123/products": "Quản lý sản phẩm",
    "/admin123/employees": "Quản lý nhân viên",
    "/admin123/orders": "Quản lý đơn hàng",
    "/admin123/customers": "Quản lý khách hàng",
    "/admin123/reports": "Báo cáo doanh thu",
    "/admin123/voucher": "Mã Giảm Giá",
    "/admin123/schedule": "Lịch công tác",
    "/admin123/settings": "Cài đặt hệ thống",
  };

  // Lấy tiêu đề dựa vào pathname, nếu không có thì để "Trang quản lý"
  const title = pageTitles[pathname] || "Trang quản lý";

  // Định dạng thời gian tiếng Việt
  const formattedTime = time.toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="bg-white shadow rounded-md flex items-center justify-between px-6 py-2">
      {/* Tiêu đề */}
      <h1 className="text-sm font-semibold text-blue-900 border-l-4 border-yellow-400 pl-2 scale-90 origin-left">
        {title}
      </h1>

      {/* Thời gian cập nhật */}
      <div className="text-xs font-medium text-black">{formattedTime}</div>
    </header>
  );
}