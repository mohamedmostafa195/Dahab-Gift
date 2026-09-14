'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StampPunchCard from '@/components/customer/StampPunchCard';
import MemberQRCodeModal from '@/components/customer/MemberQRCodeModal';
import RewardCard from '@/components/customer/RewardCard';
import VisitTimeline from '@/components/customer/VisitTimeline';
import { Customer, Visit, Reward, LoyaltyRule } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslations } from '@/lib/translations';
import {
  Scissors,
  QrCode,
  Sparkles,
  Gift,
  Calendar,
  LogOut,
  User,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { language, setLanguage, isArabic } = useLanguage();
  const t = getTranslations(language).customer;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rule, setRule] = useState<LoyaltyRule | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeRewards, setActiveRewards] = useState<Reward[]>([]);
  const [pastRewards, setPastRewards] = useState<Reward[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const phone = localStorage.getItem('dahab_customer_phone');
      const customerId = localStorage.getItem('dahab_customer_id');
      const cachedDataRaw = localStorage.getItem('dahab_customer_data');

      if (!phone && !customerId && !cachedDataRaw) {
        router.push('/customer/login');
        return;
      }

      let cachedCustomer: Customer | null = null;
      if (cachedDataRaw) {
        try {
          cachedCustomer = JSON.parse(cachedDataRaw);
        } catch (e) {}
      }

      const lookupPhone = phone || cachedCustomer?.phoneNumber;
      const lookupId = customerId || cachedCustomer?.id;

      const queryParam = lookupPhone
        ? `phone=${encodeURIComponent(lookupPhone)}`
        : `customerId=${encodeURIComponent(lookupId!)}`;

      let res = await fetch(`/api/customer/me?${queryParam}`);
      let data = await res.json();

      // If server doesn't have customer (e.g. serverless cold start instance without cloud sync),
      // self-heal and re-provision using client-cached customer record
      if (!res.ok && cachedCustomer) {
        try {
          const syncRes = await fetch('/api/customer/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer: cachedCustomer }),
          });
          if (syncRes.ok) {
            res = await fetch(`/api/customer/me?${queryParam}`);
            data = await res.json();
          }
        } catch (syncErr) {
          console.error('Self-healing sync error:', syncErr);
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load profile');
      }

      setCustomer(data.customer);
      setRule(data.rule);
      setVisits(data.visits || []);
      setActiveRewards(data.activeRewards || []);
      setPastRewards(data.pastRewards || []);

      if (data.customer) {
        localStorage.setItem('dahab_customer_phone', data.customer.phoneNumber);
        localStorage.setItem('dahab_customer_id', data.customer.id);
        localStorage.setItem('dahab_customer_name', data.customer.fullName);
        localStorage.setItem('dahab_customer_data', JSON.stringify(data.customer));
      }
    } catch (err) {
      console.error('Error fetching customer profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dahab_customer_phone');
    localStorage.removeItem('dahab_customer_id');
    localStorage.removeItem('dahab_customer_name');
    localStorage.removeItem('dahab_customer_data');
    router.push('/customer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center animate-spin mb-4 border border-amber-400/30">
          <Scissors className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-zinc-300">{t.loadingPass}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-6 text-center">
        <Scissors className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{t.noProfileTitle}</h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6">
          {t.noProfileDesc}
        </p>
        <Link href="/customer/login" className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold">
          {t.signInNow}
        </Link>
      </div>
    );
  }

  const targetVisits = rule?.targetVisits || 5;
  const hasRewardReady = customer.currentVisits >= targetVisits || activeRewards.length > 0;
  const displayTier = t.tiers[customer.tier.toUpperCase() as keyof typeof t.tiers] || customer.tier;
  const remainingHaircuts = Math.max(0, targetVisits - customer.currentVisits);

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="bg-[#0f0f13]/90 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block">{t.brand}</span>
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold block -mt-1">
                {t.vipPass}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                  language === 'ar'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="العربية"
              >
                AR
              </button>
            </div>

            <button
              onClick={() => setQrModalOpen(true)}
              className="gold-btn flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">{t.show}</span> {t.showQrPass}
            </button>

            <button
              onClick={() => {
                if (confirm(t.signOutConfirm)) {
                  handleLogout();
                }
              }}
              title={t.signOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{t.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Customer Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#121216] border border-amber-500/25 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-600/10 to-zinc-900 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xl font-serif font-black shrink-0">
              {customer.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                  {displayTier}
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {customer.memberCode}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {t.welcomeBack} {customer.fullName}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">{customer.phoneNumber}</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 sm:border-zinc-800 ${isArabic ? 'sm:border-r sm:pr-6 sm:pl-0' : 'sm:border-l sm:pl-6 sm:pr-0'} pt-3 sm:pt-0 border-t border-zinc-800/80 sm:border-t-0`}>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                {t.lifetimeVisits}
              </span>
              <span className="text-xl font-mono font-bold text-white">
                {customer.lifetimeVisits}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                {t.totalRewards}
              </span>
              <span className="text-xl font-mono font-bold text-amber-400">
                {activeRewards.length + pastRewards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Digital Stamp Punch Card */}
        <div>
          <StampPunchCard
            currentVisits={customer.currentVisits}
            targetVisits={targetVisits}
            currentCycle={customer.currentCycle}
            rewardTitle={rule?.rewardTitle || 'Free Signature Haircut'}
            customerName={customer.fullName}
            tier={customer.tier}
            hasUnclaimedReward={hasRewardReady}
          />
        </div>

        {/* Active Rewards Alert if Ready */}
        {activeRewards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span>{t.availableRewards} ({activeRewards.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs: Reward Wallet & Visit History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('rewards')}
                className={`text-sm font-serif font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                  activeTab === 'rewards'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.rewardWallet} ({activeRewards.length + pastRewards.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`text-sm font-serif font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                  activeTab === 'history'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.visitHistory} ({visits.length})
              </button>
            </div>

            <button
              onClick={fetchProfile}
              title={t.refresh}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.refresh}</span>
            </button>
          </div>

          {activeTab === 'rewards' ? (
            <div className="space-y-4">
              {activeRewards.length === 0 && pastRewards.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
                  <Gift className="w-8 h-8 mx-auto text-zinc-600 mb-2 opacity-60" />
                  <p className="text-sm text-zinc-400">{t.noRewardsYet}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {t.noRewardsDesc.replace('{count}', String(remainingHaircuts))}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                  {pastRewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <VisitTimeline visits={visits} />
          )}
        </div>
      </main>

      {/* Member QR Code Modal */}
      <MemberQRCodeModal
        memberCode={customer.memberCode}
        customerName={customer.fullName}
        phoneNumber={customer.phoneNumber}
        tier={customer.tier}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
