'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import RewardCard from '@/components/customer/RewardCard';
import { Reward } from '@/types';
import {
  Gift,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'REDEEMED'>('ALL');
  const [voucherInput, setVoucherInput] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, [statusFilter]);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'ALL'
          ? '/api/admin/rewards'
          : `/api/admin/rewards?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setRewards(data.rewards || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemVoucher = async (codeOrId: string) => {
    setRedeemError(null);
    setRedeemSuccess(null);
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardIdOrCode: codeOrId,
          redeemedBy: 'Master Barber Tarek',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to redeem voucher');
      }

      setRedeemSuccess(
        `Voucher redeemed successfully! Customer has been advanced to Cycle #${data.customer?.currentCycle} with 0/5 stamps.`
      );
      setVoucherInput('');
      fetchRewards();
    } catch (err: any) {
      setRedeemError(err.message || 'Redemption error');
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.voucherCode.toLowerCase().includes(q) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerPhone && r.customerPhone.includes(q)) ||
      r.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Loyalty Rewards & Voucher Redemption"
        subtitle="Verify customer vouchers, claim complimentary haircuts, and manage redemptions"
        onSearch={(q) => setSearchQuery(q)}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* Quick Voucher Code Redemption Desk */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1b1812] via-[#121217] to-[#0d0d10] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-black tracking-widest text-amber-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              Cashier Redemption Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
              Redeem Member Voucher Code
            </h2>
            <p className="text-xs text-zinc-300 mb-5">
              Enter customer’s voucher code (e.g. <code>DHB-RWD-7782</code>) to mark reward as redeemed and kick off their next loyalty cycle.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (voucherInput.trim()) handleRedeemVoucher(voucherInput.trim());
              }}
              className="flex gap-2.5 max-w-md"
            >
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="Enter Voucher Code (e.g. DHB-RWD-7782)"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-wider uppercase"
              />
              <button
                type="submit"
                className="gold-btn px-6 py-3 rounded-xl font-black text-xs tracking-wider uppercase shrink-0 shadow-lg shadow-amber-500/20"
              >
                Redeem
              </button>
            </form>

            {redeemSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{redeemSuccess}</span>
              </div>
            )}

            {redeemError && (
              <div className="mt-4 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {redeemError}
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Vouchers' },
              { id: 'AVAILABLE', label: '★ Unredeemed / Ready' },
              { id: 'REDEEMED', label: 'Past Claimed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            Total <strong>{filteredRewards.length}</strong> vouchers
          </span>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="relative">
              {reward.customerName && (
                <div className="text-xs text-zinc-400 mb-1.5 flex items-center justify-between px-1">
                  <span>Member: <strong className="text-white">{reward.customerName}</strong></span>
                  <span className="font-mono text-zinc-500">{reward.customerPhone}</span>
                </div>
              )}
              <RewardCard
                reward={reward}
                isAdmin={true}
                onRedeemClick={() => handleRedeemVoucher(reward.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
