'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';
import { Scissors, Lock, Loader2 } from 'lucide-react';

function AdminProtectedContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, loading } = useAdminAuth();

  // If on login page, don't show sidebar and allow page to render
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center animate-spin mb-4 border border-amber-400/30">
          <Scissors className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-zinc-400">Verifying security credentials...</p>
      </div>
    );
  }

  // If not authenticated, block access and redirect
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Admin Access Required
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6">
          This area is restricted to barbershop managers and staff. Please sign in with your email and password.
        </p>
        <button
          onClick={() => router.replace('/admin/login')}
          className="gold-btn px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  // Fully authenticated: show sidebar & content
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row selection:bg-amber-400/30 selection:text-amber-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminProtectedContainer>{children}</AdminProtectedContainer>
    </AdminAuthProvider>
  );
}
