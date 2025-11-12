"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function AddProduct({ onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    original_price: "",
    sale_price: "",
    description: "",
    image_url: null,
    is_active: 1, // 1 = kích hoạt
    priority: 100,
  });

  const [preview, setPreview] = useState(null);

  // 🔹 Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Cập nhật form khi nhập
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setForm((prev) => ({ ...prev, image_url: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Gửi dữ liệu thêm mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("category_id", form.category_id);
    fd.append("name", form.name);
    fd.append("original_price", form.original_price);
    fd.append("sale_price", form.sale_price);
    fd.append("description", form.description);
    fd.append("is_active", Number(form.is_active));
    fd.append("priority", form.priority);
    fd.append("image_url", form.image_url);

    const res = await fetch("http://localhost:3001/api/products", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Thêm sản phẩm thành công!");
      onSuccess();
      onClose();
    } else {
      alert("❌ Lỗi: " + data.message);
      console.error("Chi tiết lỗi:", data);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Thêm sản phẩm mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              name="name"
              placeholder="Nhập tên sản phẩm"
              value={form.name}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          {/* Giá gốc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gốc
            </label>
            <input
              name="original_price"
              placeholder="VD: 50000"
              value={form.original_price}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          {/* Giá khuyến mãi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi
            </label>
            <input
              name="sale_price"
              placeholder="VD: 45000"
              value={form.sale_price}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              placeholder="Mô tả ngắn gọn..."
              value={form.description}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh sản phẩm
            </label>
            <input
              type="file"
              name="image_url"
              onChange={handleChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg border mt-2"
              />
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="is_active"
              value={form.is_active}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Vô hiệu</option>
            </select>
          </div>

          {/* Ưu tiên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức ưu tiên (priority)
            </label>
            <input
              type="number"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              min="0"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu sản phẩm
          </button>
        </form>
      </div>
    </div>
  );
}
