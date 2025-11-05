'use client';
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (username, password, loginTypeParam) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, loginType: loginTypeParam }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      setAccessToken(data.accessToken);
      setUser(data.user);

      if (data.user.role === 1) router.push('/admin123/dashboard');
      else if (data.user.role === 2) router.push('/employee/dashboard');
      else router.push('/');
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push('/');
    }
  };

  const value = { user, accessToken, isLoading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải nằm trong AuthProvider');
  return context;
};