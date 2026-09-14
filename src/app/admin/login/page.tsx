'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Scissors,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both email/phone and password.');
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
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email, phone, or password.');
      }

      if (data.role === 'ADMIN') {
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
        if (data.customer) {
          localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
          localStorage.setItem('dahab_customer_id', data.customer.id);
          localStorage.setItem('dahab_customer_name', data.customer.fullName);
          localStorage.setItem('dahab_customer_data', JSON.stringify(data.customer));
        }
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-400">
            <Lock className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-widest font-black">
              SECURE VIP GATE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Barbershop Staff & Member Sign In
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Enter your credentials to access your loyalty pass or staff management dashboard
          </p>
        </div>

        <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-950/30">
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Email / Phone / Staff ID *
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@dahabbarbershop.com or 010xxxxxxx"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Password / Master PIN *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            <span>Don&apos;t have an account yet? </span>
            <Link
              href="/customer/register"
              className="text-amber-400 hover:text-amber-300 font-bold transition inline-flex items-center gap-1 hover:underline ml-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Register for VIP Membership</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 text-xs font-bold border border-amber-500/30 hover:border-amber-400/70 shadow-lg shadow-black/60 transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Barbershop Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
