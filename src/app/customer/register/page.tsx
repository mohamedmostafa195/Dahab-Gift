'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Phone, User, Lock, ArrowRight, Sparkles, Loader2, CheckCircle2, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslations } from '@/lib/translations';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { language, setLanguage, isArabic } = useLanguage();
  const t = getTranslations(language).auth;
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = fullName.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanPass = password.trim();

    if (!cleanName) {
      setError(isArabic ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }
    if (!cleanPhone) {
      setError(isArabic ? 'يرجى إدخال رقم الموبايل' : 'Please enter your phone number');
      return;
    }
    if (!cleanPass) {
      setError(isArabic ? 'يرجى إدخال كلمة المرور' : 'Please enter a password');
      return;
    }
    if (cleanPass.length < 4) {
      setError(isArabic ? 'كلمة المرور يجب ألا تقل عن 4 خانات' : 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          fullName: cleanName,
          phoneNumber: cleanPhone,
          password: cleanPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isArabic ? 'فشل إنشاء الحساب' : 'Registration failed'));
      }

      localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
      localStorage.setItem('dahab_customer_id', data.customer.id);
      localStorage.setItem('dahab_customer_name', data.customer.fullName);
      localStorage.setItem('dahab_customer_data', JSON.stringify(data.customer));

      router.push('/customer/dashboard');
    } catch (err: any) {
      setError(err.message || (isArabic ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error registering customer'));
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

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            {t.registerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {t.registerSubtitle}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-950/30">
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                {t.fullName} *
              </label>
              <div className="relative">
                <User className={`absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isArabic ? 'مثال: طارق منصور' : 'e.g. Tarek Mansour'}
                  className={`w-full bg-zinc-900 border border-zinc-700 rounded-xl ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 text-sm text-white focus:outline-none focus:border-amber-400`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                {t.phoneRequired} *
              </label>
              <div className="relative">
                <Phone className={`absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01012345678"
                  className={`w-full bg-zinc-900 border border-zinc-700 rounded-xl ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 text-sm text-white focus:outline-none focus:border-amber-400`}
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                {t.phoneHint}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                {t.createPassword} *
              </label>
              <div className="relative">
                <Lock className={`absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordHint}
                  className={`w-full bg-zinc-900 border border-zinc-700 rounded-xl ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono`}
                />
              </div>
            </div>

            {/* Benefits preview */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-amber-200/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t.benefit1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t.benefit2}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.creatingAccount}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.registerBtn}</span>
                  <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            {t.haveAccount}{' '}
            <Link
              href="/customer/login"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              {t.signInHere}
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            {t.backToSite}
          </Link>
        </div>
      </div>
    </div>
  );
}
