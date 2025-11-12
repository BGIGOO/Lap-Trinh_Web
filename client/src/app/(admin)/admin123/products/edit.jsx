"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditProduct({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    id: product.id,
    category_id: product.category_id,
    name: product.name,
    original_price: product.original_price,
    sale_price: product.sale_price,
    description: product.description,
    image_url: product.image_url, // giữ link cũ
    is_active: product.is_active ? 1 : 0, // 1 kích hoạt, 0 vô hiệu
    priority: product.priority,
  });

  const [preview, setPreview] = useState(
    product?.image_url ? `http://localhost:3001${product.image_url}` : null
  );

  // Handle thay đổi input
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setForm((prev) => ({ ...prev, image_url: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("category_id", form.category_id);
    fd.append("name", form.name);
    fd.append("original_price", form.original_price);
    fd.append("sale_price", form.sale_price);
    fd.append("description", form.description);
    fd.append("is_active", Number(form.is_active)); // 0 hoặc 1
    fd.append("priority", form.priority);

    // ✅ Nếu không upload ảnh mới → giữ ảnh cũ
    if (typeof form.image_url === "string") {
      fd.append("image_url", form.image_url);
    } else {
      fd.append("image_url", form.image_url);
    }

    const res = await fetch(`http://localhost:3001/api/products/${form.id}`, {
      method: "PUT",
      body: fd,
    });

    const data = await res.json();

    if (data.success) {
      alert("Cập nhật sản phẩm thành công!");
      onSuccess();
      onClose();
    } else {
      alert("Lỗi: " + data.message);
      console.log("Chi tiết lỗi:", data);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#153448]">
            Cập nhật sản phẩm
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
          {/* Category ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Danh mục
            </label>
            <input
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              name="name"
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
              value={form.description}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Ảnh hiện tại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh hiện tại
            </label>
            {preview && (
              <div className="flex flex-col gap-2">
                <img
                  src={preview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Đường dẫn ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn ảnh
            </label>
            <input
              name="image_url"
              value={
                typeof form.image_url === "string"
                  ? form.image_url
                  : product.image_url
              }
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded text-sm text-gray-600"
              readOnly={typeof form.image_url !== "string"}
            />
          </div>

          {/* Upload ảnh mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh mới (nếu muốn thay)
            </label>
            <input
              type="file"
              name="image_url"
              onChange={handleChange}
              className="w-full"
            />
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

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức ưu tiên (priority)
            </label>
            <input
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-[#153448] text-white py-2 rounded hover:bg-[#1b4560]"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
