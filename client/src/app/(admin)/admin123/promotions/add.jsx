"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function AddPromotion({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    blogContent: "",
    imageUrl: null,
    is_active: 1,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, imageUrl: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("blogContent", form.blogContent);
    fd.append("is_active", form.is_active);
    fd.append("imageUrl", form.imageUrl);

    const res = await fetch("http://localhost:3001/api/promotions", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (data.success) {
      alert("Thêm khuyến mãi thành công!");
      onSuccess();
      onClose();
    } else alert("Lỗi: " + data.message);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#153448]">
          Thêm khuyến mãi mới
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="title"
            placeholder="Tiêu đề khuyến mãi"
            value={form.title}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <textarea
            name="blogContent"
            placeholder="Nội dung khuyến mãi..."
            value={form.blogContent}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            rows={4}
          />

          <div>
            <label className="block mb-1 text-sm font-medium">
              Ảnh khuyến mãi
            </label>
            <input
              type="file"
              onChange={handleChange}
              name="imageUrl"
              required
            />
            {preview && (
              <img
                src={preview}
                className="w-40 h-40 object-cover border rounded mt-2"
                alt="preview"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-[#153448] text-white py-2 rounded mt-3 hover:bg-[#1b4560]"
          >
            Lưu khuyến mãi
          </button>
        </form>
      </div>
    </div>
  );
}
