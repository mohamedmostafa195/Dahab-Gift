'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Reward, Customer } from '@/types';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: Reward;
  customer?: Customer;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  reward,
  customer,
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti blasts
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F59E0B', '#FFFFFF', '#EAB308', '#B45309'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#D4AF37', '#FFF'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D4AF37', '#F59E0B'],
        });
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#221e14] via-[#141419] to-[#0c0c0e] border-2 border-amber-400 p-6 sm:p-8 text-center shadow-2xl shadow-amber-900/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Animated Gift Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 mb-5 shadow-lg shadow-amber-400/40 animate-bounce">
          <Gift className="w-10 h-10" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-200 animate-spin" />
        </div>

        <span className="text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 inline-block mb-2">
          LOYALTY TARGET COMPLETED!
        </span>

        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mb-2">
          Congratulations!
        </h2>
        <p className="text-sm text-zinc-300 mb-6">
          <strong className="text-amber-300">{customer?.fullName || 'Customer'}</strong> has completed all required visits and unlocked a complimentary reward!
        </p>

        {/* Voucher Preview Box */}
        <div className="bg-zinc-900/90 rounded-2xl border border-amber-400/40 p-5 mb-6 text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Earned Reward
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Cycle #{reward.cycleNumber}
            </span>
          </div>

          <h3 className="text-lg font-serif font-bold text-white mb-1">
            {reward.title}
          </h3>
          <p className="text-xs text-zinc-400 mb-4">{reward.description}</p>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">VOUCHER CODE</span>
            <span className="font-mono text-base font-black text-amber-400 tracking-wider">
              {reward.voucherCode}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 hover:brightness-110 text-zinc-950 font-black text-sm tracking-wide shadow-lg shadow-amber-400/30 transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Awesome! Continue to Profile
        </button>
      </div>
    </div>
  );
}
