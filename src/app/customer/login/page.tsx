'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, User, Lock, ArrowRight, ArrowLeft, Loader2, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslations } from '@/lib/translations';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { language, setLanguage, isArabic } = useLanguage();
  const t = getTranslations(language).auth;
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
      }

      if (data.role === 'ADMIN') {
        // Seamless admin session storage & redirect
        localStorage.setItem('dahab_admin_authenticated', 'true');
        localStorage.setItem(
          'dahab_admin_user',
          JSON.stringify({
            email: data.user?.email || identifier,
            name: data.user?.fullName || 'Barbershop Admin',
          })
        );
        router.push('/admin');
      } else {
        // Customer session storage & redirect
        if (data.customer) {
          localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
          localStorage.setItem('dahab_customer_id', data.customer.id);
          localStorage.setItem('dahab_customer_name', data.customer.fullName);
          localStorage.setItem('dahab_customer_data', JSON.stringify(data.customer));
        }
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || (isArabic ? 'حدث خطأ أثناء تسجيل الدخول' : 'Error signing in. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Top right language switch */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-0.5 text-xs font-bold shadow-md">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition ${
              language === 'en'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-2.5 py-1 rounded-lg transition ${
              language === 'ar'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AR
          </button>
        </div>
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Scissors className="w-7 h-7 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
            {t.signInTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-light">
            {t.signInSubtitle}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#121216]/90 backdrop-blur-md border border-amber-500/25 p-6 sm:p-8 shadow-2xl shadow-black/60">
          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone or Email input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                {t.phoneOrEmail}
              </label>
              <div className="relative">
                <User className={`absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isArabic ? '01012345678 أو البريد الإلكتروني' : '01012345678 or your.email@example.com'}
                  className={`w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-3 text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 transition`}
                />
              </div>
            </div>

            {/* Password / PIN input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                  {t.passwordPin} *
                </label>
              </div>
              <div className="relative">
                <Lock className={`absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono placeholder:text-zinc-600 transition`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-3 hover:scale-[1.01] transition duration-200 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.signingIn}</span>
                </>
              ) : (
                <>
                  <span>{t.signInBtn}</span>
                  <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            {t.noAccount}{' '}
            <Link
              href="/customer/register"
              className="text-amber-400 hover:text-amber-300 font-bold transition"
            >
              {t.registerLink}
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 text-xs font-bold border border-amber-500/30 hover:border-amber-400/70 shadow-lg shadow-black/60 transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
            <span>{t.backToSite}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
