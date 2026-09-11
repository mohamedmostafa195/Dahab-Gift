'use client';

import React from 'react';
import { Visit } from '@/types';
import { Scissors, Calendar, UserCheck, Trash2, Edit3 } from 'lucide-react';

interface VisitTimelineProps {
  visits: Visit[];
  isAdmin?: boolean;
  onDeleteVisit?: (visitId: string) => void;
  onEditVisit?: (visit: Visit) => void;
}

export default function VisitTimeline({
  visits,
  isAdmin = false,
  onDeleteVisit,
  onEditVisit,
}: VisitTimelineProps) {
  if (!visits || visits.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
        <Scissors className="w-8 h-8 mx-auto text-zinc-600 mb-2 opacity-60" />
        <p className="text-sm text-zinc-400">No haircut visits recorded yet.</p>
        <p className="text-xs text-zinc-500 mt-1">
          Visits will appear here automatically when recorded by your barber.
        </p>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-zinc-700 before:to-transparent">
      {visits.map((visit, index) => {
        const visitNumber = visits.length - index;

        return (
          <div key={visit.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-zinc-900 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.5)] group-hover:scale-125 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            </div>

            {/* Visit Card */}
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-500/30 p-4 transition-all duration-200 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    Visit #{visitNumber}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Cycle {visit.cycleNumber} • Stamp {visit.visitIndexInCycle}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatDate(visit.createdAt)}</span>
                </div>
              </div>

              {/* Service & Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-zinc-100">
                    {visit.serviceName}
                  </h4>
                  {visit.barberName && (
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400/70" />
                      Barber: <span className="text-zinc-300">{visit.barberName}</span>
                    </p>
                  )}
                  {visit.notes && (
                    <p className="text-xs text-zinc-400 mt-1 italic bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                      "{visit.notes}"
                    </p>
                  )}
                </div>

                {/* Price & Admin Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  {visit.price !== undefined && (
                    <span className="font-mono text-xs font-bold text-amber-400/90 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-900/50">
                      {visit.price === 0 ? 'FREE REWARD' : `${visit.price} EGP`}
                    </span>
                  )}

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      {onEditVisit && (
                        <button
                          onClick={() => onEditVisit(visit)}
                          title="Edit Visit Details"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteVisit && (
                        <button
                          onClick={() => onDeleteVisit(visit.id)}
                          title="Delete Visit (Added by mistake)"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
