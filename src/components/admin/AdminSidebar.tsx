'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import {
  LayoutDashboard,
  Users,
  QrCode,
  Scissors,
  Gift,
  Settings,
  BarChart3,
  LogOut,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, adminUser } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers CRM', href: '/admin/customers', icon: Users },
    { name: 'QR Camera Scanner', href: '/admin/scanner', icon: QrCode },
    { name: 'Visit History', href: '/admin/visits', icon: Scissors },
    { name: 'Rewards Vouchers', href: '/admin/rewards', icon: Gift },
    { name: 'Loyalty Rules', href: '/admin/settings', icon: Settings },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out and lock the admin panel?')) {
      logout();
    }
  };

  const navContent = (
    <>
      {/* Brand Top */}
      <div>
        <div className="p-5 sm:p-6 border-b border-zinc-800/80">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-white block">
                  DAHAB
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block -mt-1">
                  Admin Lounge
                </span>
              </div>
            </Link>

            {/* Close button for mobile drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {adminUser && (
            <div className="mt-4 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-white block truncate">
                  {adminUser.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono block truncate">
                  {adminUser.email}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="px-3 py-4 sm:py-6 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-zinc-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2 mt-auto">
        <Link
          href="/"
          target="_blank"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs transition border border-zinc-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            View Barbershop Site
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition border border-rose-500/20 font-bold"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / Lock
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE TOP NAVBAR (Only visible on small screens < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0d0d11]/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 flex items-center justify-between shadow-lg">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-sm shadow-amber-500/20">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wider text-white block leading-tight">
              DAHAB
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold block">
              Admin Lounge
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/scanner"
            className="p-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 hover:bg-amber-400/10 transition flex items-center gap-1 text-xs font-semibold"
            title="QR Scanner"
          >
            <QrCode className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER & BACKDROP */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-[#0d0d11] h-full flex flex-col justify-between border-r border-amber-500/30 shadow-2xl z-10 overflow-y-auto animate-slide-right">
            {navContent}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Visible on md: and larger) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0d0d11] border-r border-amber-500/20 shrink-0 justify-between overflow-y-auto z-20">
        {navContent}
      </aside>
    </>
  );
}
