"use client";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditOrder from "./edit";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  // Mapping trạng thái sang tên tiếng Việt
  const STATUS_TEXT = {
    pending: "Đang chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = !filterStatus || o.order_status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#153448]">Quản lý đơn hàng</h1>
      </div>

      {/* Tìm kiếm + Lọc */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc tên khách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/4"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Đang xử lý</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#153448] text-white">
          <tr>
            <th className="px-4 py-2 text-left">Mã đơn</th>
            <th className="px-4 py-2 text-center">Khách hàng</th>
            <th className="px-4 py-2 text-center">SĐT</th>
            <th className="px-4 py-2 text-center">Tổng tiền</th>
            <th className="px-4 py-2 text-center">Thanh toán</th>
            <th className="px-4 py-2 text-center">Trạng thái</th>
            <th className="px-4 py-2 text-center">Ngày tạo</th>
            <th className="px-4 py-2 text-center">Chỉnh sửa</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-[#153448]">
                  {o.order_code}
                </td>

                <td className="px-4 py-2 text-center">{o.customer_name}</td>
                <td className="px-4 py-2 text-center">{o.customer_phone}</td>

                <td className="px-4 py-2 text-center">
                  {o.final_price.toLocaleString()}₫
                </td>

                {/* Trạng thái thanh toán */}
                <td className="px-4 py-2 text-center">
                  {o.payment_status === "paid" ? (
                    <span className="text-green-600 font-semibold">
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Chưa thanh toán
                    </span>
                  )}
                </td>

                {/* Trạng thái đơn hàng tiếng Việt */}
                <td className="px-4 py-2 text-center">
                  {o.order_status === "completed" ? (
                    <span className="text-green-600 font-semibold">
                      Hoàn thành
                    </span>
                  ) : o.order_status === "cancelled" ? (
                    <span className="text-red-500 font-semibold">Đã hủy</span>
                  ) : (
                    <span className="text-orange-500 font-semibold">
                      {STATUS_TEXT[o.order_status]}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center">
                  {new Date(o.created_at).toLocaleDateString("vi-VN")}
                </td>

                {/* EDIT */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setSelected(o);
                      setShowEdit(true);
                    }}
                    className="inline-flex items-center justify-center bg-[#E3F2FD] text-[#1565C0] rounded-full p-2 hover:bg-[#BBDEFB]"
                  >
                    <FaEdit size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500 italic">
                Không có đơn hàng phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showEdit && (
        <EditOrder
          order={selected}
          onClose={() => setShowEdit(false)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
