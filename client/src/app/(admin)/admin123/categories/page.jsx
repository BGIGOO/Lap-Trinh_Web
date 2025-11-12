"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import AddCategory from "./add";
import EditCategory from "./edit";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Tìm kiếm danh mục
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#153448]">Quản lý danh mục</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#153448] text-white px-4 py-2 rounded-lg hover:bg-[#1b4560]"
        >
          <FaPlus /> Thêm danh mục
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border w-full px-3 py-2 rounded mb-5"
      />

      {/* Bảng danh mục */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#153448] text-white text-sm">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Tên danh mục</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Mô tả</th>
              <th className="px-3 py-2 text-left">Ảnh</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-center">Ưu tiên</th>
              <th className="px-3 py-2 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-3 py-2 font-semibold">{cat.id}</td>
                  <td className="px-3 py-2">{cat.name}</td>
                  <td className="px-3 py-2 text-gray-600">{cat.slug}</td>
                  <td className="px-3 py-2 text-gray-600 max-w-[200px] truncate">
                    {cat.description}
                  </td>
                  <td className="px-3 py-2">
                    {cat.image_url ? (
                      <img
                        src={`http://localhost:3001${cat.image_url}`}
                        alt={cat.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {cat.is_active ? (
                      <span className="text-green-600 font-medium">
                        Kích hoạt
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">Vô hiệu</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">{cat.priority}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => setEditItem(cat)}
                      className="text-[#153448] hover:text-[#1b4560] transition-all"
                    >
                      <FaEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Không có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popups */}
      {showAdd && (
        <AddCategory
          onClose={() => setShowAdd(false)}
          onSuccess={fetchCategories}
        />
      )}

      {editItem && (
        <EditCategory
          category={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}
