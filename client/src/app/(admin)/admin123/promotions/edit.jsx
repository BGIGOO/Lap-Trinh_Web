"use client";

import { Editor } from "@tinymce/tinymce-react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function EditPromotion({ promo, onClose, onSuccess }) {
  const [form, setForm] = useState({
    id: promo.id,
    title: promo.title,
    blogContent: promo.blogContent,
    imageUrl: promo.imageUrl,
    is_active: promo.is_active ? 1 : 0,
  });

  const [preview, setPreview] = useState(
    promo.imageUrl ? `http://localhost:3001${promo.imageUrl}` : null
  );

  // 🔹 API KEY từ .env
  const tinyKey =
    process.env.NEXT_PUBLIC_TINYMCE_KEY &&
    process.env.NEXT_PUBLIC_TINYMCE_KEY !== ""
      ? process.env.NEXT_PUBLIC_TINYMCE_KEY
      : "no-api-key";

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
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
    fd.append("is_active", Number(form.is_active));

    // Nếu không có ảnh mới → giữ ảnh cũ
    fd.append("imageUrl", form.imageUrl);

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
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative shadow-lg">
        {/* Nút đóng popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#153448]">
          Chỉnh sửa khuyến mãi
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {/* Nội dung TinyMCE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung khuyến mãi
            </label>

            <Editor
              apiKey={tinyKey}
              initialValue={form.blogContent}
              onEditorChange={(content) =>
                setForm((prev) => ({ ...prev, blogContent: content }))
              }
              init={{
                height: 350,
                menubar: true,
                directionality: "ltr", // 🔥 Sửa lỗi gõ chữ bị ngược
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

            {/* Cảnh báo nếu chưa có API key */}
            {tinyKey === "no-api-key" && (
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Bạn chưa cấu hình TinyMCE API Key — đang dùng chế độ free.
                <br />
                Thêm vào file <b>.env.local</b>:
                <code className="block bg-gray-100 px-2 py-1 rounded mt-1">
                  NEXT_PUBLIC_TINYMCE_KEY=YOUR_API_KEY
                </code>
              </p>
            )}
          </div>

          {/* Ảnh hiện tại */}
          {preview && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Ảnh hiện tại
              </label>
              <img
                src={preview}
                className="w-40 h-40 object-cover border rounded"
                alt="preview"
              />
            </div>
          )}

          {/* Ảnh mới */}
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
            className="bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
