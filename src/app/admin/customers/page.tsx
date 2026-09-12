'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import QuickVisitModal from '@/components/admin/QuickVisitModal';
import CelebrationModal from '@/components/admin/CelebrationModal';
import VisitTimeline from '@/components/customer/VisitTimeline';
import RewardCard from '@/components/customer/RewardCard';
import {
  Customer,
  Visit,
  Reward,
  LoyaltyRule,
  Barber,
  ServiceItem,
} from '@/types';
import {
  Users,
  Search,
  Plus,
  Scissors,
  Gift,
  QrCode,
  Calendar,
  X,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rule, setRule] = useState<LoyaltyRule | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerVisits, setCustomerVisits] = useState<Visit[]>([]);
  const [customerRewards, setCustomerRewards] = useState<Reward[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modals
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Quick visit modal state
  const [quickVisitModalOpen, setQuickVisitModalOpen] = useState(false);
  const [customerForVisit, setCustomerForVisit] = useState<Customer | null>(null);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    reward?: Reward;
    customer?: Customer;
  }>({ isOpen: false });

  useEffect(() => {
    fetchCustomers();
    fetchBarbersAndServices();
  }, [activeFilter]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/admin/customers?filter=${activeFilter}`);
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
        setRule(data.rule);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBarbersAndServices = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setBarbers(data.barbers || []);
        setServices(data.services || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCustomerDetail = async (c: Customer) => {
    setSelectedCustomer(c);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${c.id}`);
      const data = await res.json();
      if (res.ok) {
        setCustomerVisits(data.visits || []);
        setCustomerRewards(data.rewards || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newFullName,
          phoneNumber: newPhone,
          email: newEmail,
          notes: newNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }

      setNewCustomerModalOpen(false);
      setNewFullName('');
      setNewPhone('');
      setNewEmail('');
      setNewNotes('');
      fetchCustomers();
      openCustomerDetail(data.customer);
    } catch (err: any) {
      alert(err.message || 'Error creating customer');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardIdOrCode: rewardId, redeemedBy: 'Master Barber' }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchCustomers();
        if (selectedCustomer) {
          openCustomerDetail(data.customer || selectedCustomer);
        }
      } else {
        alert(data.error || 'Redemption failed');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    if (!confirm('Remove this visit record? This will adjust the customer stamp count.')) return;
    try {
      const res = await fetch(`/api/admin/visits?id=${visitId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCustomers();
        if (selectedCustomer) {
          openCustomerDetail(selectedCustomer);
        }
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (!confirm(`Are you sure you want to permanently delete customer "${customerName}" and all their records?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete customer');
      }
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
      }
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Error deleting customer');
    }
  };

  const targetVisits = rule?.targetVisits || 5;

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery) ||
      c.memberCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Customer Loyalty Directory"
        subtitle="Manage member profiles, visits count, rewards, and histories"
        onSearch={(q) => setSearchQuery(q)}
        onAddNewCustomer={() => setNewCustomerModalOpen(true)}
      />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Customers' },
              { id: 'reward-ready', label: '★ Reward Ready (5/5)' },
              { id: 'active', label: 'Active (Has Stamps)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeFilter === f.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            Showing <strong>{filtered.length}</strong> members
          </span>
        </div>

        {/* Customers CRM Table */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0c0f] border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Customer / Member</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4 text-center">Loyalty Stamps</th>
                  <th className="py-3.5 px-4 text-center">Lifetime Haircuts</th>
                  <th className="py-3.5 px-4 text-center">Available Rewards</th>
                  <th className="py-3.5 px-4">Last Visit</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((c) => {
                  const isReady = c.currentVisits >= targetVisits;
                  const percent = Math.min(100, Math.round((c.currentVisits / targetVisits) * 100));

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-zinc-800/40 transition cursor-pointer"
                      onClick={() => openCustomerDetail(c)}
                    >
                      {/* Name & Code */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/20 shrink-0">
                            {c.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-white text-sm block">
                              {c.fullName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-amber-300">
                                {c.memberCode}
                              </span>
                              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                                {c.tier}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 font-mono text-zinc-300">
                        {c.phoneNumber}
                      </td>

                      {/* Loyalty Stamps */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isReady ? 'text-amber-400' : 'text-zinc-200'
                            }`}
                          >
                            {c.currentVisits} / {targetVisits}
                          </span>
                          <div className="w-16 bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-zinc-500 mt-0.5">
                            Cycle #{c.currentCycle}
                          </span>
                        </div>
                      </td>

                      {/* Lifetime Haircuts */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-zinc-300">
                        {c.lifetimeVisits}
                      </td>

                      {/* Available Rewards */}
                      <td className="py-4 px-4 text-center">
                        {isReady ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold animate-pulse">
                            <Gift className="w-3 h-3" />
                            Ready (1)
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">0 Available</span>
                        )}
                      </td>

                      {/* Last Visit */}
                      <td className="py-4 px-4 text-zinc-400 text-xs">
                        {c.lastVisitDate
                          ? new Date(c.lastVisitDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Never'}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setCustomerForVisit(c);
                              setQuickVisitModalOpen(true);
                            }}
                            className="gold-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                            title="Add Haircut Visit"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+1 Visit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCustomer(c.id, c.fullName)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition"
                            title="Delete Customer Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="w-full max-w-xl h-full bg-[#111115] border-l border-amber-500/30 p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center font-serif font-black text-xl shadow-md shadow-amber-500/20">
                    {selectedCustomer.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                        {selectedCustomer.tier}
                      </span>
                      <span className="font-mono text-xs text-amber-300 font-bold">
                        {selectedCustomer.memberCode}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {selectedCustomer.fullName}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Info & Stats */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Current Stamps
                  </span>
                  <span className="text-xl font-mono font-bold text-amber-400">
                    {selectedCustomer.currentVisits}/{targetVisits}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    Cycle #{selectedCustomer.currentCycle}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Lifetime Visits
                  </span>
                  <span className="text-xl font-mono font-bold text-white">
                    {selectedCustomer.lifetimeVisits}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">Total cuts</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Rewards Claimed
                  </span>
                  <span className="text-xl font-mono font-bold text-amber-300">
                    {customerRewards.filter((r) => r.status === 'REDEEMED').length}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">Lifetime</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setCustomerForVisit(selectedCustomer);
                    setQuickVisitModalOpen(true);
                  }}
                  className="gold-btn flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+1 Add Haircut Visit</span>
                </button>

                <button
                  onClick={() => handleDeleteCustomer(selectedCustomer.id, selectedCustomer.fullName)}
                  className="px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  title="Delete Customer Profile"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 space-y-2 text-xs mb-6">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{selectedCustomer.phoneNumber}</span>
                </div>
                {selectedCustomer.email && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.notes && (
                  <p className="text-zinc-400 italic pt-1 border-t border-zinc-800">
                    Notes: {selectedCustomer.notes}
                  </p>
                )}
              </div>

              {/* Rewards Section */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Rewards & Vouchers ({customerRewards.length})</span>
                </h4>

                {customerRewards.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No rewards issued yet.</p>
                ) : (
                  <div className="space-y-3">
                    {customerRewards.map((r) => (
                      <RewardCard
                        key={r.id}
                        reward={r}
                        isAdmin={true}
                        onRedeemClick={() => handleRedeemReward(r.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Visit History */}
              <div className="space-y-3">
                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>Visit History Log ({customerVisits.length})</span>
                </h4>

                <VisitTimeline
                  visits={customerVisits}
                  isAdmin={true}
                  onDeleteVisit={handleDeleteVisit}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121216] border border-amber-500/30 p-6 sm:p-7 shadow-2xl">
            <button
              onClick={() => setNewCustomerModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Add New Customer
                </h3>
                <p className="text-xs text-zinc-400">
                  Create a new loyalty membership profile
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Mostafa Nader"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="01099887766"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Grooming Notes / Preferences
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Scissor work on top, taper fade"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewCustomerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="gold-btn px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  {createLoading ? 'Creating...' : 'Create Member Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Visit Modal */}
      {customerForVisit && (
        <QuickVisitModal
          customer={customerForVisit}
          targetVisits={targetVisits}
          barbers={barbers}
          services={services}
          isOpen={quickVisitModalOpen}
          onClose={() => {
            setQuickVisitModalOpen(false);
            setCustomerForVisit(null);
          }}
          onVisitAdded={(data) => {
            fetchCustomers();
            if (selectedCustomer) {
              openCustomerDetail(data.customer);
            }
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
