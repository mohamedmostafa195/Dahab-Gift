'use client';

import React, { useState } from 'react';
import { Reward, ServiceItem } from '@/types';
import {
  Gift,
  Check,
  Copy,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Scissors,
  Hourglass,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslations } from '@/lib/translations';
import SelectRewardServiceModal from './SelectRewardServiceModal';

interface RewardCardProps {
  reward: Reward;
  onRedeemClick?: () => void;
  onRejectClick?: () => void;
  onRewardUpdated?: (updated: Reward) => void;
  isAdmin?: boolean;
  availableServices?: ServiceItem[];
}

export default function RewardCard({
  reward: initialReward,
  onRedeemClick,
  onRejectClick,
  onRewardUpdated,
  isAdmin = false,
  availableServices,
}: RewardCardProps) {
  const [reward, setReward] = useState<Reward>(initialReward);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, isArabic } = useLanguage();
  const t = getTranslations(language).customer;

  // Keep state in sync if prop changes
  React.useEffect(() => {
    setReward(initialReward);
  }, [initialReward]);

  const isPending = reward.status === 'PENDING_APPROVAL';
  const isAvailable = reward.status === 'AVAILABLE';
  const isRedeemed = reward.status === 'REDEEMED';
  const isRejected = reward.status === 'REJECTED';

  const canSelectService = (isAvailable || isPending || isRejected) && !isAdmin;

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModalSuccess = (updatedReward: Reward) => {
    setReward(updatedReward);
    if (onRewardUpdated) {
      onRewardUpdated(updatedReward);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const displayTitle =
    reward.title === 'Free Signature Haircut' ? t.defaultRewardTitle : reward.title;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isPending
            ? 'bg-gradient-to-br from-[#241f14] via-[#1a181b] to-[#100f13] border-amber-400/60 shadow-xl shadow-amber-950/30 ring-1 ring-amber-400/30'
            : isAvailable
            ? 'bg-gradient-to-br from-[#242116] via-[#16161b] to-[#0e0e11] border-amber-400/40 shadow-xl shadow-amber-950/20'
            : isRejected
            ? 'bg-gradient-to-br from-[#221316] via-[#181215] to-[#0e0d10] border-rose-500/40 shadow-lg'
            : 'bg-zinc-900/60 border-zinc-800/80 opacity-75'
        }`}
      >
        {/* Top Glow on pending or available */}
        {(isPending || isAvailable) && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        )}

        {/* Card Header */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isPending
                    ? 'bg-amber-400 text-zinc-950 animate-pulse shadow-sm shadow-amber-400/30'
                    : isAvailable
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : isRejected
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {isPending && <Hourglass className="w-3 h-3 animate-spin" />}
                {isPending
                  ? isArabic
                    ? 'قيد الاعتماد من الصالون'
                    : 'PENDING APPROVAL'
                  : isAvailable
                  ? t.readyToClaim
                  : isRejected
                  ? isArabic
                    ? 'تم رفض الاختيار'
                    : 'DECLINED'
                  : t.redeemed}
              </span>

              <span className="text-xs text-zinc-400 font-semibold">
                {t.cycle} #{reward.cycleNumber}
              </span>
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
                isPending || isAvailable
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-sm'
                  : isRejected
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
                {displayTitle}
              </h4>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                {reward.description}
              </p>
            </div>
          </div>

          {/* Selected Service Banner */}
          {reward.selectedService && (
            <div
              className={`mb-3 p-3 rounded-xl border flex items-center justify-between gap-2 ${
                isPending
                  ? 'bg-amber-500/10 border-amber-400/40 text-amber-200'
                  : isRedeemed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate text-xs">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                    {isArabic ? 'الخدمة المختارة' : 'Chosen Free Service'}:
                  </span>
                  <strong className="text-white font-serif">{reward.selectedService}</strong>
                  {reward.selectedServicePrice ? (
                    <span className="text-amber-400 text-[11px] ml-1.5 font-bold font-mono">
                      ({reward.selectedServicePrice} EGP Value)
                    </span>
                  ) : null}
                </div>
              </div>

              {canSelectService && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
                >
                  {isArabic ? 'تغيير' : 'Change'}
                </button>
              )}
            </div>
          )}

          {/* Rejection notice */}
          {isRejected && reward.rejectionReason && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{reward.rejectionReason}</span>
            </div>
          )}

          {/* Voucher Code Box & Action Buttons */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                {t.voucherCode}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-amber-300 tracking-wider">
                {reward.voucherCode}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Voucher Code"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition flex items-center gap-1.5 border border-zinc-700/60"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px] font-bold">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[11px] font-semibold">{t.copy}</span>
                  </>
                )}
              </button>

              {/* Customer: Select Service Button (Next to Copy) */}
              {canSelectService && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                    isPending
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40'
                      : 'gold-btn shadow-amber-500/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {reward.selectedService
                      ? isArabic
                        ? 'تعديل الخدمة'
                        : 'Change Service'
                      : isArabic
                      ? 'اختيار الخدمة'
                      : 'Select Service'}
                  </span>
                </button>
              )}

              {/* Admin Actions: Approve / Reject */}
              {isAdmin && (isAvailable || isPending) && (
                <div className="flex items-center gap-1.5">
                  {onRejectClick && (
                    <button
                      type="button"
                      onClick={onRejectClick}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reject</span>
                    </button>
                  )}

                  {onRedeemClick && (
                    <button
                      type="button"
                      onClick={onRedeemClick}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-400/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isPending ? 'Approve' : 'Redeem'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Redeemed Info */}
          {!isAvailable && !isPending && reward.redeemedAt && (
            <div className="mt-3 text-[11px] text-zinc-400 italic flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {t.redeemedOn} {formatDate(reward.redeemedAt)}
                {reward.redeemedBy ? ` ${t.by} ${reward.redeemedBy}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Choice Modal */}
      {isModalOpen && (
        <SelectRewardServiceModal
          reward={reward}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          availableServices={availableServices}
        />
      )}
    </>
  );
}
