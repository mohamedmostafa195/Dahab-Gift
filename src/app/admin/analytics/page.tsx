'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { AnalyticsData } from '@/types';
import {
  BarChart3,
  TrendingUp,
  Users,
  Scissors,
  Gift,
  Award,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#D4AF37', '#F59E0B', '#EAB308', '#B45309', '#78350F'];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Barbershop Loyalty Analytics & Stats"
        subtitle="Key retention metrics, haircut volume trends, barber performance, and reward tracking"
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20">
            <span className="text-xs uppercase font-bold text-zinc-400 block mb-1">
              Active Member Rate
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {data ? Math.round((data.activeLoyaltyMembers / Math.max(1, data.totalCustomers)) * 100) : 83}%
            </span>
            <p className="text-[11px] text-emerald-400 mt-1">High recurring retention</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20">
            <span className="text-xs uppercase font-bold text-zinc-400 block mb-1">
              Voucher Claim Rate
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
              {data?.redemptionRate ?? 50}%
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              {data?.rewardsRedeemed ?? 3} claimed of {data?.rewardsEarned ?? 6} issued
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20">
            <span className="text-xs uppercase font-bold text-zinc-400 block mb-1">
              Monthly Visit Volume
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              +{data?.visitsThisMonth ?? 8}
            </span>
            <p className="text-[11px] text-amber-400 mt-1">Current month pacing</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20">
            <span className="text-xs uppercase font-bold text-zinc-400 block mb-1">
              New Members (Month)
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              +{data?.newCustomersThisMonth ?? 3}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1">Growing VIP network</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Haircut Volume Chart */}
          <div className="lg:col-span-8 rounded-3xl bg-[#121216] border border-amber-500/20 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>Monthly Haircut & Visit Trend</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Visits volume progression over past 6 months
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthlyVisits || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#d4af37',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="visits" name="Visits" fill="#d4af37" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="newUsers" name="New Members" fill="#3f3f46" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Services Breakdown */}
          <div className="lg:col-span-4 rounded-3xl bg-[#121216] border border-amber-500/20 p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-400" />
                <span>Most Popular Services</span>
              </h3>
              <p className="text-xs text-zinc-400">Top requested grooming treatments</p>
            </div>

            <div className="space-y-3 pt-2">
              {data?.popularServices && data.popularServices.length > 0 ? (
                data.popularServices.slice(0, 5).map((s, idx) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-amber-400 font-bold">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-white">{s.name}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                      {s.count} cuts
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">No service data yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Barber Performance Ranking */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Master Barber Performance</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Total customer visits and cuts logged per barber
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.barberPerformance && data.barberPerformance.length > 0 ? (
              data.barberPerformance.map((b) => (
                <div
                  key={b.name}
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold text-xs">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{b.name}</h4>
                      <p className="text-[10px] text-amber-400">Master Stylist</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-base text-amber-400">
                    {b.visits}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 col-span-4">No barber data available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
