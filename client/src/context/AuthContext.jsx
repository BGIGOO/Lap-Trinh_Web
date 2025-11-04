'use client'; 

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // [SỬA LỖI TREO] Bắt đầu là false.
  // Chỉ "loading" KHI HÀM login() hoặc refresh() được gọi.
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  // (Hàm login giữ nguyên)
  const login = async (username, password, loginType = 'admin_employee') => {
    setIsLoading(true); // <-- Bật loading
    try {
      // ... (code fetch /api/auth/login)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, loginType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      setAccessToken(data.accessToken);
      setUser(data.user);
      if (data.user.role === 1 || data.user.role === 2) {
         router.push('/admin123/dashboard');
      } else {
         router.push('/');
      }
    } catch (error) {
      console.error(error);
      throw error; 
    } finally {
      setIsLoading(false); // <-- Tắt loading
    }
  };

  // (Hàm logout giữ nguyên)
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push('/');
    }
  };

  const refreshAndLoadUser = async () => {
    // [SỬA LỖI TREO] Bỏ chốt an toàn 'if (isLoading...)'
    
    setIsLoading(true); // <-- Bật loading
    try {
      // 1. Gọi refresh
      const resRefresh = await fetch('/api/auth/refresh');
      const dataRefresh = await resRefresh.json();
      if (!resRefresh.ok) throw new Error(dataRefresh.message);
      
      const newAccessToken = dataRefresh.accessToken;
      setAccessToken(newAccessToken);

      // 2. Dùng token mới gọi /me
      const resMe = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${newAccessToken}` },
      });
      const dataMe = await resMe.json();
      if (!resMe.ok) throw new Error(dataMe.message);

      setUser(dataMe); // Lưu user
    } catch (error) {
      console.error('Session expired or invalid:', error.message);
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false); // <-- Tắt loading
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    refreshAndLoadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// (useAuth giữ nguyên)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};

