import React from 'react';
import Link from 'next/link';
import { Scissors, Sparkles, MapPin, Phone, Clock, Globe, Share2 } from 'lucide-react';

export default function Footer() {
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
                DAHAB
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cairo’s luxury grooming sanctuary. Where traditional master craftsmanship meets modern luxury and loyalty rewards.
            </p>
            <div className="flex items-center gap-3 text-amber-400 pt-2">
              <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition cursor-pointer">
                <Globe className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition cursor-pointer">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#services" className="hover:text-amber-300 transition">
                  Services Menu
                </Link>
              </li>
              <li>
                <Link href="/#loyalty" className="hover:text-amber-300 transition">
                  VIP Loyalty Program (5 = 1 Free)
                </Link>
              </li>
              <li>
                <Link href="/#barbers" className="hover:text-amber-300 transition">
                  Our Master Stylists
                </Link>
              </li>
              <li>
                <Link href="/customer/login" className="hover:text-amber-300 transition">
                  Check My Haircut Stamps
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Working Hours
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span>Saturday – Thursday</span>
                <span className="text-white font-medium">11:00 AM – 11:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span>Friday</span>
                <span className="text-white font-medium">1:30 PM – 12:00 AM</span>
              </li>
              <li className="text-amber-400/90 pt-1 text-[11px]">
                ★ Walk-ins and reservations welcome
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Location & Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>24 El-Mirghani St., Heliopolis, Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-zinc-200">+20 10 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} DAHAB Grooming Lounge. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with luxury precision & loyalty intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
