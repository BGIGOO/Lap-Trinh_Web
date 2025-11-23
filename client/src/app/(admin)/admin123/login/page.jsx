'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  
  // 1. Đổi state từ username -> email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      // 2. Gọi hàm login với email
      // Lưu ý: Hàm login trong AuthContext cũng cần nhận tham số đầu tiên là email
      await login(email, password, 1); 
    } catch (error) {
      setErr(error.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-80 border p-6 rounded space-y-3">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        
        {/* 3. Cập nhật Input field cho Email */}
        <input
          className="w-full border p-2 rounded"
          type="email" // Thêm type email để browser hỗ trợ validate
          placeholder="Email" // Đổi placeholder
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required // Bắt buộc nhập
        />
        
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        
        {err && <div className="text-red-500 text-sm">{err}</div>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00473e] text-white p-2 rounded hover:bg-[#00332c] disabled:opacity-70"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Login'}
        </button>
      </form>
    </div>
  );
}