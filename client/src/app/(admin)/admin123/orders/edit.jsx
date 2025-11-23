"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditOrder({ order, onClose, onSuccess }) {
  const [detail, setDetail] = useState(null);

  // form state luôn khai báo 1 lần, KHÔNG phụ thuộc detail
  const [form, setForm] = useState({
    order_status: order.order_status,
    payment_status: order.payment_status,
    note: order.note || "",
  });

  // Fetch chi tiết
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/${order.id}`);
        const data = await res.json();
        if (data.success) setDetail(data.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn:", err);
      }
    };

    fetchDetail();
  }, [order.id]);

  // Khi detail load xong, giữ nguyên giá trị form cũ (hook ko thay đổi)
  // HOẶC bạn muốn cập nhật theo detail => dùng useEffect
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
      await fetch(`http://localhost:3001/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.order_status }),
      });

      await fetch(`http://localhost:3001/api/orders/${order.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.payment_status }),
      });

      alert("Cập nhật đơn hàng thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật đơn:", err);
      alert("Lỗi server khi cập nhật đơn hàng.");
    }
  };

  // TẠO JSX loading, không return trước hooks
  const loadingUI = (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px] z-50">
      <div className="bg-white p-6 rounded-xl shadow">Đang tải...</div>
    </div>
  );

  // Nếu chưa có detail => hiển thị loading, NHƯNG KHÔNG RETURN
  if (!detail) return loadingUI;

  // ============================
  // FORM CHỈ RENDER KHI DETAIL CÓ
  // ============================

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Chỉnh sửa đơn hàng: {detail.order_code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* THÔNG TIN KHÁCH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khách hàng
            </label>
            <div className="border px-3 py-2 rounded bg-gray-50">
              {detail.customer_name} — {detail.customer_phone}
            </div>
          </div>

          {/* ORDER STATUS */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
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

          {/* PAYMENT STATUS */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
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
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* ITEMS */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Sản phẩm trong đơn
            </label>
            <div className="border rounded p-3 bg-gray-50 max-h-40 overflow-y-auto">
              {detail.items.map((it) => (
                <div key={it.id} className="flex justify-between border-b py-1">
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
            className="mt-2 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
