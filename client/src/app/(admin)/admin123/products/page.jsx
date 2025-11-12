"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import AddProduct from "./add";
import EditProduct from "./edit";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#153448]">Quản lý sản phẩm</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#153448] text-white px-4 py-2 rounded-lg hover:bg-[#1b4560]"
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#153448] text-white">
          <tr>
            <th className="px-4 py-2 text-left">Tên sản phẩm</th>
            <th className="px-4 py-2 text-center">Giá gốc</th>
            <th className="px-4 py-2 text-center">Giá KM</th>
            <th className="px-4 py-2 text-center">Trạng thái</th>
            <th className="px-4 py-2 text-center">Ảnh</th>
            <th className="px-4 py-2 text-center">Chỉnh sửa</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2 text-center">{p.original_price}₫</td>
              <td className="px-4 py-2 text-center">{p.sale_price}₫</td>
              <td className="px-4 py-2 text-center">
                {p.is_active ? (
                  <span className="text-green-600 font-semibold">
                    Kích hoạt
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">Vô hiệu</span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <img
                  src={`http://localhost:3001${p.image_url}`}
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded-lg border"
                />
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => {
                    setSelected(p);
                    setShowEdit(true);
                  }}
                  className="inline-flex items-center justify-center bg-[#E3F2FD] text-[#1565C0] rounded-full p-2 hover:bg-[#BBDEFB]"
                >
                  <FaEdit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Add / Edit */}
      {showAdd && (
        <AddProduct
          onClose={() => setShowAdd(false)}
          onSuccess={fetchProducts}
        />
      )}
      {showEdit && (
        <EditProduct
          product={selected}
          onClose={() => setShowEdit(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}
