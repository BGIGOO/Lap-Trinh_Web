"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Loader2,
  ImageIcon,
  Type,
  DollarSign,
  AlignLeft,
  ListFilter,
  Layers,
  UploadCloud,
  CheckCircle,
  XCircle
} from "lucide-react";

// Giả định bạn đã có các component này từ các file trước
// Nếu chưa, hãy dùng code UI component tôi gửi ở cuối câu trả lời
import { Modal } from "@/components/admin123/Modal";
import { FormInput } from "@/components/admin123/FormInput";
import { ToggleSwitch } from "@/components/admin123/ToggleSwitch";

export default function ProductsPage() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE TÌM KIẾM & LỌC ---
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // --- STATE MODAL & FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' hoặc 'edit'
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // State form mặc định
  const initialFormState = {
    id: null,
    category_id: "",
    name: "",
    original_price: "",
    sale_price: "",
    description: "",
    image_url: null, // File object hoặc String URL
    priority: 100,
    is_active: 1,
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. LẤY DỮ LIỆU (PRODUCTS + CATEGORIES) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API để tiết kiệm thời gian
      const [resProd, resCat] = await Promise.all([
        fetch("http://localhost:3001/api/products"),
        fetch("http://localhost:3001/api/categories"),
      ]);

      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      if (dataProd.success) setProducts(dataProd.data);
      if (dataCat.success) setCategories(dataCat.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 2. XỬ LÝ LỌC ---
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory ? p.category_id === Number(filterCategory) : true;
    return matchName && matchCat;
  });

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "---";
  };

  // --- 3. XỬ LÝ FORM (INPUT CHANGE) ---
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

  const openEditModal = (product) => {
    setModalMode("edit");
    setFormData({
      id: product.id,
      category_id: product.category_id,
      name: product.name,
      original_price: product.original_price,
      sale_price: product.sale_price,
      description: product.description || "",
      image_url: product.image_url, // Giữ link ảnh cũ
      priority: product.priority,
      is_active: product.is_active,
    });
    setPreviewImage(product.image_url ? `http://localhost:3001${product.image_url}` : null);
    setIsModalOpen(true);
  };

  // --- 5. SUBMIT FORM (ADD & EDIT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const fd = new FormData();
      // Append từng trường vào FormData
      fd.append("category_id", formData.category_id);
      fd.append("name", formData.name);
      fd.append("original_price", formData.original_price);
      fd.append("sale_price", formData.sale_price);
      fd.append("description", formData.description);
      fd.append("is_active", formData.is_active);
      fd.append("priority", formData.priority);

      // Xử lý ảnh: Nếu là File mới thì gửi, nếu là String cũ thì cũng gửi (BE tự xử lý)
      if (formData.image_url) {
        fd.append("image_url", formData.image_url);
      }

      const url = modalMode === "add"
        ? "http://localhost:3001/api/products"
        : `http://localhost:3001/api/products/${formData.id}`;
      
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchData(); // Reload lại bảng
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      alert("Đã xảy ra lỗi kết nối!");
    } finally {
      setFormLoading(false);
    }
  };

  // --- 6. FORMAT TIỀN TỆ ---
  const formatCurrency = (val) => {
    if (!val) return "0₫";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">Quản lý Sản phẩm</h1>
          <p className="text-[#475d5b] mt-1">Danh sách và tùy chỉnh sản phẩm trong cửa hàng.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Thêm Sản phẩm
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] appearance-none bg-white cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Danh mục</th>
                  <th className="px-6 py-3 text-right">Giá gốc</th>
                  <th className="px-6 py-3 text-right">Giá KM</th>
                  <th className="px-6 py-3 text-center">Ưu tiên</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                           <img
                            src={`http://localhost:3001${p.image_url}`}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display='none' }}
                          />
                        </div>
                        <div className="font-semibold text-[#00332c]">{p.name}</div>
                      </td>
                      <td className="px-6 py-4">{getCategoryName(p.category_id)}</td>
                      <td className="px-6 py-4 text-right font-medium">{formatCurrency(p.original_price)}</td>
                      <td className="px-6 py-4 text-right font-medium text-[#faae2b]">{p.sale_price ? formatCurrency(p.sale_price) : "-"}</td>
                      <td className="px-6 py-4 text-center">{p.priority}</td>
                      <td className="px-6 py-4 text-center">
                        {p.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Hiện
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Ẩn
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-[#00473e] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                      Không tìm thấy sản phẩm nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL CHUNG CHO ADD & EDIT --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "add" ? "Thêm Sản Phẩm Mới" : "Cập Nhật Sản Phẩm"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          
          {/* Tên & Danh mục */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="name" name="name" label="Tên sản phẩm" required
              value={formData.name} onChange={handleFormChange}
              icon={<Type className="h-4 w-4 text-gray-400" />}
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#475d5b]">Danh mục</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleFormChange}
                  required
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] text-sm"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Giá cả */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="original_price" name="original_price" label="Giá gốc" required type="number"
              value={formData.original_price} onChange={handleFormChange}
              icon={<DollarSign className="h-4 w-4 text-gray-400" />}
            />
            <FormInput
              id="sale_price" name="sale_price" label="Giá khuyến mãi" type="number"
              value={formData.sale_price} onChange={handleFormChange}
              icon={<DollarSign className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* Upload Ảnh */}
          <div>
            <label className="block text-sm font-medium text-[#475d5b] mb-1">Hình ảnh</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-4">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-[#00473e] px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                  <UploadCloud size={16} />
                  {previewImage ? "Chọn ảnh khác" : "Tải ảnh lên"}
                  <input type="file" name="image_url" onChange={handleFormChange} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#475d5b]">Mô tả chi tiết</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] text-sm"
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>
          </div>

          {/* Ưu tiên & Trạng thái */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pt-2">
            <div className="w-full md:w-1/3">
               <FormInput
                id="priority" name="priority" label="Độ ưu tiên" type="number"
                value={formData.priority} onChange={handleFormChange}
              />
            </div>
            
            <ToggleSwitch
              id="is_active"
              name="is_active"
              label="Kích hoạt sản phẩm"
              checked={formData.is_active === 1}
              onChange={handleFormChange}
            />
          </div>

          {/* Nút Submit */}
          <div className="pt-4 flex justify-end border-t border-gray-100 mt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-opacity-90 disabled:opacity-70 transition-all"
            >
              {formLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {modalMode === "add" ? "Tạo Sản Phẩm" : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}