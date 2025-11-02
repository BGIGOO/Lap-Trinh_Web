// Đánh dấu đây là Client Component để có thể dùng hooks (useState)
'use client'; 

import { useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d?.message || 'Login failed page.js');
      return;
    }
    window.location.href = '/admin123/dashboard';
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-80 space-y-3 border p-6 rounded">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input 
          className="w-full border p-2 rounded" 
          placeholder="Username"
          value={username} 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          className="w-full border p-2 rounded" 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        
        {err && <div className="text-sm text-red-500">{err}</div>}
        
        {/* CHỈNH SỬA TẠI ĐÂY:
          'bg-orange-' đã được sửa thành 'bg-orange-500' (bạn có thể đổi số 100-900)
          'text-red-500' đã được sửa thành 'text-white' cho dễ đọc
        */}
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}