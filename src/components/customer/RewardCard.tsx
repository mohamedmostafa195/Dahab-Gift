'use client';

import React, { useState } from 'react';
import { Reward } from '@/types';
import { Gift, Check, Copy, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  onRedeemClick?: () => void;
  isAdmin?: boolean;
}

export default function RewardCard({ reward, onRedeemClick, isAdmin = false }: RewardCardProps) {
  const [copied, setCopied] = useState(false);
  const isAvailable = reward.status === 'AVAILABLE';

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isAvailable
          ? 'bg-gradient-to-br from-[#242116] via-[#16161b] to-[#0e0e11] border-amber-400/40 shadow-xl shadow-amber-950/20'
          : 'bg-zinc-900/60 border-zinc-800/80 opacity-75'
      }`}
    >
      {/* Top Tag & Cycle */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isAvailable
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {isAvailable ? '★ Ready to Claim' : 'Redeemed'}
            </span>
            <span className="text-xs text-zinc-400">Cycle #{reward.cycleNumber}</span>
          </div>

          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(reward.earnedAt)}
          </span>
        </div>

        {/* Reward Title */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isAvailable
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
              {reward.title}
            </h4>
            <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
              {reward.description}
            </p>
          </div>
        </div>

        {/* Voucher Code Box */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              Voucher Code
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-amber-300 tracking-wider">
              {reward.voucherCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy Voucher Code"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {isAdmin && isAvailable && onRedeemClick && (
              <button
                onClick={onRedeemClick}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition flex items-center gap-1 shadow-md shadow-amber-400/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Redeem
              </button>
            )}
          </div>
        </div>

        {/* Redeemed Info */}
        {!isAvailable && reward.redeemedAt && (
          <div className="mt-3 text-[11px] text-zinc-400 italic">
            Redeemed on {formatDate(reward.redeemedAt)}
            {reward.redeemedBy ? ` by ${reward.redeemedBy}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}
