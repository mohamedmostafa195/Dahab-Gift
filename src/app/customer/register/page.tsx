'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Phone, User, Lock, ArrowRight, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
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
      setError('يرجى إدخال الاسم بالكامل');
      return;
    }
    if (!cleanPhone) {
      setError('يرجى إدخال رقم الموبايل');
      return;
    }
    if (!cleanPass) {
      setError('يرجى إدخال كلمة المرور (كلمة المرور إلزامية)');
      return;
    }
    if (cleanPass.length < 4) {
      setError('كلمة المرور يجب ألا تقل عن 4 خانات');
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
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
      localStorage.setItem('dahab_customer_id', data.customer.id);
      localStorage.setItem('dahab_customer_name', data.customer.fullName);

      router.push('/customer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error registering customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            Join DAHAB VIP Club
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create your account and start earning stamps towards free haircuts
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
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tarek Mansour"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Phone Number (Required for Stamps) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Must be unique. Used to look up your stamps at the barbershop.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Create Password / PIN *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Benefits preview */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-amber-200/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Instant Digital Member QR Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Every 5th Haircut is on the House</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Member Pass...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Get QR Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/customer/login"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Sign In Here
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Back to Barbershop Site
          </Link>
        </div>
      </div>
    </div>
  );
}
