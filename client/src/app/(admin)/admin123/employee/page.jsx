"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext"; // Giả định context path
import {
  User,
  Save,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  UserPlus,
  Mail,
  Phone,
  Home,
  Image as ImageIcon,
  Lock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";

// Tách ra hook
import { useDebounce } from "@/hooks/useDebounce"; 
// Tách ra components
import { Modal } from "@/components/admin123/Modal";
import { FormInput } from "@/components/admin123/FormInput";
import { ToggleSwitch } from "@/components/admin123/ToggleSwitch";

export default function EmployeePage() {
  const { fetchWithAuth } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    is_active: "",
  });
  const [sort, setSort] = useState("created_at:desc");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedFilters = useDebounce(filters, 800);

  // Hàm tải dữ liệu
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", meta.page);
      params.append("limit", meta.limit);
      params.append("sort", sort);

      if (debouncedFilters.name) params.append("name", debouncedFilters.name);
      if (debouncedFilters.email) params.append("email", debouncedFilters.email);
      if (debouncedFilters.phone) params.append("phone", debouncedFilters.phone);
      if (debouncedFilters.is_active !== "") params.append("is_active", debouncedFilters.is_active);

      const res = await fetchWithAuth(`/api/users/employees?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Tải dữ liệu thất bại");
      }

      const data = await res.json();
      setEmployees(data.data || []);
      setMeta(data.meta || { page: 1, limit: 10, total: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, meta.page, meta.limit, sort, debouncedFilters]);

  // Tải dữ liệu khi filter, sort, page thay đổi
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setMeta((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi lọc
  };

  const handleSort = (column) => {
    setSort((prev) => {
      const [col, dir] = prev.split(":");
      if (col === column) {
        return `${column}:${dir === "asc" ? "desc" : "asc"}`;
      }
      return `${column}:desc`;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(meta.total / meta.limit)) return;
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  // ----- Logic Modal Thêm/Sửa -----
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const openAddModal = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      avatar: "",
      is_active: 1, // Mặc định là kích hoạt
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user.id, // Rất quan trọng
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      avatar: user.avatar || "",
      is_active: user.is_active,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "is_active") {
      setFormData((prev) => ({ ...prev, is_active: checked ? 1 : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // API: Thêm nhân viên (POST /api/users/employees)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetchWithAuth("/api/users/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Tạo nhân viên thất bại");

      setIsAddModalOpen(false);
      fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // API: Sửa nhân viên (PUT /api/users/profile)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // API BE của bạn dùng /profile nên đã bao gồm `id`
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
      
      setIsEditModalOpen(false);
      fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // API: Kích hoạt/Vô hiệu (PATCH /api/users/activate)
  const handleToggleActivate = async (user) => {
    // Không dùng window.confirm
    if (!confirm(`Bạn có chắc muốn ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản ${user.name}?`)) {
      return;
    }

    try {
      const res = await fetchWithAuth("/api/users/activate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Thao tác thất bại");
      
      fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      setError(err.message); // Hiển thị lỗi ở bảng chính
    }
  };

  // ----- Render -----

  const SortIcon = ({ column }) => {
    const [col, dir] = sort.split(":");
    if (col !== column) return <ArrowUpDown className="h-4 w-4 opacity-30" />;
    return dir === "asc" ? (
      <ArrowUpDown className="h-4 w-4 transform rotate-180" /> // Giả lập sort up
    ) : (
      <ArrowUpDown className="h-4 w-4" /> // Giả lập sort down
    );
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">
            Quản lý Nhân viên
          </h1>
          <p className="text-base text-[#475d5b] mt-1">
            Thêm mới, tìm kiếm và quản lý nhân viên.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm Nhân viên
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Tên nhân viên..."
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
            />
          </div>
          <input
            type="text"
            name="email"
            placeholder="Email..."
            value={filters.email}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại..."
            value={filters.phone}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
          <select
            name="is_active"
            value={filters.is_active}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang kích hoạt</option>
            <option value="0">Đã vô hiệu</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (
          <div className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#00473e]" />
          </div>
        )}
        {error && <p className="p-6 text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-[#475d5b]">
              <thead className="text-xs text-[#00473e] uppercase bg-[#f2f7f5]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nhân viên
                  </th>
                  <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('phone')}>
                    <div className="flex items-center">
                      SĐT <SortIcon column="phone" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                     <div className="flex items-center">
                      Ngày tham gia <SortIcon column="created_at" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Cập Nhật Thông Tin
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      Không tìm thấy nhân viên nào.
                    </td>
                  </tr>
                ) : (
                  employees.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-[#00332c] flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-3"
                          src={user.avatar || `https://placehold.co/40x40/00473e/f2f7f5?text=${user.name.charAt(0)}`}
                          alt={user.name}
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/00473e/f2f7f5?text=${user.name.charAt(0)}` }}
                        />
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActivate(user)}
                          className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {user.is_active ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {user.is_active ? "Kích hoạt" : "Vô hiệu"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-[#00473e] hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {/* <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-5 w-5" />
                        </button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.total > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-100">
            <span className="text-sm text-[#475d5b]">
              Hiển thị{" "}
              <strong>
                {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)}
              </strong>{" "}
              trên <strong>{meta.total}</strong>
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page * meta.limit >= meta.total}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Nhân viên */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm nhân viên mới"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <FormInput
            id="add-name" name="name" label="Họ tên" required
            value={formData.name} onChange={handleFormChange}
            icon={<User className="h-5 w-5 text-gray-400" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="add-username" name="username" label="Tên đăng nhập" required
              value={formData.username} onChange={handleFormChange}
              icon={<UserPlus className="h-5 w-5 text-gray-400" />}
            />
             <FormInput
              id="add-password" name="password" label="Mật khẩu" type="password" required
              value={formData.password} onChange={handleFormChange}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              autoComplete="new-password"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="add-email" name="email" label="Email" type="email" required
              value={formData.email} onChange={handleFormChange}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            <FormInput
              id="add-phone" name="phone" label="Số điện thoại"
              value={formData.phone} onChange={handleFormChange}
              icon={<Phone className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <FormInput
            id="add-address" name="address" label="Địa chỉ"
            value={formData.address} onChange={handleFormChange}
            icon={<Home className="h-5 w-5 text-gray-400" />}
          />
          <FormInput
            id="add-avatar" name="avatar" label="Link Avatar"
            value={formData.avatar} onChange={handleFormChange}
            icon={<ImageIcon className="h-5 w-5 text-gray-400" />}
          />
          <ToggleSwitch
            id="add-is_active" name="is_active" label="Kích hoạt tài khoản"
            checked={formData.is_active === 1}
            onChange={handleFormChange}
          />

          {/* Nút Submit và Lỗi */}
          <div className="pt-4 flex justify-between items-center">
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              <span>Lưu Nhân viên</span>
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      </Modal>

      {/* Modal Sửa Nhân viên */}
       <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Cập nhật thông tin nhân viên"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
           <FormInput
            id="edit-name" name="name" label="Họ tên" required
            value={formData.name} onChange={handleFormChange}
            icon={<User className="h-5 w-5 text-gray-400" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="edit-email" name="email" label="Email" type="email" required
              value={formData.email} onChange={handleFormChange}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            <FormInput
              id="edit-phone" name="phone" label="Số điện thoại"
              value={formData.phone} onChange={handleFormChange}
              icon={<Phone className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <FormInput
            id="edit-address" name="address" label="Địa chỉ"
            value={formData.address} onChange={handleFormChange}
            icon={<Home className="h-5 w-5 text-gray-400" />}
          />
          <FormInput
            id="edit-avatar" name="avatar" label="Link Avatar"
            value={formData.avatar} onChange={handleFormChange}
            icon={<ImageIcon className="h-5 w-5 text-gray-400" />}
          />
           <ToggleSwitch
            id="edit-is_active" name="is_active" label="Kích hoạt tài khoản"
            checked={formData.is_active === 1}
            onChange={handleFormChange}
          />

          {/* Nút Submit và Lỗi */}
          <div className="pt-4 flex justify-between items-center">
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              <span>Lưu thay đổi</span>
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
}