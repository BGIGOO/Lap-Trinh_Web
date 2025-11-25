"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Loader2,
  Calendar,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  FileText,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

// Import Components UI
import { Modal } from "@/components/admin123/Modal";
import { FormInput } from "@/components/admin123/FormInput";

export default function OrdersPage() {
  // --- STATE DỮ LIỆU ---
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // Dùng cho Modal Thêm đơn
  const [loading, setLoading] = useState(true);

  // --- STATE TÌM KIẾM & LỌC ---
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // --- STATE MODAL ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // --- STATE FORM (EDIT & ADD) ---
  // State cho Edit Modal
  const [selectedOrder, setSelectedOrder] = useState(null); // Chi tiết đơn hàng đang xem/sửa
  const [editForm, setEditForm] = useState({
    status: "",
    payment_status: "",
    note: ""
  });

  // State cho Add Modal
  const [newOrderCustomer, setNewOrderCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [newOrderItems, setNewOrderItems] = useState([]); // Giỏ hàng khi tạo đơn
  const [productSearch, setProductSearch] = useState(""); // Tìm sản phẩm để thêm

  // --- 1. FETCH DỮ LIỆU ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sản phẩm (chỉ gọi 1 lần khi mở trang hoặc khi cần tạo đơn)
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders]);

  // --- 2. XỬ LÝ LỌC LIST ---
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.order_code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.order_status === filterStatus;
    return matchSearch && matchStatus;
  });

  // --- 3. LOGIC MODAL ADD (TẠO ĐƠN) ---
  const openAddModal = () => {
    setNewOrderCustomer({ name: "", phone: "", email: "", address: "" });
    setNewOrderItems([]);
    setProductSearch("");
    setIsAddModalOpen(true);
  };

  // Thêm sản phẩm vào danh sách đơn mới
  const addToNewOrder = (product) => {
    const exists = newOrderItems.find((item) => item.product_id === product.id);
    if (exists) {
      // Nếu đã có -> tăng số lượng
      setNewOrderItems(prev => prev.map(item => 
        item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Nếu chưa có -> thêm mới
      setNewOrderItems([
        ...newOrderItems,
        {
          product_id: product.id,
          product_name: product.name,
          price: product.sale_price || product.original_price,
          quantity: 1,
          image_url: product.image_url
        }
      ]);
    }
  };

  // Xóa/Sửa số lượng item
  const updateItemQty = (index, newQty) => {
    if (newQty <= 0) {
      setNewOrderItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewOrderItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
    }
  };

  // Tính tổng tiền đơn mới
  const newOrderTotal = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit tạo đơn
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderCustomer.name || !newOrderCustomer.phone || !newOrderCustomer.address) {
      alert("Vui lòng nhập tên, số điện thoại và địa chỉ.");
      return;
    }
    if (newOrderItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: null,
          customer: newOrderCustomer,
          payment_method: "cod",
          note: "",
          items: newOrderItems
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchOrders();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      alert("Lỗi hệ thống khi tạo đơn.");
    } finally {
      setFormLoading(false);
    }
  };

  // --- 4. LOGIC MODAL EDIT (CHI TIẾT & SỬA) ---
  const openEditModal = async (order) => {
    // Reset state
    setSelectedOrder(null); 
    setIsEditModalOpen(true);
    
    try {
      // Fetch chi tiết đầy đủ (để lấy list items)
      const res = await fetch(`http://localhost:3001/api/orders/${order.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setEditForm({
          status: data.data.order_status,
          payment_status: data.data.payment_status,
          note: data.data.note || ""
        });
      }
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn:", err);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setFormLoading(true);

    try {
      // Gọi song song 2 API update status và payment
      await Promise.all([
        fetch(`http://localhost:3001/api/orders/${selectedOrder.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: editForm.status }),
        }),
        fetch(`http://localhost:3001/api/orders/${selectedOrder.id}/payment`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: editForm.payment_status }),
        })
      ]);
      
      // Update note nếu cần (tuỳ API của bạn có hỗ trợ không, ở đây giả định chỉ update status)
      
      setIsEditModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Cập nhật thất bại.");
    } finally {
      setFormLoading(false);
    }
  };

  // --- HELPER FORMAT ---
  const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

  // Filter sản phẩm trong modal Add
  const filteredProductsToAdd = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  // Map status hiển thị
  const renderStatusBadge = (status) => {
    const config = {
      pending: { text: "Đang chờ xử lý", color: "bg-orange-100 text-orange-700", icon: Clock },
      processing: { text: "Đang xử lý", color: "bg-blue-100 text-blue-700", icon: Loader2 },
      shipped: { text: "Đang giao", color: "bg-purple-100 text-purple-700", icon: Package },
      completed: { text: "Hoàn thành", color: "bg-green-100 text-green-700", icon: CheckCircle },
      cancelled: { text: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle },
    };
    const conf = config[status] || config.pending;
    const Icon = conf.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${conf.color}`}>
        <Icon size={12} /> {conf.text}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00473e]">Quản lý Đơn hàng</h1>
          <p className="text-[#475d5b] mt-1">Theo dõi và xử lý các đơn đặt hàng.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-[#faae2b] text-[#00473e] font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-opacity-90 transition-colors self-start md:self-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Tạo đơn hàng
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
        </div>
        <div className="relative">
          <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] appearance-none bg-white cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
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
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3 text-right">Tổng tiền</th>
                  <th className="px-6 py-3 text-center">Thanh toán</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-bold text-[#00473e]">{o.order_code}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{o.customer_name}</div>
                        <div className="text-xs text-gray-500">{o.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#faae2b]">
                        {formatCurrency(o.final_price)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {o.payment_status === "paid" ? (
                           <span className="text-green-600 font-semibold text-xs flex items-center justify-center gap-1">
                             <CheckCircle size={12}/> Đã thanh toán
                           </span>
                        ) : (
                           <span className="text-red-500 font-semibold text-xs flex items-center justify-center gap-1">
                             <Clock size={12}/> Chưa thanh toán
                           </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderStatusBadge(o.order_status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center gap-1 text-gray-500">
                          <Calendar size={12} /> {formatDate(o.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(o)}
                          className="p-2 text-[#00473e] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết & Cập nhật"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 italic">Không tìm thấy đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL TẠO ĐƠN MỚI --- */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo đơn hàng mới">
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto pr-1">
          {/* Cột Trái: Thông tin khách hàng */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#00473e] flex items-center gap-2 border-b pb-2">
              <User size={18} /> Thông tin khách hàng
            </h4>
            <FormInput 
              id="cus_name" name="name" label="Họ tên" required 
              value={newOrderCustomer.name} 
              onChange={(e) => setNewOrderCustomer({...newOrderCustomer, name: e.target.value})}
              icon={<User className="h-4 w-4 text-gray-400" />} 
            />
            <FormInput 
              id="cus_phone" name="phone" label="Số điện thoại" required 
              value={newOrderCustomer.phone} 
              onChange={(e) => setNewOrderCustomer({...newOrderCustomer, phone: e.target.value})}
              icon={<Phone className="h-4 w-4 text-gray-400" />} 
            />
            <FormInput 
              id="cus_email" name="email" label="Email (Không bắt buộc)" 
              value={newOrderCustomer.email} 
              onChange={(e) => setNewOrderCustomer({...newOrderCustomer, email: e.target.value})}
              icon={<FileText className="h-4 w-4 text-gray-400" />} 
            />
            <FormInput 
              id="cus_address" name="address" label="Địa chỉ giao hàng" required 
              value={newOrderCustomer.address} 
              onChange={(e) => setNewOrderCustomer({...newOrderCustomer, address: e.target.value})}
              icon={<MapPin className="h-4 w-4 text-gray-400" />} 
            />
          </div>

          {/* Cột Phải: Chọn sản phẩm */}
          <div className="space-y-4 flex flex-col h-full">
            <h4 className="font-bold text-[#00473e] flex items-center gap-2 border-b pb-2">
              <Package size={18} /> Chọn sản phẩm
            </h4>
            
            {/* Ô tìm kiếm sản phẩm nhỏ */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm sản phẩm để thêm..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#faae2b] outline-none"
              />
            </div>

            {/* List sản phẩm gợi ý */}
            <div className="border rounded-lg h-40 overflow-y-auto bg-gray-50 p-2 space-y-2">
              {filteredProductsToAdd.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={`http://localhost:3001${p.image_url}`} className="w-8 h-8 rounded object-cover" alt="" onError={(e)=>e.target.style.display='none'} />
                    <span className="text-sm font-medium truncate max-w-[120px]">{p.name}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => addToNewOrder(p)}
                    className="text-xs bg-[#e0f2f1] text-[#00473e] px-2 py-1 rounded hover:bg-[#b2dfdb] font-semibold"
                  >
                    + Thêm
                  </button>
                </div>
              ))}
            </div>

            {/* List sản phẩm đã chọn (Giỏ hàng mini) */}
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-[#475d5b] mb-2">Sản phẩm đã chọn ({newOrderItems.length})</h5>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-xs text-gray-600">
                    <tr>
                      <th className="p-2 text-left">Tên</th>
                      <th className="p-2 text-center">SL</th>
                      <th className="p-2 text-right">Tiền</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newOrderItems.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2 max-w-[120px] truncate" title={item.product_name}>{item.product_name}</td>
                        <td className="p-2 text-center">
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => updateItemQty(idx, parseInt(e.target.value))}
                            className="w-12 text-center border rounded py-1 text-xs"
                          />
                        </td>
                        <td className="p-2 text-right text-[#00473e] font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => updateItemQty(idx, 0)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {newOrderItems.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic text-xs">Chưa có sản phẩm nào</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-3 text-lg font-bold text-[#00473e]">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(newOrderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Form */}
          <div className="lg:col-span-2 pt-4 border-t flex justify-end gap-3">
             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Hủy bỏ</button>
             <button type="submit" disabled={formLoading} className="flex items-center bg-[#faae2b] text-[#00473e] font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-opacity-90 disabled:opacity-70">
                {formLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null} Tạo đơn hàng
             </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL UPDATE (CHI TIẾT & SỬA) --- */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Chi tiết đơn hàng ${selectedOrder?.order_code || "..."}`}>
        {!selectedOrder ? (
          <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-[#00473e]" /></div>
        ) : (
          <form onSubmit={handleUpdateOrder} className="space-y-6">
            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Khách hàng</p>
                <p className="font-medium text-[#00473e]">{selectedOrder.customer_name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                <p className="text-sm text-gray-600">{selectedOrder.shipping_address}</p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-gray-500 uppercase font-semibold">Thông tin đơn</p>
                <p className="text-sm"><span className="text-gray-500">Ngày tạo:</span> {formatDate(selectedOrder.created_at)}</p>
                <p className="text-sm"><span className="text-gray-500">Tổng tiền:</span> <span className="font-bold text-[#faae2b] text-lg">{formatCurrency(selectedOrder.final_price)}</span></p>
              </div>
            </div>

            {/* Product List */}
            <div>
              <p className="text-sm font-semibold text-[#475d5b] mb-2">Danh sách sản phẩm</p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                   <thead className="bg-gray-100 text-xs text-gray-600">
                      <tr>
                        <th className="p-2 text-left">Sản phẩm</th>
                        <th className="p-2 text-center">SL</th>
                        <th className="p-2 text-right">Đơn giá</th>
                        <th className="p-2 text-right">Thành tiền</th>
                      </tr>
                   </thead>
                   <tbody>
                      {selectedOrder.items?.map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-2">{item.product_name}</td>
                          <td className="p-2 text-center">x{item.quantity}</td>
                          <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                          <td className="p-2 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            </div>

            {/* Actions Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#475d5b]">Trạng thái đơn hàng</label>
                <select 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#faae2b] outline-none"
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="pending">Đang chờ xử lý</option>
                  <option value="processing">Đang xử lý (Đóng gói)</option>
                  <option value="shipped">Đang giao hàng</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#475d5b]">Thanh toán</label>
                <select 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#faae2b] outline-none"
                  value={editForm.payment_status}
                  onChange={(e) => setEditForm({...editForm, payment_status: e.target.value})}
                >
                  <option value="unpaid">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
               <button type="submit" disabled={formLoading} className="flex items-center bg-[#00473e] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-[#00332c] transition-colors disabled:opacity-70">
                 {formLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null} Cập nhật đơn hàng
               </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}