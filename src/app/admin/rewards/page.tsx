'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  XCircle,
  Hourglass,
  Scissors,
  Check,
  AlertCircle,
} from 'lucide-react';

function RewardsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('search') || searchParams.get('q') || searchParams.get('code') || '';

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [counts, setCounts] = useState({ available: 0, pending: 0, redeemed: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_APPROVAL' | 'AVAILABLE' | 'REDEEMED' | 'REJECTED'>('ALL');
  const [voucherInput, setVoucherInput] = useState(queryParam.toUpperCase().startsWith('DHB-RWD') ? queryParam : '');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      if (queryParam.toUpperCase().startsWith('DHB-RWD')) {
        setVoucherInput(queryParam);
      }
    }
  }, [queryParam]);

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
        setCounts({
          available: data.availableCount || 0,
          pending: data.pendingCount || 0,
          redeemed: data.redeemedCount || 0,
          rejected: data.rejectedCount || 0,
          total: data.total || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVoucher = async (codeOrId: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardIdOrCode: codeOrId,
          redeemedBy: 'Master Barber Tarek',
          action: 'APPROVE',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve voucher');
      }

      setActionSuccess(
        `✓ Reward approved & redeemed successfully! Customer has advanced to Cycle #${data.customer?.currentCycle} (0/5 stamps).`
      );
      setVoucherInput('');
      fetchRewards();
    } catch (err: any) {
      setActionError(err.message || 'Approval error');
    }
  };

  const handleRejectVoucher = async (codeOrId: string) => {
    const reason = window.prompt('Please enter the reason for rejection (optional):', 'Service unavailable at requested time');
    if (reason === null) return; // cancelled

    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardIdOrCode: codeOrId,
          action: 'REJECT',
          rejectionReason: reason || 'Service selection declined by staff. Please choose another service.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject voucher');
      }

      setActionSuccess('Reward request was rejected. Customer has been notified to pick another service.');
      fetchRewards();
    } catch (err: any) {
      setActionError(err.message || 'Rejection error');
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.voucherCode.toLowerCase().includes(q) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerPhone && r.customerPhone.includes(q)) ||
      r.title.toLowerCase().includes(q) ||
      (r.selectedService && r.selectedService.toLowerCase().includes(q))
    );
  });

  const pendingRewards = rewards.filter((r) => r.status === 'PENDING_APPROVAL');

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Loyalty Rewards & Voucher Redemption"
        subtitle="Review customer service choices, approve reward redemptions, and manage cycles"
        onSearch={(q) => setSearchQuery(q)}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* Pending Requests Alert Banner */}
        {counts.pending > 0 && statusFilter !== 'PENDING_APPROVAL' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shrink-0 animate-pulse">
                <Hourglass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  You have {counts.pending} pending reward claim {counts.pending === 1 ? 'request' : 'requests'}!
                </h3>
                <p className="text-xs text-amber-200/80">
                  Customers have picked their free service and are waiting for your approval.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStatusFilter('PENDING_APPROVAL')}
              className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Review Requests ({counts.pending})</span>
            </button>
          </div>
        )}

        {/* Quick Voucher Code Redemption Desk */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1b1812] via-[#121217] to-[#0d0d10] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-black tracking-widest text-amber-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              Cashier Redemption Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
              Redeem & Approve Voucher Code
            </h2>
            <p className="text-xs text-zinc-300 mb-5">
              Enter customer’s voucher code (e.g. <code>DHB-RWD-7782</code>) to approve their selected service and start their next loyalty cycle.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (voucherInput.trim()) handleApproveVoucher(voucherInput.trim());
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
                Approve & Redeem
              </button>
            </form>

            {actionSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="mt-4 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'ALL', label: `All Vouchers (${counts.total})` },
              { id: 'PENDING_APPROVAL', label: `⏳ Pending Requests (${counts.pending})` },
              { id: 'AVAILABLE', label: `★ Ready to Claim (${counts.available})` },
              { id: 'REDEEMED', label: `✓ Past Claimed (${counts.redeemed})` },
              { id: 'REJECTED', label: `✕ Declined (${counts.rejected})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-amber-400 text-zinc-950 font-black shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            Showing <strong>{filteredRewards.length}</strong> vouchers
          </span>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800">
            <Gift className="w-10 h-10 mx-auto text-zinc-600 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-zinc-300">No vouchers found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              {statusFilter === 'PENDING_APPROVAL'
                ? 'There are currently no pending reward requests.'
                : 'No rewards match the selected filter or search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRewards.map((reward) => (
              <div key={reward.id} className="relative flex flex-col space-y-2">
                {reward.customerName && (
                  <div className="text-xs text-zinc-400 flex items-center justify-between px-1">
                    <span>
                      Member: <strong className="text-white">{reward.customerName}</strong>
                    </span>
                    <span className="font-mono text-zinc-500">{reward.customerPhone}</span>
                  </div>
                )}
                <RewardCard
                  reward={reward}
                  isAdmin={true}
                  onRedeemClick={() => handleApproveVoucher(reward.id)}
                  onRejectClick={() => handleRejectVoucher(reward.id)}
                  onRewardUpdated={() => fetchRewards()}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminRewardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading Rewards...</div>}>
      <RewardsContent />
    </Suspense>
  );
}
