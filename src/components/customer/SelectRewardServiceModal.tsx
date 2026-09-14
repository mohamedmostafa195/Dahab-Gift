'use client';

import React, { useState } from 'react';
import { Reward, ServiceItem } from '@/types';
import {
  X,
  Sparkles,
  Gift,
  CheckCircle2,
  Clock,
  Scissors,
  Flame,
  ShieldCheck,
  Loader2,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SelectRewardServiceModalProps {
  reward: Reward;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedReward: Reward) => void;
  availableServices?: ServiceItem[];
}

const DEFAULT_REWARD_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Dahab Signature Haircut',
    category: 'HAIRCUT',
    duration: '40 min',
    price: 350,
    description: 'Precision cut, neck shave, invigorating wash, and styling with premium pomade.',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Haircut + Royal Beard Sculpt',
    category: 'PACKAGE',
    duration: '60 min',
    price: 550,
    description: 'Signature haircut combined with hot towel steam beard trim and razor outline.',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Royal Beard Sculpt & Hot Towel',
    category: 'BEARD',
    duration: '30 min',
    price: 250,
    description: 'Hot lather steam, straight razor edge lining, organic beard oil treatment.',
    popular: false,
  },
  {
    id: 'srv-4',
    name: 'Dahab VIP Ritual Experience',
    category: 'PACKAGE',
    duration: '80 min',
    price: 850,
    description: 'Haircut, beard sculpt, deep purifying charcoal facial, eye mask, and espresso.',
    popular: true,
  },
  {
    id: 'srv-5',
    name: 'Charcoal Face Detox & Scrub',
    category: 'TREATMENT',
    duration: '25 min',
    price: 220,
    description: 'Exfoliating black mask, steam extraction, and refreshing botanical toner.',
    popular: false,
  },
];

export default function SelectRewardServiceModal({
  reward,
  isOpen,
  onClose,
  onSuccess,
  availableServices,
}: SelectRewardServiceModalProps) {
  const { language, isArabic } = useLanguage();
  const services = (availableServices && availableServices.length > 0) ? availableServices : DEFAULT_REWARD_SERVICES;

  const [selectedService, setSelectedService] = useState<ServiceItem>(
    services.find((s) => s.name === reward.selectedService) || services[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedService) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/customer/reward-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardId: reward.id,
          voucherCode: reward.voucherCode,
          selectedService: selectedService.name,
          selectedServicePrice: selectedService.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit selection');
      }

      onSuccess(data.reward);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error selecting service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl shadow-amber-950/40 overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 border-b border-zinc-800/90 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {isArabic ? 'اختر مكافأتك' : 'SELECT YOUR REWARD'}
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  #{reward.voucherCode}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                {isArabic ? 'اختر الخدمة المجانية المفضلة لك' : 'Choose Your Complimentary Service'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isArabic
                  ? 'اختر من القائمة الخدمة التي ترغب بها، وسيتم إرسال طلبك لإدارة الصالون للاعتماد الفوري.'
                  : 'Select any service below to claim with your reward voucher. The salon staff will approve it upon your arrival.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Modal Body: Services List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 max-h-[55vh]">
          {services.map((srv) => {
            const isSelected = selectedService?.name === srv.name;
            return (
              <div
                key={srv.id || srv.name}
                onClick={() => setSelectedService(srv)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/15 via-[#1d1b18] to-zinc-900 border-amber-400 shadow-lg shadow-amber-950/30 scale-[1.01]'
                    : 'bg-zinc-900/70 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 font-black'
                        : 'border-zinc-700 bg-zinc-800 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-white">
                        {srv.name}
                      </h4>
                      {srv.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {isArabic ? 'شائع ومفضل' : 'Popular'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {srv.duration}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        {isArabic ? 'مشمول بالكامل مجاناً' : '100% Free with Reward'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                  <span className="text-xs text-zinc-500 line-through">
                    {srv.price} EGP
                  </span>
                  <span className="text-sm font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                    FREE (0 EGP)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-zinc-800/90 bg-[#0e0e12] flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 truncate">
            {isArabic ? 'الخدمة المختارة: ' : 'Selected: '}
            <strong className="text-amber-400">{selectedService?.name}</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || !selectedService}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isArabic ? 'جاري الإرسال...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isArabic ? 'تأكيد وإرسال للصالون' : 'Confirm Choice'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
