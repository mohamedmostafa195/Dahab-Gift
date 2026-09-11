'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StampPunchCard from '@/components/customer/StampPunchCard';
import {
  Scissors,
  Sparkles,
  Gift,
  ShieldCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Award,
  Phone,
  Calendar,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_BARBERS } from '@/lib/seed-data';

export default function LandingPage() {
  const [demoStamps, setDemoStamps] = useState(4);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredServices =
    activeCategory === 'ALL'
      ? INITIAL_SERVICES
      : INITIAL_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background gradient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>EXCLUSIVE VIP LOYALTY CLUB: 5 HAIRCUTS = 1 FREE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-[1.15]">
                Master Craftsmanship. <br />
                <span className="gold-gradient-text">Rewarding Loyalty.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Experience Cairo’s premier men’s grooming sanctuary. Every haircut stamps your digital loyalty card. Complete 5 visits and enjoy complimentary signature cuts and VIP perks.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/customer/register"
                  className="gold-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join Loyalty Program (Free)</span>
                </Link>

                <Link
                  href="/customer/login"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-sm font-bold text-zinc-200 border border-zinc-800 hover:border-amber-500/40 transition flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Check My Stamps & QR</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Instant Phone Number Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>No Physical Cards Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Continuous Multi-Cycle Rewards</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Stamp Card Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="text-center mb-3 flex items-center justify-between px-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Member Pass
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span>Try Stamp:</span>
                    <button
                      onClick={() => setDemoStamps((s) => (s < 5 ? s + 1 : 1))}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-mono font-bold text-xs"
                    >
                      +{demoStamps === 5 ? 'Reset' : '1 Visit'}
                    </button>
                  </div>
                </div>

                <StampPunchCard
                  currentVisits={demoStamps}
                  targetVisits={5}
                  currentCycle={1}
                  rewardTitle="Free Signature Haircut"
                  customerName="Mohamed Mostafa"
                  tier="GOLD"
                  hasUnclaimedReward={demoStamps >= 5}
                />

                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  Click "+1 Visit" above to test the 5/5 instant reward trigger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Loyalty Works Section */}
      <section id="loyalty" className="py-20 bg-[#0c0c0f] border-y border-amber-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-black text-amber-400">
              SIMPLE & EFFORTLESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              How the Loyalty Program Works
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              No paper punch cards to lose. Your phone number is your digital loyalty passport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 relative hover:border-amber-500/40 transition group">
              <span className="text-3xl font-serif font-black text-amber-500/20 group-hover:text-amber-400/40 transition">
                01
              </span>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center my-4 border border-amber-400/20">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Quick Phone Sign Up
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Register in 10 seconds using your phone number. No passwords required if you prefer quick access.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 relative hover:border-amber-500/40 transition group">
              <span className="text-3xl font-serif font-black text-amber-500/20 group-hover:text-amber-400/40 transition">
                02
              </span>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center my-4 border border-amber-400/20">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Get Your Haircut
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Visit the lounge and enjoy your styling session. Your barber scans your QR code or enters your phone number.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 relative hover:border-amber-500/40 transition group">
              <span className="text-3xl font-serif font-black text-amber-500/20 group-hover:text-amber-400/40 transition">
                03
              </span>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center my-4 border border-amber-400/20">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                5 Visits = 1 Free Cut
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                On your 5th haircut, the system automatically spawns a complimentary reward voucher in your wallet.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 relative hover:border-amber-500/40 transition group">
              <span className="text-3xl font-serif font-black text-amber-500/20 group-hover:text-amber-400/40 transition">
                04
              </span>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center my-4 border border-amber-400/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Infinite VIP Cycles
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                After redeeming your reward, a new cycle begins immediately so you keep racking up stamps indefinitely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Menu Section */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-amber-400">
              HAUTE GROOMING
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">
              Signature Services Menu
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Every service counts towards your loyalty reward stamps.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'HAIRCUT', 'PACKAGE', 'BEARD', 'TREATMENT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition">
                    {service.name}
                  </h3>
                  <span className="font-mono text-base font-bold text-amber-400 shrink-0">
                    {service.price} EGP
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {service.duration}
                </span>
                <span className="text-amber-400/90 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +1 Stamp Eligible
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Master Barbers Section */}
      <section id="barbers" className="py-20 bg-[#0c0c0f] border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest font-black text-amber-400">
              ARTISANS OF STYLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              Meet Our Master Barbers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Trained in classical razor techniques and modern bespoke styling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_BARBERS.map((barber) => (
              <div
                key={barber.id}
                className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden hover:border-amber-500/40 transition group"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-900/90 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {barber.rating} / 5.0
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-serif font-bold text-white mb-0.5">
                    {barber.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium mb-2">{barber.role}</p>
                  <p className="text-xs text-zinc-400">{barber.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Join Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-zinc-900 border border-amber-400/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-amber-950/30">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs uppercase font-black tracking-widest text-amber-400">
              JOIN THE INNER CIRCLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white">
              Ready to claim your free haircut?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Register now with your phone number and receive your digital VIP pass immediately.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/customer/register"
                className="gold-btn px-8 py-3.5 rounded-xl text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Free Loyalty Profile</span>
              </Link>
              <Link
                href="/customer/login"
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-zinc-200 border border-zinc-800"
              >
                <span>Existing Customer Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
