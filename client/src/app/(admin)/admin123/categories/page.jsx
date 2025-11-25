"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Loader2,
  ImageIcon,
  Type,
  AlignLeft,
  ListOrdered,
  UploadCloud,
  CheckCircle,
  XCircle,
  Link as LinkIcon
} from "lucide-react";

// Import UI Components chuẩn
import { Modal } from "@/components/admin123/Modal";
import { FormInput } from "@/components/admin123/FormInput";
import { ToggleSwitch } from "@/components/admin123/ToggleSwitch";

export default function CategoriesPage() {
  // --- STATE DỮ LIỆU ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE TÌM KIẾM ---
  const [search, setSearch] = useState("");

  // --- STATE MODAL & FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // State form mặc định
  const initialFormState = {
    id: null,
    name: "",
    slug: "", // Thêm trường slug (thường cần thiết cho SEO)
    description: "",
    priority: 0,
    is_active: 1,
    image_url: null, // File hoặc String
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. LẤY DỮ LIỆU ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- 2. LỌC DỮ LIỆU ---
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- 3. XỬ LÝ FORM ---
  const handleFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      if (files && files[0]) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else if (name === "is_active") {
      setFormData((prev) => ({ ...prev, is_active: checked ? 1 : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- 4. MỞ MODAL ---
  const openAddModal = () => {
    setModalMode("add");
    setFormData(initialFormState);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode("edit");
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || "", // Nếu API trả về slug
      description: cat.description || "",
      priority: cat.priority,
      is_active: cat.is_active ? 1 : 0,
      image_url: cat.image_url, // Giữ link ảnh cũ
    });
    setPreviewImage(cat.image_url ? `http://localhost:3001${cat.image_url}` : null);
    setIsModalOpen(true);
  };

  // --- 5. SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      // Nếu có slug thì gửi, không thì để BE tự sinh
      if (formData.slug) fd.append("slug", formData.slug);
      fd.append("description", formData.description);
      fd.append("priority", formData.priority);
      fd.append("is_active", formData.is_active);

      // Logic ảnh: Nếu là File mới -> gửi file. Nếu là String cũ -> gửi string (hoặc BE tự xử lý)
      if (formData.image_url) {
        fd.append("image_url", formData.image_url);
      }

      const url = modalMode === "add"
        ? "http://localhost:3001/api/categories"
        : `http://localhost:3001/api/categories/${formData.id}`;
      
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      alert("Đã xảy ra lỗi hệ thống!");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">Quản lý Danh mục</h1>
          <p className="text-[#475d5b] mt-1">Phân loại sản phẩm của cửa hàng.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Thêm Danh mục
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-[#00473e]" /></div>}
        
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-[#475d5b]">
              <thead className="text-xs text-[#00473e] uppercase bg-[#f2f7f5]">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Ảnh</th>
                  <th className="px-6 py-3">Tên danh mục</th>
                  <th className="px-6 py-3">Mô tả</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Ưu tiên</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs">{cat.id}</td>
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {cat.image_url ? (
                            <img
                              src={`http://localhost:3001${cat.image_url}`}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display='none' }}
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#00332c]">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.slug}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate" title={cat.description}>
                        {cat.description || "---"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                            <CheckCircle size={12}/> Kích hoạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
                            <XCircle size={12}/> Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">{cat.priority}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-[#00473e] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 italic">Không tìm thấy danh mục nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL (ADD & EDIT) --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "add" ? "Thêm Danh mục mới" : "Cập nhật Danh mục"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="name" name="name" label="Tên danh mục" required
              value={formData.name} onChange={handleFormChange}
              icon={<Type className="h-4 w-4 text-gray-400" />}
            />
            <FormInput
              id="slug" name="slug" label="Slug (Đường dẫn - Tùy chọn)" 
              value={formData.slug} onChange={handleFormChange}
              placeholder="tu-dong-tao-neu-trong"
              icon={<LinkIcon className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* Upload Ảnh */}
          <div>
            <label className="block text-sm font-medium text-[#475d5b] mb-1">Ảnh đại diện</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-4">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-24 w-24 object-cover rounded-md border border-gray-200" />
                ) : (
                  <div className="h-24 w-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 flex-col gap-1">
                    <ImageIcon size={20}/>
                    <span className="text-[10px]">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-[#00473e] px-4 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                    <UploadCloud size={16} />
                    {previewImage ? "Thay ảnh khác" : "Tải ảnh lên"}
                    <input type="file" name="image_url" onChange={handleFormChange} className="hidden" accept="image/*" />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 2MB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#475d5b]">Mô tả</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] text-sm"
                placeholder="Nhập mô tả ngắn cho danh mục..."
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pt-2">
            <div className="w-full md:w-1/3">
              <FormInput
                id="priority" name="priority" label="Thứ tự hiển thị" type="number"
                value={formData.priority} onChange={handleFormChange}
                icon={<ListOrdered className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <ToggleSwitch
              id="is_active"
              name="is_active"
              label="Trạng thái hoạt động"
              checked={formData.is_active === 1}
              onChange={handleFormChange}
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100 mt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-opacity-90 disabled:opacity-70 transition-all"
            >
              {formLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {modalMode === "add" ? "Lưu Danh mục" : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}