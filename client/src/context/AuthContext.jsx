'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // true khi app vừa mount và đang cố silent refresh (hồi sinh phiên sau F5)
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  // true khi đang login/refresh thủ công
  const [isLoading, setIsLoading] = useState(false);

  // cờ để Guard biết là bootstrap gặp 403 từ /users/me (admin-only test)
  const [lastAuthError, setLastAuthError] = useState(null);

  // chốt chống gọi refresh trùng
  const refreshingRef = useRef(false);

  // ------------ LOGIN / LOGOUT ------------
  const login = async (username, password, loginType) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, loginType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      setAccessToken(data.accessToken);
      setUser(data.user);
      setLastAuthError(null);

      // điều hướng theo role
      if (data.user.role === 1) window.location.href = '/admin123/dashboard';
      else if (data.user.role === 2) window.location.href = '/employee/dashboard';
      else window.location.href = '/';
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
    window.location.href = '/';
  };

  // ------------ SILENT REFRESH + LOAD USER (chạy sau F5) ------------
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

      // CASE TEST: /users/me chỉ cho admin → employee sẽ 403
      if (resMe.status === 403) {
        setUser(null);
        setLastAuthError('unauthorized'); // để Guard hiện “không có quyền”
        return null;
      }

      const dataMe = await resMe.json();
      if (!resMe.ok) throw new Error(dataMe?.message || 'Không lấy được thông tin người dùng');

      setUser(dataMe);
      setLastAuthError(null);
      return newAccessToken;
    } catch (_) {
      setAccessToken(null);
      setUser(null);
      setLastAuthError(null); // lỗi khác coi như phiên rỗng
      return null;
    } finally {
      refreshingRef.current = false;
    }
  };

  // ------------ FETCH WRAPPER (tự retry 1 lần khi 401) ------------
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

  // ------------ BOOTSTRAP SAU F5 ------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshAndLoadUser();
      if (mounted) setIsBootstrapping(false);
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    accessToken,
    isBootstrapping,
    isLoading,
    lastAuthError,          // <— Guard sẽ đọc cờ này
    login,
    logout,
    refreshAndLoadUser,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
};
