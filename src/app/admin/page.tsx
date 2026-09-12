'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import QuickVisitModal from '@/components/admin/QuickVisitModal';
import CelebrationModal from '@/components/admin/CelebrationModal';
import CameraQRScanner from '@/components/admin/CameraQRScanner';
import {
  Customer,
  Visit,
  Reward,
  LoyaltyRule,
  Barber,
  ServiceItem,
  AnalyticsData,
} from '@/types';
import {
  Users,
  Scissors,
  Gift,
  QrCode,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rule, setRule] = useState<LoyaltyRule | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerForVisit, setSelectedCustomerForVisit] = useState<Customer | null>(null);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    reward?: Reward;
    customer?: Customer;
  }>({ isOpen: false });
  const [quickVisitModalOpen, setQuickVisitModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, customersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/settings'),
      ]);

      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (customersRes.ok) {
        const custData = await customersRes.json();
        setCustomers(custData.customers || []);
      }
      if (settingsRes.ok) {
        const setData = await settingsRes.json();
        setRule(setData.rule);
        setBarbers(setData.barbers || []);
        setServices(setData.services || []);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  const handleQuickAddVisit = (customer: Customer) => {
    setSelectedCustomerForVisit(customer);
    setQuickVisitModalOpen(true);
  };

  const handleVisitAdded = (data: {
    customer: Customer;
    rewardEarned?: Reward;
    isRewardUnlocked: boolean;
  }) => {
    // Refresh data
    loadDashboardData();

    if (data.isRewardUnlocked && data.rewardEarned) {
      setCelebrationData({
        isOpen: true,
        reward: data.rewardEarned,
        customer: data.customer,
      });
    } else {
      setActionSuccessMsg(`+1 Haircut added for ${data.customer.fullName}!`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  const handleRedeemReward = async (customer: Customer) => {
    try {
      // Find unredeemed reward
      const res = await fetch(`/api/admin/rewards?customerId=${customer.id}&status=AVAILABLE`);
      const data = await res.json();
      if (!res.ok || !data.rewards || data.rewards.length === 0) {
        alert('No active available rewards found for this customer.');
        return;
      }

      const reward = data.rewards[0];
      const redeemRes = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardIdOrCode: reward.id, redeemedBy: 'Master Barber' }),
      });

      if (redeemRes.ok) {
        setActionSuccessMsg(`Reward "${reward.title}" redeemed for ${customer.fullName}! Cycle reset.`);
        loadDashboardData();
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Error redeeming reward');
    }
  };

  const targetVisits = rule?.targetVisits || 5;

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery) ||
      c.memberCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerFoundFromScan = async (identifier: string) => {
    setScannerModalOpen(false);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(identifier)}`);
      const data = await res.json();
      if (res.ok && data.customer) {
        setSelectedCustomerForVisit(data.customer);
        setQuickVisitModalOpen(true);
      } else {
        alert(data.error || 'Customer not found with this QR code');
      }
    } catch (e: any) {
      alert(e.message || 'Customer lookup error');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Dashboard & Quick Check-In"
        subtitle="Barbershop operations, live loyalty punch logger, and member management"
        onSearch={(q) => setSearchQuery(q)}
        onOpenScanner={() => setScannerModalOpen(true)}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* Success toast notification */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-600/15 to-zinc-900 border border-emerald-400/40 text-emerald-200 text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Top KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Customers */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Total Customers</span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {analytics?.totalCustomers ?? customers.length}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1">
                +{analytics?.newCustomersThisMonth ?? 0} new this month
              </p>
            </div>
          </div>

          {/* Total Visits */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Total Haircuts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Scissors className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {analytics?.totalVisits ?? 0}
              </span>
              <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
                {analytics?.visitsThisMonth ?? 0} visits this month
              </p>
            </div>
          </div>

          {/* Rewards Redeemed */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Rewards Claimed</span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                {analytics?.rewardsRedeemed ?? 0}{' '}
                <span className="text-zinc-500 text-sm font-sans font-normal">
                  / {analytics?.rewardsEarned ?? 0}
                </span>
              </span>
              <p className="text-[11px] text-zinc-500 mt-1">
                {analytics?.redemptionRate ?? 0}% redemption rate
              </p>
            </div>
          </div>

          {/* Active Members */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Active Members</span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {analytics?.activeLoyaltyMembers ?? 0}
              </span>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Actively collecting stamps
              </p>
            </div>
          </div>
        </div>

        {/* Quick Check-In / Search Customer Section */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/25 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-400" />
                <span>Quick Customer Check-In & Stamp Logger</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Search customer by phone number to add +1 haircut stamp in 1 click
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/scanner"
                className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <QrCode className="w-4 h-4" />
                <span>Open Camera Scanner</span>
              </Link>
            </div>
          </div>

          {/* Customer Fast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => {
              const isRewardReady = c.currentVisits >= targetVisits;
              const percent = Math.min(100, Math.round((c.currentVisits / targetVisits) * 100));

              return (
                <div
                  key={c.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isRewardReady
                      ? 'bg-gradient-to-br from-amber-500/15 via-[#18181e] to-[#101014] border-amber-400/50 shadow-lg shadow-amber-950/20'
                      : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {c.tier}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-400">
                            {c.memberCode}
                          </span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-white">
                          {c.fullName}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">{c.phoneNumber}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold font-mono text-amber-400 block">
                          {c.currentVisits}/{targetVisits}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Cycle #{c.currentCycle}
                        </span>
                      </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden my-3">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Reward Ready Alert */}
                    {isRewardReady && (
                      <div className="p-2 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 mb-3">
                        <Gift className="w-4 h-4 text-amber-300" />
                        <span>5/5 Completed! Ready for Free Haircut</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/customers?id=${c.id}`}
                      className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {isRewardReady && (
                        <button
                          onClick={() => handleRedeemReward(c)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition flex items-center gap-1 shadow-sm"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          Redeem
                        </button>
                      )}

                      <button
                        onClick={() => handleQuickAddVisit(c)}
                        className="gold-btn px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        +1 Haircut
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Visits Activity Feed */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/25 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Live Barbershop Visits Stream</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Real-time log of customer haircuts and services provided
              </p>
            </div>

            <Link
              href="/admin/visits"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View All Visits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentVisits && analytics.recentVisits.length > 0 ? (
              analytics.recentVisits.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {v.customerName}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {v.serviceName} • Barber: <span className="text-zinc-300">{v.barberName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-zinc-400">
                    <span className="font-mono text-amber-400/90 font-bold">
                      {v.price === 0 ? 'FREE REWARD' : `${v.price} EGP`}
                    </span>
                    <span>
                      {new Date(v.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 text-center py-6">No visits recorded yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Quick Add Visit Modal */}
      {selectedCustomerForVisit && (
        <QuickVisitModal
          customer={selectedCustomerForVisit}
          targetVisits={targetVisits}
          barbers={barbers}
          services={services}
          isOpen={quickVisitModalOpen}
          onClose={() => {
            setQuickVisitModalOpen(false);
            setSelectedCustomerForVisit(null);
          }}
          onVisitAdded={handleVisitAdded}
        />
      )}

      {/* Celebration 5/5 Modal */}
      <CelebrationModal
        isOpen={celebrationData.isOpen}
        reward={celebrationData.reward}
        customer={celebrationData.customer}
        onClose={() => setCelebrationData({ isOpen: false })}
      />

      {/* QR Camera Scanner Modal */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div className="w-full max-w-lg">
            <CameraQRScanner
              onCustomerFound={handleCustomerFoundFromScan}
              onClose={() => setScannerModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
