'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import {
  Scissors,
  Search,
  Plus,
  RefreshCw,
  QrCode,
  Shield,
  Menu,
  X,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onAddNewCustomer?: () => void;
  onOpenScanner?: () => void;
}

export default function AdminHeader({
  title,
  subtitle,
  onSearch,
  onAddNewCustomer,
  onOpenScanner,
}: AdminHeaderProps) {
  const { logout, adminUser } = useAdminAuth();
  const [searchVal, setSearchVal] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchVal(v);
    if (onSearch) {
      onSearch(v);
    }
  };

  const handleResetData = async () => {
    if (
      !confirm(
        'Reset system data to initial demo state? (Restores Mohamed Mostafa at 4/5 visits, Ahmed Hassan at 5/5, seed visits and rewards).'
      )
    ) {
      return;
    }

    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to sign out and lock the admin panel?')) {
      logout();
    }
  };

  return (
    <header className="bg-[#0f0f13]/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-3.5 sm:py-4 md:sticky md:top-0 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & User Status */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              {title}
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Admin Session
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          {onSearch && (
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search phone or name..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* QR Scanner Shortcut */}
          {onOpenScanner ? (
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Camera</span> Scan
            </button>
          ) : (
            <Link
              href="/admin/scanner"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Camera</span> Scan
            </Link>
          )}

          {/* Add New Customer */}
          {onAddNewCustomer && (
            <button
              onClick={onAddNewCustomer}
              className="gold-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Customer</span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetData}
            disabled={resetting}
            title="Reset to Sample Demo Data"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 transition text-xs flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Prominent Sign Out / Logout Button */}
          <button
            onClick={handleLogoutClick}
            title="Sign Out & Lock Dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-400 text-xs font-bold transition shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
