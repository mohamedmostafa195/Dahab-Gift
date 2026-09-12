'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scissors, Sparkles, User, ShieldCheck, Menu, X, QrCode } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Scissors className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-extrabold tracking-wider text-white">
              DAHAB
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold -mt-1">
              Grooming Lounge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/#services" className="hover:text-amber-300 transition">
            Services & Pricing
          </Link>
          <Link href="/#loyalty" className="hover:text-amber-300 transition flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Loyalty Rewards (5=1 Free)
          </Link>
          <Link href="/#barbers" className="hover:text-amber-300 transition">
            Master Barbers
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/customer/login"
            className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-[1.02] transition"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e12] border-b border-amber-500/20 px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium">
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-zinc-300 hover:text-amber-400"
            >
              Services & Pricing
            </Link>
            <Link
              href="/#loyalty"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-amber-400 font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Loyalty Rewards (5=1 Free)
            </Link>
            <Link
              href="/#barbers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-zinc-300 hover:text-amber-400"
            >
              Master Barbers
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
            <Link
              href="/customer/login"
              onClick={() => setMobileMenuOpen(false)}
              className="gold-btn w-full py-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
