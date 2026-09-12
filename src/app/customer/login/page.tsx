'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, User, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
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
        throw new Error(data.error || 'Invalid credentials');
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
        }
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error signing in. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-400/30 selection:text-amber-200">
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
            Member Sign In
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-light">
            Enter your credentials to access your VIP pass and rewards
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
                Phone Number or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="01012345678 or your.email@example.com"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 transition"
                />
              </div>
            </div>

            {/* Password / PIN input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                  Password / PIN
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono placeholder:text-zinc-600 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-3 hover:scale-[1.01] transition duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link
              href="/customer/register"
              className="text-amber-400 hover:text-amber-300 font-bold transition"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition">
            ← Back to Barbershop Site
          </Link>
        </div>
      </div>
    </div>
  );
}
