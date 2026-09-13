'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { LoyaltyRule } from '@/types';
import {
  Settings,
  Gift,
  CheckCircle2,
  Sparkles,
  Sliders,
  Store,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [rule, setRule] = useState<LoyaltyRule | null>(null);
  const [targetVisits, setTargetVisits] = useState(5);
  const [rewardTitle, setRewardTitle] = useState('Free Signature Haircut');
  const [rewardDesc, setRewardDesc] = useState('Enjoy a complimentary signature haircut on us.');
  const [shopName, setShopName] = useState('DAHAB Grooming Lounge');
  const [phonePrefix, setPhonePrefix] = useState('+20');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.rule) {
        setRule(data.rule);
        setTargetVisits(data.rule.targetVisits);
        setRewardTitle(data.rule.rewardTitle);
        setRewardDesc(data.rule.rewardDesc);
        setShopName(data.rule.shopName || 'DAHAB Grooming Lounge');
        setPhonePrefix(data.rule.phonePrefix || '+20');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetVisits,
          rewardTitle,
          rewardDesc,
          shopName,
          phonePrefix,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Loyalty program rules saved successfully! Live for all customers.');
        setRule(data.rule);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const [cloudInfo, setCloudInfo] = useState<{
    configured: boolean;
    provider: string;
    urlPrefix: string;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchCloudStatus();
  }, []);

  const fetchCloudStatus = async () => {
    try {
      const res = await fetch('/api/admin/status');
      if (res.ok) {
        const data = await res.json();
        setCloudInfo(data.cloud);
      }
    } catch (e) {
      console.error('Error fetching cloud status:', e);
    }
  };

  const handleExportBackup = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/admin/database');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dahab-barbershop-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Failed to export backup: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to merge/restore data from this backup file?')) {
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setSuccessMsg(`Database backup imported successfully! (${data.stats.customers} customers synced)`);
      fetchSettings();
      fetchCloudStatus();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('Error importing backup: ' + err.message);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const presetRewards = [
    { title: 'Free Signature Haircut', desc: 'Complimentary signature haircut with refreshing hot towel finish.' },
    { title: '20% Discount on Next Visit', desc: 'Enjoy 20% off your entire grooming bill on your next appointment.' },
    { title: 'Free Beard Sculpt & Steam', desc: 'Hot towel lather, straight razor edge lining, and beard conditioning.' },
    { title: 'Dahab Full Royal Package', desc: 'Haircut, beard sculpt, charcoal mask, and espresso ritual on us.' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Loyalty Program Settings & Rules"
        subtitle="Configure haircut threshold, reward gifts, and barbershop branding parameters"
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-4xl w-full">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 0: Cloud Storage & Database Persistence Status */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2.5">
                  Cloud Database & Storage Status
                  {cloudInfo?.configured ? (
                    <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Cloud Sync ({cloudInfo.provider})
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Local Storage Mode (Setup Upstash on Vercel for 100% cloud sync)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ensures all customer accounts and stamp cards persist across Vercel serverless deployments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                disabled={exporting}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-400 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {exporting ? 'Exporting...' : 'Export Backup JSON'}
              </button>

              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition">
                {importing ? 'Importing...' : 'Restore / Import JSON'}
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                  disabled={importing}
                />
              </label>
            </div>
          </div>

          {!cloudInfo?.configured && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs text-amber-200/90">
              <p className="font-bold text-amber-300">
                💡 How to enable permanent cloud database on Vercel (1-Click Free):
              </p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-300 pl-1 text-[11px] leading-relaxed">
                <li>Go to your project on <strong>Vercel Dashboard</strong> &rarr; Click <strong>Storage</strong> tab.</li>
                <li>Click <strong>Create Database</strong> &rarr; Select <strong>KV (Upstash Redis)</strong> &rarr; Click <strong>Continue</strong>.</li>
                <li>Connect it to your project. Vercel will automatically inject <code className="text-amber-300">KV_REST_API_URL</code> and <code className="text-amber-300">KV_REST_API_TOKEN</code>.</li>
                <li>Redeploy or promote production build. Done! All customer accounts & stamps will sync globally in real-time.</li>
              </ol>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Loyalty Stamp Rule */}
          <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Loyalty Stamp Target
                </h3>
                <p className="text-xs text-zinc-400">
                  How many visits/haircuts are required to earn 1 free reward?
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-zinc-300 mb-2">
                Required Haircuts (Target Visits)
              </label>
              <div className="flex items-center gap-3">
                {[3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTargetVisits(num)}
                    className={`w-12 h-12 rounded-xl text-base font-bold font-mono transition ${
                      targetVisits === num
                        ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/30 scale-105'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                Standard industry rule is <strong>5 visits = 1 reward</strong>.
              </p>
            </div>
          </div>

          {/* Section 2: Reward Gift Details */}
          <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Reward Gift & Description
                </h3>
                <p className="text-xs text-zinc-400">
                  Specify what the customer receives after completing their stamp target
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-2">
                Quick Reward Templates:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetRewards.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => {
                      setRewardTitle(p.title);
                      setRewardDesc(p.desc);
                    }}
                    className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-left border border-zinc-800 hover:border-amber-400/40 transition"
                  >
                    <span className="text-xs font-bold text-white block">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 block line-clamp-1 mt-0.5">
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1.5">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="e.g. Free Signature Haircut"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1.5">
                  Reward Description
                </label>
                <textarea
                  rows={2}
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  placeholder="e.g. Enjoy a complimentary haircut with refreshing hot towel finish."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Lounge Branding */}
          <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Barbershop Info
                </h3>
                <p className="text-xs text-zinc-400">
                  Branding and country code format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1.5">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1.5">
                  Phone Prefix
                </label>
                <input
                  type="text"
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="gold-btn px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-xl shadow-amber-500/25"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Loyalty Rules
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
