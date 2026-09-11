'use client';

import React from 'react';
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
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, adminUser } = useAdminAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers CRM', href: '/admin/customers', icon: Users },
    { name: 'QR Camera Scanner', href: '/admin/scanner', icon: QrCode },
    { name: 'Visit History', href: '/admin/visits', icon: Scissors },
    { name: 'Rewards Vouchers', href: '/admin/rewards', icon: Gift },
    { name: 'Loyalty Rules', href: '/admin/settings', icon: Settings },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0d0d11] border-r border-amber-500/20 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Top */}
      <div>
        <div className="p-6 border-b border-zinc-800/80">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20">
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

          {adminUser && (
            <div className="mt-4 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
        <div className="px-3 py-6 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
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
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs transition border border-zinc-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            View Barbershop Site
          </span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition border border-rose-500/20 font-bold"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / Lock
          </span>
        </button>
      </div>
    </aside>
  );
}
