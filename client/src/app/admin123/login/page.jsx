'use client'; // Trang login phải là client component

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // 1. Import "bộ não"

export default function AdminLoginPage() {
  // 2. Lấy hàm login và trạng thái isLoading từ "bộ não"
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    try {
      // 3. Yêu cầu "bộ não" thực hiện đăng nhập
      await auth.login(username, password);
      
      // (AuthContext sẽ tự động xử lý chuyển hướng)

    } catch (error) {
      // 4. Bắt lỗi nếu "bộ não" báo về
      setErr(error.message || 'Lỗi đăng nhập');
    }
  }

  // 5. Lấy trạng thái loading từ "bộ não"
  const isLoading = auth.isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-80 space-y-3 border p-6 rounded">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input 
          className="w-full border p-2 rounded" 
          placeholder="Username"
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          disabled={isLoading} // Thêm disabled
        />
        <input 
          className="w-full border p-2 rounded" 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          disabled={isLoading} // Thêm disabled
        />
        
        {err && <div className="text-sm text-red-500">{err}</div>}
        
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
          disabled={isLoading} // Thêm disabled
        >
          {isLoading ? 'Đang đăng nhập...' : 'Login'}
        </button>
      </form>
    </div>
  );
}