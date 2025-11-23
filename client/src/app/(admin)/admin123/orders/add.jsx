"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function AddOrder({ onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // ==============================
  // 🔹 Lấy danh sách sản phẩm
  // ==============================
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    };
    fetchProducts();
  }, []);

  // ==============================
  // 🔹 Thêm sản phẩm vào đơn
  // ==============================
  const addItem = (p) => {
    setItems([
      ...items,
      {
        product_id: p.id,
        product_name: p.name,
        price: p.sale_price || p.original_price,
        quantity: 1,
      },
    ]);
  };

  // sửa số lượng
  const updateQty = (index, qty) => {
    const list = [...items];
    list[index].quantity = qty;
    setItems(list);
  };

  const total = items.reduce((t, i) => t + i.price * i.quantity, 0);

  // ==============================
  // 🔹 Submit tạo đơn
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.name || !customer.phone || !customer.address) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart_id: null,
        customer,
        payment_method: "cod",
        note: "",
        items,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Tạo đơn hàng thành công!");
      onSuccess();
      onClose();
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative shadow">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">Tạo đơn hàng mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* KHÁCH HÀNG */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-[#153448]">
              Thông tin khách hàng
            </h3>

            <input
              className="border px-3 py-2 rounded"
              placeholder="Tên khách"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />

            <input
              className="border px-3 py-2 rounded"
              placeholder="Số điện thoại"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <input
              className="border px-3 py-2 rounded"
              placeholder="Email (không bắt buộc)"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />

            <input
              className="border px-3 py-2 rounded"
              placeholder="Địa chỉ"
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          <div>
            <h3 className="font-semibold text-[#153448] mb-2">Chọn sản phẩm</h3>

            <div className="border rounded p-2 h-64 overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="flex justify-between border-b py-2">
                  <span>{p.name}</span>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => addItem(p)}
                    type="button"
                  >
                    Thêm
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SẢN PHẨM ĐÃ CHỌN */}
          <div className="col-span-2 mt-4">
            <h3 className="font-semibold text-[#153448] mb-2">
              Sản phẩm trong đơn
            </h3>

            {items.map((it, i) => (
              <div key={i} className="flex gap-4 items-center border-b py-2">
                <span className="w-64">{it.product_name}</span>

                <input
                  type="number"
                  className="border px-2 py-1 rounded w-20"
                  value={it.quantity}
                  onChange={(e) => updateQty(i, Number(e.target.value))}
                />

                <span>{(it.price * it.quantity).toLocaleString()}đ</span>
              </div>
            ))}

            <p className="text-xl font-bold mt-3">
              Tổng tiền: {total.toLocaleString()}đ
            </p>
          </div>

          {/* SUBMIT */}
          <div className="col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#153448] text-white px-6 py-2 rounded hover:bg-[#1b4560]"
            >
              Tạo đơn hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
