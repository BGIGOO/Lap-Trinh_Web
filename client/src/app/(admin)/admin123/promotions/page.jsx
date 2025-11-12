"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import AddPromotion from "./add";
import EditPromotion from "./edit";

export default function PromotionsPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/promotions/admin");
    const data = await res.json();
    if (data.success) setPromos(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleToggleStatus = async (id, active) => {
    const url = active
      ? `http://localhost:3001/api/promotions/${id}/deactivate`
      : `http://localhost:3001/api/promotions/${id}/activate`;

    if (!confirm(active ? "Ẩn khuyến mãi này?" : "Hiện lại khuyến mãi này?"))
      return;

    const res = await fetch(url, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      fetchPromotions();
    } else alert("Lỗi: " + data.message);
  };

  const filtered = promos.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#153448]">
          Quản lý khuyến mãi
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#153448] text-white px-4 py-2 rounded-lg hover:bg-[#1b4560]"
        >
          <FaPlus /> Thêm khuyến mãi
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#153448] text-white text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Ảnh</th>
            <th className="px-4 py-2 text-left">Tiêu đề</th>
            <th className="px-4 py-2 text-left">Slug</th>
            <th className="px-4 py-2 text-center">Trạng thái</th>
            <th className="px-4 py-2 text-center">Cập nhật</th>
            <th className="px-4 py-2 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-6">
                Đang tải...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:3001${p.imageUrl}`}
                    alt={p.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </td>
                <td className="px-4 py-2 font-semibold text-[#153448]">
                  {p.title}
                </td>
                <td className="px-4 py-2 text-gray-500">{p.slug}</td>
                <td className="px-4 py-2 text-center">
                  {p.is_active ? (
                    <span className="text-green-600 font-medium">Hiển thị</span>
                  ) : (
                    <span className="text-red-500 font-medium">Ẩn</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center text-gray-600">
                  {new Date(p.updated_at).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => setSelected(p)}
                    className="bg-[#E3F2FD] text-[#1565C0] rounded-full p-2 hover:bg-[#BBDEFB]"
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(p.id, p.is_active)}
                    className={`p-2 rounded-full ${
                      p.is_active
                        ? "bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFE0B2]"
                        : "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"
                    }`}
                  >
                    {p.is_active ? (
                      <FaEyeSlash size={15} />
                    ) : (
                      <FaEye size={15} />
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6 italic text-gray-500">
                Không có khuyến mãi nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popups */}
      {showAdd && (
        <AddPromotion
          onClose={() => setShowAdd(false)}
          onSuccess={fetchPromotions}
        />
      )}
      {selected && (
        <EditPromotion
          promo={selected}
          onClose={() => setSelected(null)}
          onSuccess={fetchPromotions}
        />
      )}
    </div>
  );
}
