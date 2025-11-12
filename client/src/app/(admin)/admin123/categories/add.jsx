"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function AddCategory({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: 1,
    priority: 0,
    image_url: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, image_url: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (const key in form) fd.append(key, form[key]);

    const res = await fetch("http://localhost:3001/api/categories", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();

    if (data.success) {
      alert("Thêm danh mục thành công!");
      onSuccess();
      onClose();
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Thêm danh mục mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              rows="3"
            />
          </div>

          {/* Ảnh danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh danh mục
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

          {/* Trạng thái + Ưu tiên */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ưu tiên
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
          </div>

          {/* Nút lưu */}
          <button
            type="submit"
            className="mt-2 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu danh mục
          </button>
        </form>
      </div>
    </div>
  );
}
