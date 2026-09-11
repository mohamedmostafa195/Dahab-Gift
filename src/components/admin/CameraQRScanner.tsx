'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, Search, AlertCircle, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface CameraQRScannerProps {
  onCustomerFound: (customerIdentifier: string) => void;
  onClose?: () => void;
}

export default function CameraQRScanner({
  onCustomerFound,
  onClose,
}: CameraQRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const elementId = 'reader-container';
      const html5QrCode = new Html5Qrcode(elementId);
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        (errorMessage) => {
          // ignore background frame errors
        }
      );
      setScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(
        'Camera permission was not granted or no webcam available. You can use manual code/phone lookup below.'
      );
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping camera:', e);
      }
    }
  };

  const handleDecodedText = (text: string) => {
    setScannedResult(text);
    stopCamera();

    let identifier = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed.memberCode) {
        identifier = parsed.memberCode;
      } else if (parsed.phone) {
        identifier = parsed.phone;
      }
    } catch {
      // plain text string like DHB-1001 or 01012345678
      identifier = text.trim();
    }

    onCustomerFound(identifier);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleDecodedText(manualCode.trim());
    }
  };

  return (
    <div className="rounded-3xl bg-[#141418] border border-amber-500/30 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">
              Scan Customer Pass
            </h3>
            <p className="text-xs text-zinc-400">
              Hold customer's QR code in front of the camera
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Camera Video Viewport */}
      <div className="relative aspect-video max-h-[320px] bg-black rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 flex items-center justify-center mb-5">
        <div id="reader-container" className="w-full h-full" />

        {cameraError && (
          <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="text-xs text-zinc-300 max-w-xs mb-3">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-amber-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Camera
            </button>
          </div>
        )}

        {scannedResult && (
          <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-white">QR Code Recognized!</p>
            <p className="text-xs text-emerald-300 mt-1 font-mono">{scannedResult}</p>
          </div>
        )}
      </div>

      {/* Quick Manual Entry Fallback */}
      <form onSubmit={handleManualSubmit} className="space-y-3">
        <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold">
          Or Enter Member Code / Phone Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. DHB-1001 or 01012345678"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="gold-btn px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shrink-0"
          >
            Lookup
          </button>
        </div>
      </form>
    </div>
  );
}
