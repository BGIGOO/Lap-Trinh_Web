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
  const [loading, setLoading] = useState(false);

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      const allowed = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(file.type)) {
        alert("Ảnh chỉ được phép PNG, JPG hoặc JPEG!");
        return;
      }

      setForm((prev) => ({ ...prev, image_url: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    // Convert number fields
    if (name === "priority" || name === "is_active") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image_url) {
      alert("Vui lòng chọn ảnh danh mục!");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("is_active", form.is_active);
    fd.append("priority", form.priority);
    fd.append("image_url", form.image_url); // đúng tên backend nhận

    try {
      const res = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        alert("Thêm danh mục thành công!");
        onSuccess();
        onClose();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server!");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Thêm danh mục mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên danh mục *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded focus:outline-[#153448]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="border px-3 py-2 w-full rounded focus:outline-[#153448]"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh danh mục *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="image_url"
            />

            {preview && (
              <img
                src={preview}
                className="mt-2 w-36 h-36 object-cover rounded border"
                alt="preview"
              />
            )}
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Trạng thái
              </label>
              <select
                name="is_active"
                value={form.is_active}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded"
              >
                <option value={1}>Kích hoạt</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Ưu tiên</label>
              <input
                type="number"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                min="0"
                className="border px-3 py-2 w-full rounded"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#153448] hover:bg-[#1b4560] text-white py-2 rounded mt-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Lưu danh mục"}
          </button>
        </form>
      </div>
    </div>
  );
}
