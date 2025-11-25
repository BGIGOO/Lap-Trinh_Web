"use client";

import { useState, useEffect, useCallback, useRef } from "react";
// import { useAuth } from "@/context/AuthContext"; 
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import {
  Plus,
  Search,
  Edit,
  Loader2,
  ImageIcon,
  Type,
  Link as LinkIcon,
  Calendar,
  Eye,
  EyeOff,
  UploadCloud // Thêm icon upload
} from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { Modal } from "@/components/admin123/Modal";
import { FormInput } from "@/components/admin123/FormInput";
import { ToggleSwitch } from "@/components/admin123/ToggleSwitch";

export default function PromotionsPage() {
  // const { fetchWithAuth } = useAuth();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TinyMCE Key
  const tinyKey = process.env.NEXT_PUBLIC_TINYMCE_KEY || "no-api-key";

  // Filter & Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null); // Để xem trước ảnh khi chọn file
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // --- HÀM TẢI DỮ LIỆU ---
  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/promotions/admin");
      const data = await res.json();
      
      if (data.success) {
        setPromos(data.data || []);
      } else {
        throw new Error(data.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const filteredPromos = promos.filter((p) =>
    p.title.toLowerCase().includes(debouncedKeyword.toLowerCase()) || 
    p.slug.toLowerCase().includes(debouncedKeyword.toLowerCase())
  );

  // --- XỬ LÝ FORM ---
  const handleFormChange = (e) => {
    const { name, value, checked, type, files } = e.target;
    
    if (type === "file") {
      // Xử lý file ảnh
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

  // Hàm riêng để handle TinyMCE
  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, blogContent: content }));
  };

  // Mở Modal Thêm
  const openAddModal = () => {
    setFormData({
      title: "",
      slug: "",
      imageUrl: null, // Sẽ chứa File object
      blogContent: "",
      is_active: 1,
    });
    setPreviewImage(null);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Mở Modal Sửa
  const openEditModal = (promo) => {
    setFormData({
      id: promo.id,
      title: promo.title,
      slug: promo.slug,
      imageUrl: promo.imageUrl, // Link ảnh cũ (string)
      blogContent: promo.blogContent || "",
      is_active: promo.is_active ? 1 : 0,
    });
    // Nếu có ảnh cũ thì hiển thị
    setPreviewImage(promo.imageUrl ? `http://localhost:3001${promo.imageUrl}` : null);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // --- HÀM CHUẨN BỊ FORMDATA (QUAN TRỌNG) ---
  const createFormData = (data) => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("slug", data.slug); // Nếu backend cần slug
    fd.append("blogContent", data.blogContent);
    fd.append("is_active", data.is_active);
    
    // Logic ảnh:
    // 1. Nếu là File object (người dùng chọn ảnh mới) -> gửi file
    // 2. Nếu là String (ảnh cũ) -> Backend tự hiểu giữ nguyên hoặc gửi string tùy logic BE
    if (data.imageUrl instanceof File) {
      fd.append("imageUrl", data.imageUrl);
    } else if (typeof data.imageUrl === 'string') {
        // Tùy backend: có thể gửi link cũ hoặc không gửi gì để giữ nguyên
        fd.append("imageUrl", data.imageUrl);
    }

    return fd;
  };

  // API Thêm mới
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const fd = createFormData(formData);
      
      const res = await fetch("http://localhost:3001/api/promotions", {
        method: "POST",
        body: fd, // Gửi FormData, không set Content-Type header (browser tự làm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setIsAddModalOpen(false);
      fetchPromotions();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // API Cập nhật
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const fd = createFormData(formData);

      const res = await fetch(`http://localhost:3001/api/promotions/${formData.id}`, {
        method: "PUT",
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setIsEditModalOpen(false);
      fetchPromotions();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // API Đổi trạng thái
  const handleToggleStatus = async (promo) => {
    const action = promo.is_active ? "ẩn" : "hiện";
    if (!confirm(`Bạn có chắc muốn ${action} khuyến mãi "${promo.title}"?`)) return;

    try {
      const url = promo.is_active
        ? `http://localhost:3001/api/promotions/${promo.id}/deactivate`
        : `http://localhost:3001/api/promotions/${promo.id}/activate`;

      const res = await fetch(url, { method: "PUT" });
      const data = await res.json();
      if (data.success) fetchPromotions();
      else alert("Lỗi: " + data.message);
    } catch (err) {
      alert("Đã xảy ra lỗi kết nối");
    }
  };

  // --- COMPONENT FORM DÙNG CHUNG (Để render trong cả 2 modal) ---
  const renderFormFields = () => (
    <div className="space-y-4">
      <FormInput 
        id="title" name="title" label="Tiêu đề" required 
        value={formData.title} onChange={handleFormChange} 
        icon={<Type className="h-5 w-5 text-gray-400" />} 
      />
      
      <FormInput 
        id="slug" name="slug" label="Slug" 
        value={formData.slug} onChange={handleFormChange} 
        icon={<LinkIcon className="h-5 w-5 text-gray-400" />} 
      />

      {/* Upload Ảnh */}
      <div>
        <label className="block text-sm font-medium text-[#475d5b] mb-1">Hình ảnh banner</label>
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex items-center gap-4">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="h-20 w-20 object-cover rounded-md border border-gray-200"
              />
            )}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-[#00473e] px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
              <UploadCloud size={18} />
              {previewImage ? "Chọn ảnh khác" : "Tải ảnh lên"}
              <input 
                type="file" 
                name="imageUrl" 
                onChange={handleFormChange} 
                className="hidden" 
                accept="image/*"
              />
            </label>
          </div>
        </div>
      </div>

      {/* TinyMCE Editor */}
      <div>
        <label className="block text-sm font-medium text-[#475d5b] mb-1">Nội dung chi tiết</label>
        <div className="border rounded-lg overflow-hidden">
          <Editor
            apiKey={tinyKey}
            value={formData.blogContent}
            onEditorChange={handleEditorChange}
            init={{
              height: 300,
              menubar: false,
              plugins: ['advlist autolink lists link image charmap preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table help wordcount'],
              toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>
      </div>
      
      <ToggleSwitch 
        id="is_active" name="is_active" label="Hiển thị khuyến mãi" 
        checked={formData.is_active === 1} onChange={handleFormChange} 
      />
    </div>
  );

  return (
    <div className="p-6 md:p-8">
      {/* Header & Filter giống hệt phiên bản trước... */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">Quản lý Khuyến mãi</h1>
          <p className="text-base text-[#475d5b] mt-1">Danh sách các chương trình ưu đãi.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center">
          <Plus className="h-5 w-5 mr-2" /> Thêm Khuyến mãi
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm khuyến mãi..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]" />
        </div>
      </div>

      {/* Table - Giữ nguyên logic hiển thị ảnh từ API */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-[#00473e]" /></div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-[#475d5b]">
              <thead className="text-xs text-[#00473e] uppercase bg-[#f2f7f5]">
                <tr>
                  <th className="px-6 py-3">Banner</th>
                  <th className="px-6 py-3">Tiêu đề</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromos.map((p) => (
                  <tr key={p.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img 
                        src={`http://localhost:3001${p.imageUrl}`} 
                        alt="" 
                        className="h-12 w-20 object-cover rounded border bg-gray-50"
                        onError={(e) => {e.target.style.display='none'}}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#00332c]">{p.title}</td>
                    <td className="px-6 py-4">
                       <button onClick={() => handleToggleStatus(p)} className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {p.is_active ? "Hiển thị" : "Đang ẩn"}
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(p)} className="p-2 text-[#00473e] hover:bg-gray-100 rounded-lg"><Edit className="h-5 w-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal ADD */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm khuyến mãi mới">
        <form onSubmit={handleAddSubmit}>
          {renderFormFields()}
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={formLoading} className="bg-[#faae2b] text-[#00473e] font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 disabled:opacity-50">
              {formLoading ? "Đang xử lý..." : "Lưu khuyến mãi"}
            </button>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </form>
      </Modal>

      {/* Modal EDIT */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Cập nhật khuyến mãi">
        <form onSubmit={handleEditSubmit}>
          {renderFormFields()}
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={formLoading} className="bg-[#faae2b] text-[#00473e] font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 disabled:opacity-50">
              {formLoading ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}