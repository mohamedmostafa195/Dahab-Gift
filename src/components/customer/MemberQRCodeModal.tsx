'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface MemberQRCodeModalProps {
  memberCode: string;
  customerName: string;
  phoneNumber: string;
  tier: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberQRCodeModal({
  memberCode,
  customerName,
  phoneNumber,
  tier,
  isOpen,
  onClose,
}: MemberQRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(memberCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Encode memberCode directly so the QR code matrix is clean, low-density (Version 1/2), and scans in milliseconds
  const qrPayload = memberCode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1a16] via-[#141418] to-[#0c0c0e] border border-amber-500/40 p-6 sm:p-7 shadow-2xl shadow-amber-950/40 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Member Card Header */}
        <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-semibold">
            DAHAB VIP PASS
          </span>
        </div>

        <h3 className="text-xl font-serif font-bold text-white mb-1">
          {customerName}
        </h3>
        <p className="text-xs text-zinc-400 font-mono mb-5">{phoneNumber}</p>

        {/* QR Code Container with High Contrast & Quiet Zone */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl inline-block shadow-2xl mx-auto mb-5 border-4 border-amber-400/40">
          <QRCodeSVG
            value={qrPayload}
            size={200}
            level="M"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        {/* Member Code with Copy */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 mb-5 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              Member Code
            </span>
            <span className="text-base font-mono font-bold text-amber-300">
              {memberCode}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Scan instruction */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Show this QR code to the barber upon arrival</span>
        </div>
      </div>
    </div>
  );
}
