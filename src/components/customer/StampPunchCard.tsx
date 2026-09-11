'use client';

import React from 'react';
import { Scissors, Sparkles, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StampPunchCardProps {
  currentVisits: number;
  targetVisits: number;
  currentCycle: number;
  rewardTitle: string;
  customerName: string;
  tier: string;
  hasUnclaimedReward?: boolean;
}

export default function StampPunchCard({
  currentVisits,
  targetVisits = 5,
  currentCycle = 1,
  rewardTitle = 'Free Signature Haircut',
  customerName,
  tier = 'GOLD',
  hasUnclaimedReward = false,
}: StampPunchCardProps) {
  const remaining = Math.max(0, targetVisits - currentVisits);
  const percent = Math.min(100, Math.round((currentVisits / targetVisits) * 100));
  const isGoalReached = currentVisits >= targetVisits || hasUnclaimedReward;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F59E0B', '#FFF', '#EAB308'],
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1c1b17] via-[#131316] to-[#0d0d10] border border-amber-500/30 p-6 md:p-8 shadow-2xl shadow-amber-950/20">
      {/* Background ambient glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {tier} MEMBER
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Cycle #{currentCycle}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {customerName}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Haircuts Completed</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
              {currentVisits} <span className="text-zinc-600 text-lg sm:text-xl">/ {targetVisits}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stamp Punch Grid */}
      <div className="my-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
          <span>Digital Stamp Card</span>
          <span className="text-amber-400">{percent}% Complete</span>
        </div>

        <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
          {Array.from({ length: targetVisits }).map((_, index) => {
            const stampNumber = index + 1;
            const isStamped = stampNumber <= currentVisits;
            const isTargetStamp = stampNumber === targetVisits;

            return (
              <div
                key={stampNumber}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                  isStamped
                    ? 'bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-zinc-900 border-2 border-amber-400/80 shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900/60 border border-zinc-800 text-zinc-600 hover:border-zinc-700'
                }`}
              >
                {/* Stamped State */}
                {isStamped ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 mb-1 border border-amber-400/40">
                      {isTargetStamp ? (
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-bounce" />
                      ) : (
                        <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-300">
                      #{stampNumber}
                    </span>
                  </div>
                ) : (
                  /* Unstamped Slot */
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 mb-1">
                      {isTargetStamp ? (
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/50" />
                      ) : (
                        <span className="text-xs font-mono font-medium">{stampNumber}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {isTargetStamp ? 'Reward' : `Visit ${stampNumber}`}
                    </span>
                  </div>
                )}

                {/* Golden Badge for 5th Stamp */}
                {isTargetStamp && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-md">
                    ★
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800 mt-4 mb-5">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Status & Next Reward Banner */}
      <div
        onClick={isGoalReached ? triggerCelebration : undefined}
        className={`rounded-xl p-4 transition-all ${
          isGoalReached
            ? 'bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/50 cursor-pointer'
            : 'bg-zinc-900/80 border border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isGoalReached
                  ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/30'
                  : 'bg-zinc-800 text-amber-400'
              }`}
            >
              {isGoalReached ? (
                <Gift className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                {isGoalReached ? '🎉 Reward Unlocked!' : 'Next Reward'}
              </p>
              <p className="text-sm sm:text-base font-bold text-white">
                {rewardTitle}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            {isGoalReached ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-400/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to Redeem
              </span>
            ) : (
              <span className="text-xs text-amber-300/90 font-medium">
                <strong className="text-amber-300 font-bold">{remaining}</strong> more haircut{remaining > 1 ? 's' : ''} to go
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
