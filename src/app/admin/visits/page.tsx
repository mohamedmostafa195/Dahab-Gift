'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Visit, Barber } from '@/types';
import {
  Scissors,
  Search,
  Calendar,
  UserCheck,
  Trash2,
  Edit3,
  X,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface VisitWithCustomer extends Visit {
  customerName: string;
  customerPhone: string;
  memberCode: string;
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarberFilter, setSelectedBarberFilter] = useState('ALL');
  const [editVisit, setEditVisit] = useState<VisitWithCustomer | null>(null);
  const [editService, setEditService] = useState('');
  const [editBarber, setEditBarber] = useState('');
  const [editPrice, setEditPrice] = useState(350);
  const [editNotes, setEditNotes] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/visits');
      const data = await res.json();
      if (res.ok) {
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId: string, customerName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this visit for ${customerName}? This will roll back the customer's stamp count.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/visits?id=${visitId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMsg('Visit removed and stamp count adjusted.');
        fetchVisits();
        setTimeout(() => setActionMsg(null), 3500);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenEdit = (v: VisitWithCustomer) => {
    setEditVisit(v);
    setEditService(v.serviceName);
    setEditBarber(v.barberName || '');
    setEditPrice(v.price ?? 350);
    setEditNotes(v.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVisit) return;

    try {
      const res = await fetch('/api/admin/visits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editVisit.id,
          serviceName: editService,
          barberName: editBarber,
          price: editPrice,
          notes: editNotes,
        }),
      });

      if (res.ok) {
        setEditVisit(null);
        fetchVisits();
        setActionMsg('Visit details updated successfully.');
        setTimeout(() => setActionMsg(null), 3500);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const barbersList = Array.from(
    new Set(visits.map((v) => v.barberName).filter(Boolean))
  );

  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.customerPhone.includes(searchQuery) ||
      v.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.memberCode && v.memberCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBarber =
      selectedBarberFilter === 'ALL' || v.barberName === selectedBarberFilter;

    return matchesSearch && matchesBarber;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Visit & Haircut History"
        subtitle="Complete log of customer visits with edit and rollback capabilities"
        onSearch={(q) => setSearchQuery(q)}
      />

      <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
        {actionMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedBarberFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedBarberFilter === 'ALL'
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              All Barbers
            </button>
            {barbersList.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBarberFilter(b as string)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedBarberFilter === b
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            Total <strong>{filteredVisits.length}</strong> recorded visits
          </span>
        </div>

        {/* Visits Table */}
        <div className="rounded-3xl bg-[#121216] border border-amber-500/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0c0f] border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Date & Time</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Barber</th>
                  <th className="py-3.5 px-4 text-center">Cycle / Stamp #</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-800/40 transition">
                    {/* Date */}
                    <td className="py-4 px-4 sm:px-6 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>
                          {new Date(v.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <span className="font-serif font-bold text-white block">
                        {v.customerName}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {v.customerPhone}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4 font-medium text-zinc-200">
                      {v.serviceName}
                      {v.notes && (
                        <span className="block text-[10px] text-zinc-500 italic truncate max-w-xs">
                          "{v.notes}"
                        </span>
                      )}
                    </td>

                    {/* Barber */}
                    <td className="py-4 px-4 text-zinc-300">
                      {v.barberName || 'N/A'}
                    </td>

                    {/* Cycle / Stamp */}
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20 text-[11px]">
                        Cycle {v.cycleNumber} • Stamp #{v.visitIndexInCycle}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-amber-400/90">
                      {v.price === 0 ? 'FREE REWARD' : `${v.price} EGP`}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          title="Edit Visit"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisit(v.id, v.customerName)}
                          title="Delete Visit (Rollback Stamp)"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Visit Modal */}
      {editVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121216] border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setEditVisit(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-white mb-4">
              Edit Visit for {editVisit.customerName}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Barber
                </label>
                <input
                  type="text"
                  value={editBarber}
                  onChange={(e) => setEditBarber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Price (EGP)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditVisit(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
