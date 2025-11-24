"use client";

import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FaTimes } from "react-icons/fa";

export default function AddPromotion({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    blogContent: "",
    imageUrl: null,
    is_active: 1,
  });

  const [preview, setPreview] = useState(null);

  // 🔹 TinyMCE KEY
  const tinyKey =
    process.env.NEXT_PUBLIC_TINYMCE_KEY &&
    process.env.NEXT_PUBLIC_TINYMCE_KEY !== ""
      ? process.env.NEXT_PUBLIC_TINYMCE_KEY
      : "no-api-key";

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((p) => ({ ...p, imageUrl: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // Submit form
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
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#153448]">
          Thêm khuyến mãi mới
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              placeholder="Tiêu đề khuyến mãi"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* TinyMCE Content */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung khuyến mãi
            </label>

            <Editor
              apiKey={tinyKey}
              value={form.blogContent}
              onEditorChange={(content) =>
                setForm((prev) => ({ ...prev, blogContent: content }))
              }
              init={{
                height: 350,
                menubar: true,
                directionality: "ltr", // 🔥 FIX lỗi gõ chữ bị ngược
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | " +
                  "alignleft aligncenter alignright | bullist numlist | " +
                  "image link table | code fullscreen",
              }}
            />

            {/* Warning no API KEY */}
            {tinyKey === "no-api-key" && (
              <p className="text-xs text-red-500 mt-1">
                ⚠ Bạn đang dùng TinyMCE mà chưa có API Key.
                <br />
                Hãy thêm vào file <b>.env.local</b>:
                <code className="block bg-gray-100 px-2 py-1 rounded mt-1">
                  NEXT_PUBLIC_TINYMCE_KEY=YOUR_API_KEY
                </code>
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Ảnh khuyến mãi
            </label>
            <input
              type="file"
              name="imageUrl"
              onChange={handleChange}
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

          {/* Status */}
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

          <button
            type="submit"
            className="bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu khuyến mãi
          </button>
        </form>
      </div>
    </div>
  );
}
