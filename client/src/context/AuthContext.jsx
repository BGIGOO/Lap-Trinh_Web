'use client'; 

import React, { createContext, useContext, useState, useEffect } from 'react'; // 1. Import useEffect
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  
  // 2. isLoading BẮT BUỘC phải mặc định là 'true'
  //    để chặn người dùng thấy trang "văng" ra khi F5
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  // 3. (MỚI) Thêm logic "Hồi phục" khi tải trang
  useEffect(() => {
    // Tự động chạy hàm này 1 LẦN DUY NHẤT khi app tải
    const loadUserFromToken = async () => {
      try {
        // 3a. Gọi proxy /refresh để lấy accessToken
        const resRefresh = await fetch('/api/auth/refresh', { method: 'POST' });
        const dataRefresh = await resRefresh.json();

        if (!resRefresh.ok) {
          throw new Error('Refresh token không hợp lệ hoặc đã hết hạn.');
        }

        const { accessToken } = dataRefresh;
        setAccessToken(accessToken); // Lưu token mới vào state

        // 3b. Dùng accessToken mới để gọi proxy /me
        const resUser = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const dataUser = await resUser.json();

        if (!resUser.ok) {
          throw new Error('Không thể lấy thông tin user.');
        }

        setUser(dataUser); // 3c. Lưu user vào state

      } catch (error) {
        console.log('Lỗi tự động đăng nhập:', error.message);
        // Nếu có lỗi (hết hạn, v.v.), đảm bảo state được dọn dẹp
        setAccessToken(null);
        setUser(null);
      } finally {
        // 3d. Dù thành công hay thất bại, BÁO CÁO là đã tải xong
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []); // [] nghĩa là chỉ chạy 1 lần lúc đầu

  // 4. Hàm Login (Giữ nguyên như cũ)
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      
      router.push('/admin123/dashboard');
      
    } catch (error) {
      console.error(error);
      throw error; 
    } finally {
      // Dù login thành công hay thất bại, cũng không còn loading nữa
      // (Trang dashboard sẽ tự xử lý loading của nó)
      // *Chúng ta set false ở đây nếu login thất bại*
      // *Nếu thành công, trang mới (dashboard) sẽ có isLoading=true*
      // *Tạm thời set false*
      setIsLoading(false);
    }
  };

  // 5. Hàm Logout (Giữ nguyên như cũ)
  const logout = async () => {
    // Báo là đang xử lý
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push('/admin123/login'); 
      // Logout xong thì không còn loading nữa
      setIsLoading(false); 
    }
  };

  const value = {
    user,
    accessToken,
    isLoading, // 6. Cung cấp isLoading ra ngoài
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook (Giữ nguyên)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};
