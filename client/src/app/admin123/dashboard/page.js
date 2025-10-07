import CardStat from "@/components/admin123/CardStat";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hàng thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <CardStat title="Tổng khách hàng" value="56" color="border-green-500" icon="👥" />
        <CardStat title="Tổng sản phẩm" value="1850" color="border-blue-500" icon="📦" />
        <CardStat title="Tổng đơn hàng" value="247" color="border-yellow-500" icon="🧾" />
        <CardStat title="Sắp hết hàng" value="4" color="border-red-500" icon="⚠️" />
      </div>

      {/* Bảng đơn hàng gần đây */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-3">Tình trạng đơn hàng</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID đơn</th>
              <th className="p-2">Khách hàng</th>
              <th className="p-2">Tổng tiền</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">AL3947</td>
              <td className="p-2">Phạm Thị Ngọc</td>
              <td className="p-2">19.770.000đ</td>
              <td className="p-2 text-blue-600">Chờ xử lý</td>
            </tr>
            <tr>
              <td className="p-2">ER3835</td>
              <td className="p-2">Nguyễn Thị Mỹ Yến</td>
              <td className="p-2">16.770.000đ</td>
              <td className="p-2 text-yellow-600">Đang vận chuyển</td>
            </tr>
            <tr>
              <td className="p-2">MD0837</td>
              <td className="p-2">Triệu Thanh Phú</td>
              <td className="p-2">9.400.000đ</td>
              <td className="p-2 text-green-600">Đã hoàn thành</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}