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

  // Tìm kiếm
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
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

      {/* Search */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#153448] text-white">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Tên danh mục</th>
            <th className="px-4 py-2 text-left">Slug</th>
            <th className="px-4 py-2 text-left">Mô tả</th>
            <th className="px-4 py-2 text-center">Ảnh</th>
            <th className="px-4 py-2 text-center">Trạng thái</th>
            <th className="px-4 py-2 text-center">Ưu tiên</th>
            <th className="px-4 py-2 text-center">Chỉnh sửa</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-6">
                Đang tải...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{cat.id}</td>
                <td className="px-4 py-2 font-medium text-[#153448]">
                  {cat.name}
                </td>
                <td className="px-4 py-2 text-gray-600">{cat.slug}</td>
                <td className="px-4 py-2 text-gray-600 max-w-[200px] truncate">
                  {cat.description}
                </td>

                {/* Ảnh */}
                <td className="px-4 py-2 text-center">
                  {cat.image_url ? (
                    <img
                      src={`http://localhost:3001${cat.image_url}`}
                      alt={cat.name}
                      className="w-14 h-14 object-cover mx-auto rounded-lg border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Không có ảnh</span>
                  )}
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-2 text-center">
                  {cat.is_active ? (
                    <span className="text-green-600 font-semibold">
                      Kích hoạt
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">Vô hiệu</span>
                  )}
                </td>

                <td className="px-4 py-2 text-center">{cat.priority}</td>

                {/* Chỉnh sửa */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setEditItem(cat)}
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
                Không có danh mục phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
