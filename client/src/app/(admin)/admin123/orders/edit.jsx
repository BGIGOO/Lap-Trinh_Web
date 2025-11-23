"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditOrder({ order, onClose, onSuccess }) {
  const [detail, setDetail] = useState(null);

  // Form luôn tạo 1 lần — an toàn Rules of Hooks
  const [form, setForm] = useState({
    order_status: order.order_status,
    payment_status: order.payment_status,
    note: order.note || "",
  });

  // Fetch chi tiết đơn
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/${order.id}`);
        const data = await res.json();
        if (data.success) {
          setDetail(data.data);
        }
      } catch (err) {
        console.error("Lỗi fetch detail:", err);
      }
    };

    fetchDetail();
  }, [order.id]);

  // Khi detail có → đồng bộ lại form
  useEffect(() => {
    if (detail) {
      setForm({
        order_status: detail.order_status,
        payment_status: detail.payment_status,
        note: detail.note || "",
      });
    }
  }, [detail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cập nhật trạng thái đơn
      await fetch(`http://localhost:3001/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.order_status }),
      });

      // Cập nhật thanh toán
      await fetch(`http://localhost:3001/api/orders/${order.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.payment_status }),
      });

      alert("Cập nhật đơn hàng thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi submit:", err);
      alert("Lỗi hệ thống.");
    }
  };

  // Hiển thị loading, nhưng không phá thứ tự hook
  if (!detail) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-xl shadow">Đang tải...</div>
      </div>
    );
  }

  // Mapping trạng thái sang tiếng Việt
  const ORDER_STATUS_TEXT = {
    pending: "Đang xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const PAYMENT_STATUS_TEXT = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Đơn hàng: {detail.order_code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* THÔNG TIN KHÁCH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thông tin khách hàng
            </label>
            <div className="border px-3 py-2 rounded bg-gray-50">
              {detail.customer_name} — {detail.customer_phone}
            </div>
          </div>

          {/* TRẠNG THÁI ĐƠN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái đơn hàng
            </label>
            <select
              name="order_status"
              value={form.order_status}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            >
              <option value="pending">Đang xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* TRẠNG THÁI THANH TOÁN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thanh toán
            </label>
            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            >
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>

          {/* GHI CHÚ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              rows="3"
            />
          </div>

          {/* SẢN PHẨM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sản phẩm trong đơn
            </label>
            <div className="border rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
              {detail.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1 border-b">
                  <span>
                    {it.product_name} × {it.quantity}
                  </span>
                  <span className="font-semibold">
                    {(it.price * it.quantity).toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-2 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560] transition"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
