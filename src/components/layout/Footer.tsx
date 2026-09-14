'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, MapPin, Phone, Clock, Globe } from 'lucide-react';
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

export default function Footer() {
  const { language } = useLanguage();
  const tNav = getTranslations(language).nav;
  const t = getTranslations(language).footer;
  const instagramUrl = 'https://www.instagram.com/dahabbarbershop';

  return (
    <footer className="bg-[#070709] border-t border-amber-500/20 pt-16 pb-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wider">
                {tNav.brand}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.desc}
            </p>
            <div className="flex items-center gap-3 text-amber-400 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500 hover:text-pink-400 transition flex items-center gap-2 text-xs font-semibold"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@dahabbarbershop</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#services" className="hover:text-amber-300 transition">
                  {t.servicesMenu}
                </Link>
              </li>
              <li>
                <Link href="/#loyalty" className="hover:text-amber-300 transition">
                  {t.vipLoyalty}
                </Link>
              </li>
              <li>
                <Link href="/#lounge-experience" className="hover:text-amber-300 transition">
                  {t.loungeFilmStory}
                </Link>
              </li>
              <li>
                <Link href="/#barbers" className="hover:text-amber-300 transition">
                  {t.masterStylists}
                </Link>
              </li>
              <li>
                <Link href="/customer/login" className="hover:text-amber-300 transition">
                  {t.checkStamps}
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              {t.workingHours}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span>{t.satThu}</span>
                <span className="text-white font-medium">{t.satThuTime}</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span>{t.friday}</span>
                <span className="text-white font-medium">{t.fridayTime}</span>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              {t.locationContact}
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="https://maps.apple/p/gq51gvKx_7ELGp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-amber-300 transition group"
                  title="Open Location in Maps"
                >
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-relaxed underline decoration-amber-500/30 underline-offset-4">{t.address}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+201091310689"
                  className="flex items-center gap-2.5 hover:text-amber-300 transition group"
                  title="Call Barbershop"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-zinc-200 font-bold tracking-wider">01091310689</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {tNav.brand} {tNav.tagline}. {t.allRightsReserved}</p>
          <p className="flex items-center gap-1">
            {t.credits}
          </p>
        </div>
      </div>
    </footer>
  );
}
