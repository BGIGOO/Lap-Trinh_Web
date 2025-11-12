"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditPromotion({ promo, onClose, onSuccess }) {
  const [form, setForm] = useState({
    id: promo.id,
    title: promo.title,
    blogContent: promo.blogContent,
    imageUrl: promo.imageUrl, // đường dẫn cũ
    is_active: promo.is_active ? 1 : 0,
  });

  const [preview, setPreview] = useState(
    promo.imageUrl ? `http://localhost:3001${promo.imageUrl}` : null
  );

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, imageUrl: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("blogContent", form.blogContent);
    fd.append("is_active", Number(form.is_active));

    // Nếu không upload ảnh mới → vẫn append imageUrl cũ để giữ nguyên
    if (typeof form.imageUrl === "string") {
      fd.append("imageUrl", form.imageUrl);
    } else {
      fd.append("imageUrl", form.imageUrl);
    }

    const res = await fetch(`http://localhost:3001/api/promotions/${form.id}`, {
      method: "PUT",
      body: fd,
    });

    const data = await res.json();
    if (data.success) {
      alert("Cập nhật khuyến mãi thành công!");
      onSuccess();
      onClose();
    } else {
      alert("Lỗi: " + data.message);
      console.log("Chi tiết lỗi:", data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-lg">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-xl font-bold mb-4 text-[#153448]">
          Chỉnh sửa khuyến mãi
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung khuyến mãi
            </label>
            <textarea
              name="blogContent"
              value={form.blogContent}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              rows={4}
            ></textarea>
          </div>

          {/* Ảnh hiện tại */}
          {preview && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Ảnh hiện tại
              </label>
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover border rounded"
              />
            </div>
          )}

          {/* Upload ảnh mới */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh mới (nếu muốn thay)
            </label>
            <input type="file" name="imageUrl" onChange={handleChange} />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="is_active"
              value={form.is_active}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-3 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
