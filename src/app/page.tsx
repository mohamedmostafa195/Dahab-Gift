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
  User,
  Users,
  Award,
  Phone,
  Calendar,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_BARBERS } from '@/lib/seed-data';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredServices =
    activeCategory === 'ALL'
      ? INITIAL_SERVICES
      : INITIAL_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glow lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DAHAB VIP CLUB • 5 HAIRCUTS = 1 FREE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-[1.15]">
                Master Craftsmanship. <br />
                <span className="gold-gradient-text">Every 5th Cut is on Us.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Experience Cairo’s premier luxury grooming lounge in Heliopolis. No physical cards to carry—simply give your phone number when you visit and enjoy complimentary haircuts and VIP perks.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/#services"
                  className="gold-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 hover:scale-[1.02] transition"
                >
                  <span>Explore Services & Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>No Physical Cards Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Instant Phone Lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Free Cut Every 5 Visits</span>
                </div>
              </div>
            </div>

            {/* Right Clean VIP Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl bg-gradient-to-b from-[#16161c] to-[#0f0f13] border border-amber-500/30 p-6 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden">
                  {/* Subtle card glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-serif font-bold text-white block">DAHAB VIP CLUB</span>
                        <span className="text-[10px] text-amber-400/90 font-medium">Digital Loyalty Pass</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                      5 Cuts = 1 Free
                    </span>
                  </div>

                  {/* Visual 5-Stamp Progression */}
                  <div className="py-6">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="text-zinc-400 font-medium">Your Stamp Progress:</span>
                      <span className="text-amber-400 font-bold font-mono">5 Visits Cycle</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                          className="aspect-square rounded-2xl bg-zinc-900/90 border border-amber-500/20 flex flex-col items-center justify-center p-1 text-center group hover:border-amber-400/50 transition"
                        >
                          <Scissors className="w-4 h-4 text-amber-400 mb-1" />
                          <span className="text-[10px] font-bold text-zinc-300">#{num}</span>
                        </div>
                      ))}

                      {/* 5th Free Reward Stamp */}
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex flex-col items-center justify-center p-1 text-center shadow-lg shadow-amber-500/20 animate-pulse">
                        <Gift className="w-4 h-4 text-zinc-950 mb-1" />
                        <span className="text-[9px] font-black text-zinc-950 uppercase leading-none">FREE!</span>
                      </div>
                    </div>
                  </div>

                  {/* Reward Description */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">Complimentary Signature Haircut</span>
                      <span className="text-[11px] text-zinc-400 block">Automatically unlocks on your 5th visit</span>
                    </div>
                  </div>
                </div>
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
            <div className="pt-3 flex items-center justify-center">
              <Link
                href="/#services"
                className="gold-btn px-8 py-3.5 rounded-xl text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Explore Services & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
