'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Scissors,
  Sparkles,
  Gift,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Phone,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  X,
  Video,
  Eye,
  Heart,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_BARBERS } from '@/lib/seed-data';

// Custom Instagram SVG Icon
function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [heroTab, setHeroTab] = useState<'CARD' | 'VIDEO'>('CARD');
  const [modalVideo, setModalVideo] = useState<{
    src: string;
    title: string;
    igUrl: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const filteredServices =
    activeCategory === 'ALL'
      ? INITIAL_SERVICES
      : INITIAL_SERVICES.filter((s) => s.category === activeCategory);

  const instagramUrl = 'https://www.instagram.com/dahabbarbershop';

  const reels = [
    {
      id: 1,
      title: 'Precision Taper Fade & Scissor Craft',
      tag: '#DahabBarber',
      views: '18.5K',
      likes: '1.9K',
      video: '/videos/reel-1.mp4',
      url: 'https://www.instagram.com/reel/DFYl6SgNtKc/',
    },
    {
      id: 2,
      title: 'Royal Beard Sculpting & Steam Towel',
      tag: '#BeardPerfection',
      views: '32.1K',
      likes: '3.4K',
      video: '/videos/reel-2.mp4',
      url: 'https://www.instagram.com/reel/DBjSH6StDne/',
    },
    {
      id: 3,
      title: 'VIP Lounge Atmosphere & Hospitality',
      tag: '#CairoGrooming',
      views: '44.8K',
      likes: '4.7K',
      video: '/videos/reel-3.mp4',
      url: 'https://www.instagram.com/reel/C_T7KKDt-zc/',
    },
  ];

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

              {/* CTAs with Video Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/#services"
                  className="gold-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 hover:scale-[1.02] transition"
                >
                  <span>Explore Services & Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() =>
                    setModalVideo({
                      src: '/videos/dahab-reel.mp4',
                      title: 'DAHAB Grooming Lounge • Film Experience',
                      igUrl: 'https://www.instagram.com/reel/DFyFmfsNdVS/',
                    })
                  }
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-bold bg-zinc-900/90 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-zinc-800 hover:border-amber-400 flex items-center justify-center gap-3 transition group shadow-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition border border-amber-400/30">
                    <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-0.5" />
                  </div>
                  <span>Watch Lounge Film</span>
                </button>
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

            {/* Right Interactive Card & Video Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Tab Switcher */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => setHeroTab('CARD')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    heroTab === 'CARD'
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Loyalty Pass (5 Cuts)</span>
                </button>
                <button
                  onClick={() => setHeroTab('VIDEO')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    heroTab === 'VIDEO'
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Lounge Film</span>
                </button>
              </div>

              <div className="relative mx-auto max-w-md">
                {heroTab === 'CARD' ? (
                  /* VIP Loyalty Card */
                  <div className="rounded-3xl bg-gradient-to-b from-[#16161c] to-[#0f0f13] border border-amber-500/30 p-6 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden animate-in fade-in duration-300">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                          <Scissors className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-serif font-bold text-white block">
                            DAHAB VIP CLUB
                          </span>
                          <span className="text-[10px] text-amber-400/90 font-medium">
                            Digital Loyalty Pass
                          </span>
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
                          <span className="text-[9px] font-black text-zinc-950 uppercase leading-none">
                            FREE!
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reward Description */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-300 block">
                          Complimentary Signature Haircut
                        </span>
                        <span className="text-[11px] text-zinc-400 block">
                          Automatically unlocks on your 5th visit
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Hero Video Preview Card with Dahab Video */
                  <div className="rounded-3xl bg-gradient-to-b from-[#16161c] to-[#0f0f13] border border-amber-500/40 p-4 shadow-2xl shadow-black/80 relative overflow-hidden animate-in fade-in duration-300">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-950 group flex items-center justify-center">
                      {/* Ambient Blurred Background Video */}
                      <video
                        src="/videos/dahab-reel.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 pointer-events-none"
                      />
                      {/* Crisp Uncropped Centered Video */}
                      <video
                        src="/videos/dahab-reel.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="relative z-10 max-h-full max-w-full h-full object-contain mx-auto group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 pointer-events-none z-10" />

                      {/* Play Action Overlay */}
                      <button
                        onClick={() =>
                          setModalVideo({
                            src: '/videos/dahab-reel.mp4',
                            title: 'DAHAB Grooming Lounge • Film Experience',
                            igUrl: 'https://www.instagram.com/reel/DFyFmfsNdVS/',
                          })
                        }
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-zinc-950 text-zinc-950 ml-1" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-amber-400/40">
                          Click to Watch in HD
                        </span>
                      </button>

                      {/* Bottom Tag */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-amber-300">
                          DAHAB Grooming Lounge
                        </span>
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-amber-400 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-700"
                        >
                          <InstagramIcon className="w-3 h-3 text-pink-400" />
                          <span>@dahabbarbershop</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video & Instagram Showcase Section */}
      <section id="lounge-experience" className="py-20 bg-[#0c0c10] border-y border-amber-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold mb-3">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>FOLLOW @DAHABBARBERSHOP ON INSTAGRAM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                The Dahab Experience in Motion
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Watch our master barbers in action. Precision razor cuts, beard sculpting, and bespoke grooming.
              </p>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.03] transition shrink-0"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Video & Reels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Interactive Lounge Video Player */}
            <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-amber-500/30 overflow-hidden shadow-2xl relative group">
              <div className="aspect-[16/10] sm:aspect-video relative overflow-hidden bg-zinc-950 flex items-center justify-center">
                {/* Ambient Blurred Background Video */}
                <video
                  src="/videos/dahab-reel.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 pointer-events-none"
                />

                {/* Crisp Uncropped Centered Video */}
                <video
                  ref={videoRef}
                  src="/videos/dahab-reel.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="relative z-10 max-h-full max-w-full h-full object-contain mx-auto"
                />

                {/* Video Controls Bar Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                      ★ DAHAB CINEMATIC REEL
                    </span>
                    <a
                      href="https://www.instagram.com/reel/DFyFmfsNdVS/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-black/60 hover:bg-black text-white transition border border-white/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center hover:scale-105 transition"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-zinc-950" />
                        ) : (
                          <Play className="w-5 h-5 fill-zinc-950 ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="w-10 h-10 rounded-xl bg-zinc-900/80 text-white border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-amber-400" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setModalVideo({
                          src: '/videos/dahab-reel.mp4',
                          title: 'Master Stylist Artistry & Atmosphere',
                          igUrl: 'https://www.instagram.com/reel/DFyFmfsNdVS/',
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700"
                    >
                      Full Screen HD
                    </button>
                  </div>
                </div>
              </div>

              {/* Player Caption */}
              <div className="p-6 bg-gradient-to-b from-zinc-900 to-[#0e0e12] border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-serif font-bold text-white">
                    Master Stylist Artistry & Atmosphere
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-bold">1080p HD</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Step inside Heliopolis’s premier gentlemen’s grooming lounge. Experience the complimentary hospitality, tailored scissor styling, and luxury treatment.
                </p>
              </div>
            </div>

            {/* Instagram Reels Showcase (3 Vertical Cards) */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() =>
                    setModalVideo({
                      src: reel.video,
                      title: reel.title,
                      igUrl: reel.url,
                    })
                  }
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 overflow-hidden relative group transition duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="aspect-[9/16] relative overflow-hidden bg-zinc-950">
                    <video
                      src={reel.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />

                    {/* Play Badge */}
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-pink-600 transition shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>

                    {/* Direct Instagram Link Button */}
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/90 transition border border-white/20"
                      title="Open on Instagram"
                    >
                      <InstagramIcon className="w-3 h-3" />
                    </a>

                    {/* Stats & Tag */}
                    <div className="absolute bottom-2 left-2 right-2 space-y-1 pointer-events-none">
                      <span className="text-[10px] font-bold text-amber-400 block truncate">
                        {reel.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-white leading-tight block line-clamp-2">
                        {reel.title}
                      </span>
                      <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                        <span className="flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5 text-zinc-400" />
                          {reel.views}
                        </span>
                        <span className="flex items-center gap-1 text-pink-400">
                          <Heart className="w-2.5 h-2.5 fill-pink-400" />
                          {reel.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Loyalty Works Section */}
      <section id="loyalty" className="py-20 bg-[#08080a] relative">
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
                Register in 10 seconds using your phone number and name. Instant access to your digital card.
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
                Visit the lounge and enjoy your styling session. Your barber records your visit in 1 click.
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
                On your 5th haircut, the system automatically unlocks a complimentary voucher for your next cut.
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
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/customer/login"
                className="gold-btn px-8 py-3.5 rounded-xl text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Join VIP Club Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>Instagram Profile</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Instagram Button */}
      <aside className="fixed bottom-6 right-6 z-40">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-2xl shadow-pink-600/40 hover:scale-105 transition-transform duration-300 border border-white/20"
        >
          <InstagramIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">Follow @dahabbarbershop</span>
        </a>
      </aside>

      {/* Fullscreen Video Modal */}
      {modalVideo && (
        <div
          onClick={() => setModalVideo(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-zinc-950 rounded-3xl border border-amber-500/40 overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-zinc-800 bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-serif font-bold text-white">
                  {modalVideo.title}
                </span>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black relative max-h-[70vh] flex items-center justify-center">
              <video
                src={modalVideo.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Cairo’s Luxury Grooming Sanctuary in Heliopolis
              </span>
              <a
                href={modalVideo.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Watch on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
