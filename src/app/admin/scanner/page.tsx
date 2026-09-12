'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import CameraQRScanner from '@/components/admin/CameraQRScanner';
import QuickVisitModal from '@/components/admin/QuickVisitModal';
import CelebrationModal from '@/components/admin/CelebrationModal';
import { Customer, Barber, ServiceItem, Reward, LoyaltyRule } from '@/types';
import {
  QrCode,
  UserCheck,
  Scissors,
  Gift,
  Plus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Phone,
} from 'lucide-react';

export default function AdminScannerPage() {
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [rule, setRule] = useState<LoyaltyRule | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [quickVisitModalOpen, setQuickVisitModalOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    reward?: Reward;
    customer?: Customer;
  }>({ isOpen: false });

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const setRes = await fetch('/api/admin/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        setRule(setData.rule);
        setBarbers(setData.barbers || []);
        setServices(setData.services || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCustomerFound = async (identifier: string) => {
    setLoading(true);
    setSearchError('');
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(identifier)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Customer not found with this code/phone.');
      }
      setScannedCustomer(data.customer);
    } catch (err: any) {
      setSearchError(err.message || 'Customer lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const targetVisits = rule?.targetVisits || 5;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="QR Code Check-In Scanner"
        subtitle="Point camera at customer's phone pass to pull up profile instantly"
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Scanner Viewport */}
          <div className="md:col-span-7">
            <CameraQRScanner onCustomerFound={handleCustomerFound} />
          </div>

          {/* Scanned Customer Result Card */}
          <div className="md:col-span-5">
            <div className="rounded-3xl bg-[#121216] border border-amber-500/30 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Scanned Member Result
                </span>
                {scannedCustomer && (
                  <button
                    onClick={() => setScannedCustomer(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center text-zinc-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
                  <p className="text-xs">Locating customer profile...</p>
                </div>
              ) : searchError ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                  <p className="font-bold mb-1">Lookup Error</p>
                  <p>{searchError}</p>
                </div>
              ) : scannedCustomer ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-400/30">
                      {scannedCustomer.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                          {scannedCustomer.tier}
                        </span>
                        <span className="font-mono text-xs text-amber-300 font-bold">
                          {scannedCustomer.memberCode}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-white">
                        {scannedCustomer.fullName}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        {scannedCustomer.phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Stamp Counter */}
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400 uppercase font-bold">
                        Loyalty Stamp Status
                      </span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        {scannedCustomer.currentVisits}/{targetVisits}
                      </span>
                    </div>

                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (scannedCustomer.currentVisits / targetVisits) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Cycle #{scannedCustomer.currentCycle}</span>
                      <span>{scannedCustomer.lifetimeVisits} Total Cuts</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setQuickVisitModalOpen(true)}
                    className="gold-btn w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+1 Add Haircut to Account</span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <QrCode className="w-10 h-10 mx-auto text-zinc-700 opacity-60" />
                  <p className="text-xs text-zinc-400 font-medium">
                    No active scan yet
                  </p>
                  <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                    Scan customer pass or enter phone number to immediately log a haircut.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quick Add Visit Modal */}
      {scannedCustomer && (
        <QuickVisitModal
          customer={scannedCustomer}
          targetVisits={targetVisits}
          barbers={barbers}
          services={services}
          isOpen={quickVisitModalOpen}
          onClose={() => setQuickVisitModalOpen(false)}
          onVisitAdded={(data) => {
            setScannedCustomer(data.customer);
            if (data.isRewardUnlocked && data.rewardEarned) {
              setCelebrationData({
                isOpen: true,
                reward: data.rewardEarned,
                customer: data.customer,
              });
            }
          }}
        />
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebrationData.isOpen}
        reward={celebrationData.reward}
        customer={celebrationData.customer}
        onClose={() => setCelebrationData({ isOpen: false })}
      />
    </div>
  );
}
