'use client';

import React, { useState } from 'react';
import { Customer, Barber, ServiceItem, Reward } from '@/types';
import { X, Plus, Scissors, UserCheck, DollarSign, Sparkles, Loader2 } from 'lucide-react';

interface QuickVisitModalProps {
  customer: Customer;
  targetVisits: number;
  barbers: Barber[];
  services: ServiceItem[];
  isOpen: boolean;
  onClose: () => void;
  onVisitAdded: (data: { customer: Customer; rewardEarned?: Reward; isRewardUnlocked: boolean }) => void;
}

export default function QuickVisitModal({
  customer,
  targetVisits = 5,
  barbers = [],
  services = [],
  isOpen,
  onClose,
  onVisitAdded,
}: QuickVisitModalProps) {
  const [selectedService, setSelectedService] = useState<string>(
    services[0]?.name || 'Dahab Signature Haircut'
  );
  const [selectedBarber, setSelectedBarber] = useState<string>(
    barbers[0]?.name || 'Tarek "The Master" El-Sayed'
  );
  const [price, setPrice] = useState<number>(services[0]?.price || 350);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const isAlreadyAtMax = customer.currentVisits >= targetVisits;
  const nextVisits = Math.min(targetVisits, customer.currentVisits + 1);
  const willUnlockReward = nextVisits >= targetVisits;

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    const srv = services.find((s) => s.name === serviceName);
    if (srv) {
      setPrice(srv.price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyAtMax) {
      setError(`Customer has already completed ${targetVisits}/${targetVisits} stamps! Please redeem the reward voucher first.`);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          customerPhone: customer.phoneNumber,
          customerName: customer.fullName,
          memberCode: customer.memberCode,
          currentVisits: customer.currentVisits,
          lifetimeVisits: customer.lifetimeVisits,
          currentCycle: customer.currentCycle,
          tier: customer.tier,
          serviceName: selectedService,
          barberName: selectedBarber,
          price,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add visit');
      }

      onVisitAdded(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error recording visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-7 shadow-2xl shadow-amber-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
              Quick Log Visit
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              {customer.fullName}
            </h3>
          </div>
        </div>

        {/* Current Loyalty Stamp Preview */}
        <div
          className={`rounded-2xl p-4 mb-5 border transition-all ${
            willUnlockReward
              ? 'bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-zinc-900 border-amber-400/60 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Stamp Progression</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-zinc-400">
                  {customer.currentVisits}/{targetVisits}
                </span>
                <span className="text-sm font-bold text-amber-400">
                  ➔ {nextVisits}/{targetVisits}
                </span>
              </div>
            </div>

            {willUnlockReward ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-zinc-950 text-xs font-black animate-pulse">
                <Sparkles className="w-4 h-4" />
                Will Unlock Reward!
              </div>
            ) : (
              <span className="text-xs text-zinc-400">
                {targetVisits - nextVisits} stamps remaining
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
              Service Provided
            </label>
            <select
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} — {s.price} EGP
                </option>
              ))}
              <option value="Custom Haircut & Styling">Custom Haircut & Styling</option>
              <option value="Complimentary Reward Service">Complimentary Reward Service</option>
            </select>
          </div>

          {/* Barber Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
              Barber / Stylist
            </label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.role})
                </option>
              ))}
            </select>
          </div>

          {/* Price & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Amount (EGP)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="350"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Skin taper, low fade"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isAlreadyAtMax}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg transition ${
                isAlreadyAtMax
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'gold-btn'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording...
                </>
              ) : isAlreadyAtMax ? (
                <span>5/5 Completed (Redeem Voucher First)</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  +1 Add Haircut
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
