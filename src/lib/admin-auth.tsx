'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: { email: string; name: string } | null;
  login: (emailOrPhone: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const authStatus = localStorage.getItem('dahab_admin_authenticated');
    const storedUser = localStorage.getItem('dahab_admin_user');

    if (authStatus === 'true' && storedUser) {
      setIsAdminAuthenticated(true);
      setAdminUser(JSON.parse(storedUser));
    } else {
      setIsAdminAuthenticated(false);
      setAdminUser(null);
      // If we are on an admin page that is not /admin/login, redirect to login
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    }
    setLoading(false);
  }, [pathname, router]);

  const login = async (emailOrPhone: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: emailOrPhone, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      const userData = {
        email: data.user.email || emailOrPhone,
        name: data.user.fullName || 'Barbershop Admin',
      };

      localStorage.setItem('dahab_admin_authenticated', 'true');
      localStorage.setItem('dahab_admin_user', JSON.stringify(userData));

      setIsAdminAuthenticated(true);
      setAdminUser(userData);
      router.replace('/admin');
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('dahab_admin_authenticated');
    localStorage.removeItem('dahab_admin_user');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    router.replace('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
