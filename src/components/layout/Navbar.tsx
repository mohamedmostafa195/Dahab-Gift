'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scissors, Sparkles, User, Menu, X, Video, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslations } from '@/lib/translations';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, toggleLanguage, isArabic } = useLanguage();
  const t = getTranslations(language);
  const instagramUrl = 'https://www.instagram.com/dahabbarbershop';

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
              {t.nav.brand}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold -mt-1">
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <Link href="/#services" className="hover:text-amber-300 transition">
            {t.nav.services}
          </Link>
          <Link href="/#loyalty" className="hover:text-amber-300 transition flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.nav.loyalty}
          </Link>
          <Link href="/#lounge-experience" className="hover:text-amber-300 transition flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            {t.nav.loungeFilm}
          </Link>
          <Link href="/#barbers" className="hover:text-amber-300 transition">
            {t.nav.barbers}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Switcher Button (AR / EN) */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800/90 rounded-xl p-1 gap-1 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm shadow-amber-500/20 scale-[1.02]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                language === 'ar'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm shadow-amber-500/20 scale-[1.02]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="العربية"
            >
              AR
            </button>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-pink-400 hover:text-white hover:border-pink-500/50 hover:bg-pink-600/10 transition"
            title="Follow on Instagram @dahabbarbershop"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <Link
            href="/admin/login"
            className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-[1.02] transition"
          >
            <User className="w-4 h-4" />
            <span>{t.nav.login}</span>
          </Link>
        </div>

        {/* Mobile Actions (Lang Button + Menu Trigger) */}
        <div className="md:hidden flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'en'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black'
                  : 'text-zinc-400'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'ar'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black'
                  : 'text-zinc-400'
              }`}
            >
              AR
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
              {t.nav.services}
            </Link>
            <Link
              href="/#loyalty"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-amber-400 font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.nav.loyalty}
            </Link>
            <Link
              href="/#lounge-experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-zinc-300 hover:text-amber-400 flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-amber-400" />
              {t.nav.loungeFilmFull}
            </Link>
            <Link
              href="/#barbers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-zinc-300 hover:text-amber-400"
            >
              {t.nav.barbers}
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
            {/* Language Switch Row inside Drawer */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 px-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{t.nav.switchLang}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    language === 'ar'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  العربية (AR)
                </button>
              </div>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-zinc-900 text-center text-sm font-bold border border-pink-500/30 text-pink-400 flex items-center justify-center gap-2"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>{t.nav.followIg} @dahabbarbershop</span>
            </a>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="gold-btn w-full py-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{t.nav.login}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

