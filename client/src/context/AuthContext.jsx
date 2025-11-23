'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Dùng router của Next.js cho mượt

const AuthContext = createContext(null);

// Chuẩn hóa dữ liệu user
const pickUser = (payload) => {
  if (!payload) return null;
  const u = payload.user || payload.data || payload;
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email, // Quan trọng: Email thay username
    // username: u.username, // Đã xóa cột này trong DB
    phone: u.phone ?? null,
    address: u.address ?? null,
    avatar: u.avatar ?? null,
    birthday: u.birthday ?? null, // Mới thêm
    sex: u.sex ?? null,           // Mới thêm
    is_active: typeof u.is_active === 'number' ? u.is_active : Number(u.is_active ?? 1),
    role: typeof u.role === 'number' ? u.role : Number(u.role),
    created_at: u.created_at,
    updated_at: u.updated_at,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAuthError, setLastAuthError] = useState(null);
  
  const refreshingRef = useRef(false);
  const router = useRouter(); // Hook điều hướng

  // ------------ LOGIN / LOGOUT ------------
  // SỬA: Nhận email thay vì username
  const login = async (email, password, loginType) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, loginType }), // Gửi email
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      setAccessToken(data.accessToken);
      const userData = pickUser(data);
      setUser(userData);
      setLastAuthError(null);

      // Điều hướng bằng router.push (Mượt hơn window.location)
      const r = userData?.role;
      if (r === 1) router.push('/admin123/dashboard');
      else if (r === 2) router.push('/employee/dashboard');
      else router.push('/');
      
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    setAccessToken(null);
    setUser(null);
    setLastAuthError(null);
    router.push('/'); // Điều hướng về trang chủ
  };

  // ------------ SILENT REFRESH + LOAD USER ------------
  const refreshAndLoadUser = async () => {
    if (refreshingRef.current) return null;
    refreshingRef.current = true;
    try {
      const resRefresh = await fetch('/api/auth/refresh', { method: 'POST' });
      const dataRefresh = await resRefresh.json();
      if (!resRefresh.ok) throw new Error(dataRefresh?.message || 'Phiên hết hạn');

      const newAccessToken = dataRefresh.accessToken;
      setAccessToken(newAccessToken);

      const resMe = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      if (resMe.status === 403) {
        setUser(null);
        setLastAuthError('unauthorized');
        return null;
      }

      const payloadMe = await resMe.json();
      if (!resMe.ok) throw new Error(payloadMe?.message || 'Không lấy được thông tin');

      setUser(pickUser(payloadMe));
      setLastAuthError(null);
      return newAccessToken;
    } catch (_) {
      setAccessToken(null);
      setUser(null);
      setLastAuthError(null);
      return null;
    } finally {
      refreshingRef.current = false;
    }
  };

  // ------------ UPDATE USER FROM PAYLOAD ------------
  const updateUserInContext = (payload) => {
    const newUser = pickUser(payload);
    if (newUser) {
      setUser(newUser);
    }
  };

  // ------------ FETCH WRAPPER ------------
  const fetchWithAuth = async (url, options = {}, retry = true) => {
    const opts = { ...options, headers: { ...(options.headers || {}) } };
    if (accessToken) opts.headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(url, opts);
    if (res.status === 401 && retry) {
      const newToken = await refreshAndLoadUser();
      const newOpts = { ...opts, headers: { ...(opts.headers || {}) } };
      if (newToken) newOpts.headers.Authorization = `Bearer ${newToken}`;
      return fetch(url, newOpts);
    }
    return res;
  };

  // ------------ BOOTSTRAP ------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshAndLoadUser();
      if (mounted) setIsBootstrapping(false);
    })();
    return () => { mounted = false; };
  }, []);

  const value = {
    user,
    accessToken,
    isBootstrapping,
    isLoading,
    lastAuthError,
    login,
    logout,
    refreshAndLoadUser,
    updateUserInContext,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
};