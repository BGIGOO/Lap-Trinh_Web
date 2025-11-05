'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(username, password, 2);
    } catch (error) {
      setErr(error.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-80 border p-6 rounded space-y-3">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input
          className="w-full border p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Login'}
        </button>
      </form>
    </div>
  );
}