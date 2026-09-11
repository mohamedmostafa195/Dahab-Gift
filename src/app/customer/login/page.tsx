'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Phone, ArrowRight, ShieldCheck, Sparkles, Loader2, KeyRound, AlertCircle } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('01012345678');
  const [password, setPassword] = useState('123456');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdminInput =
    phoneNumber.toLowerCase().includes('admin') ||
    phoneNumber.includes('@') ||
    phoneNumber.trim() === '01000000000';

  const handleSendOtp = () => {
    if (!phoneNumber) {
      setError('Please enter your phone number first.');
      return;
    }
    setOtpSent(true);
    setOtpCode('7890');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user typed admin email or ID here, guide them directly to admin login
    if (isAdminInput) {
      router.push('/admin/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          phoneNumber,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
      localStorage.setItem('dahab_customer_id', data.customer.id);
      localStorage.setItem('dahab_customer_name', data.customer.fullName);

      router.push('/customer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoSelect = (phone: string) => {
    setPhoneNumber(phone);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Switch to Admin Banner */}
        <div className="mb-4 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold hover:bg-amber-400/20 transition shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Looking for Admin & Staff Login? Click Here ➔</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Customer Sign In
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Access your haircut stamps, free rewards, and member QR pass
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-950/30">
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {isAdminInput && (
            <div className="p-3.5 mb-5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span>Admin credentials detected</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                You are on the Customer portal. Click below to sign into the Barbershop Admin Dashboard:
              </p>
              <Link
                href="/admin/login"
                className="gold-btn py-2 px-3 rounded-lg text-center font-bold text-xs"
              >
                Go to Admin Sign In Page ➔
              </Link>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Customer Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 01012345678"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Auth mode toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsOtpMode(!isOtpMode)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                {isOtpMode ? 'Use Password / PIN instead' : 'Login with SMS OTP Code'}
              </button>
            </div>

            {isOtpMode ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                  Verification Code (OTP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 font-bold shrink-0 border border-zinc-700"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 font-medium">
                    ✓ Demo SMS Code: <strong>7890</strong> auto-filled!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                  Password / PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <span>Sign In to Customer Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Customer Selectors */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block mb-2.5">
              Instant Demo Customer Accounts:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => quickDemoSelect('01012345678')}
                className="w-full text-left px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800/80 flex items-center justify-between"
              >
                <span><strong>Mohamed Mostafa</strong> (4/5 Stamps)</span>
                <span className="text-amber-400 text-[10px] font-mono">01012345678</span>
              </button>

              <button
                type="button"
                onClick={() => quickDemoSelect('01123456789')}
                className="w-full text-left px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800/80 flex items-center justify-between"
              >
                <span><strong>Ahmed Hassan</strong> (5/5 Reward Ready)</span>
                <span className="text-amber-400 text-[10px] font-mono">01123456789</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            Don't have a loyalty profile yet?{' '}
            <Link
              href="/customer/register"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Register Now (Free)
            </Link>
          </div>
        </div>

        {/* Admin Link at the bottom */}
        <div className="mt-6 text-center space-x-4 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Back to Barbershop Site
          </Link>
          <span>•</span>
          <Link href="/admin/login" className="text-amber-400 font-bold hover:underline">
            Go to Admin Dashboard Login ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
