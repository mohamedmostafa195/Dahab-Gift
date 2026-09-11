'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  QrCode,
  Search,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Upload,
  SwitchCamera,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';

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
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isStartingRef = useRef(false);

  // Initialize camera lifecycle
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Small timeout to allow DOM node #reader-container to be painted
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!isMounted) return;
      await startCamera();
    };

    init();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Silent camera stop catch:', e);
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const startCamera = async (cameraIdToUse?: string) => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);

    try {
      // Ensure any previous instance is stopped
      await stopCamera();

      const element = document.getElementById('reader-container');
      if (!element) {
        throw new Error('Scanner container element not found');
      }

      const html5QrCode = new Html5Qrcode('reader-container');
      html5QrCodeRef.current = html5QrCode;

      // Try discovering available video devices
      let cameras: CameraDevice[] = [];
      try {
        cameras = await Html5Qrcode.getCameras();
        setAvailableCameras(cameras);
      } catch (camErr) {
        console.warn('Could not enumerate cameras:', camErr);
      }

      // Responsive QR box calculation so it never exceeds viewfinder dimensions
      const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const boxSize = Math.max(160, Math.floor(minEdge * 0.72));
        return { width: boxSize, height: boxSize };
      };

      const qrConfig = {
        fps: 15,
        qrbox: qrboxFunction,
        aspectRatio: 1.0,
      };

      const cameraParam = cameraIdToUse
        ? { deviceId: { exact: cameraIdToUse } }
        : cameras.length > 0
        ? { deviceId: { exact: cameras[cameras.length - 1].id } } // often back camera
        : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraParam,
        qrConfig,
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        (errorMessage) => {
          // Frame-level scan errors are ignored
        }
      );

      setScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      // Fallback try: simple user/any camera
      try {
        if (html5QrCodeRef.current && !html5QrCodeRef.current.isScanning) {
          const qrConfig = { fps: 15, qrbox: 200 };
          await html5QrCodeRef.current.start(
            { facingMode: 'user' },
            qrConfig,
            (decodedText) => handleDecodedText(decodedText),
            () => {}
          );
          setScanning(true);
          return;
        }
      } catch (fallbackErr) {
        console.warn('Fallback camera failed:', fallbackErr);
      }

      setCameraError(
        'Camera permission was denied or camera is not available. You can upload a QR image or enter code below.'
      );
      setScanning(false);
    } finally {
      isStartingRef.current = false;
    }
  };

  const handleSwitchCamera = async () => {
    if (availableCameras.length < 2) return;
    const currentIndex = availableCameras.findIndex(
      (c) => c.id === selectedCameraId
    );
    const nextCamera = availableCameras[(currentIndex + 1) % availableCameras.length];
    setSelectedCameraId(nextCamera.id);
    await startCamera(nextCamera.id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setCameraError(null);

    try {
      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode('reader-container');
        html5QrCodeRef.current = scanner;
      }

      // If running, stop before scanning image
      if (scanner.isScanning) {
        await scanner.stop();
      }

      const decodedResult = await scanner.scanFile(file, true);
      handleDecodedText(decodedResult);
    } catch (err: any) {
      setCameraError('Could not find a valid QR code in this image. Please try another photo.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      } else if (parsed.id) {
        identifier = parsed.id;
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

  const quickDemoCustomers = [
    { name: 'Mohamed Mostafa', code: 'DHB-1001', phone: '01012345678' },
    { name: 'Ahmed Hassan', code: 'DHB-1002', phone: '01123456789' },
    { name: 'Youssef Tarek', code: 'DHB-1003', phone: '01234567890' },
  ];

  return (
    <div className="rounded-3xl bg-[#141418] border border-amber-500/30 p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Scan Customer Pass
            </h3>
            <p className="text-xs text-zinc-400">
              Hold member QR code in camera view or upload QR photo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {availableCameras.length > 1 && (
            <button
              onClick={handleSwitchCamera}
              title="Switch Front/Back Camera"
              className="p-2 rounded-xl bg-zinc-800 text-amber-300 hover:bg-zinc-700 transition"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Camera Video Viewport */}
      <div className="relative aspect-square max-h-[300px] sm:max-h-[340px] w-full bg-black rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 flex items-center justify-center mb-4 mx-auto">
        <div id="reader-container" className="w-full h-full" />

        {/* Live scanning target overlay */}
        {scanning && !cameraError && !scannedResult && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-amber-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-300 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-300 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-300 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-300 rounded-br" />
              {/* Scan laser animation bar */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>
        )}

        {/* Camera Error Display */}
        {cameraError && (
          <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center z-10">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="text-xs text-zinc-300 max-w-xs mb-4 leading-relaxed">
              {cameraError}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => startCamera()}
                className="px-3.5 py-2 rounded-xl bg-amber-400/20 border border-amber-400/40 hover:bg-amber-400/30 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Camera
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                Upload QR Image
              </button>
            </div>
          </div>
        )}

        {/* Success Recognized Display */}
        {scannedResult && (
          <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
            <p className="text-base font-bold text-white">QR Code Recognized!</p>
            <p className="text-xs text-emerald-300 mt-1 font-mono break-all max-w-xs">
              {scannedResult}
            </p>
            <button
              onClick={() => {
                setScannedResult(null);
                startCamera();
              }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-zinc-800 transition"
            >
              Scan Another Pass
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input for QR Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Alternative Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessingFile}
          className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>{isProcessingFile ? 'Reading Image...' : 'Upload QR Image / Photo'}</span>
        </button>

        {!scanning && !cameraError && (
          <button
            type="button"
            onClick={() => startCamera()}
            className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5 transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Turn On Camera</span>
          </button>
        )}
      </div>

      {/* 1-Tap Quick Demo Customer Selectors */}
      <div className="mb-4 pt-3 border-t border-zinc-800/80">
        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
          <Zap className="w-3 h-3 text-amber-400" />
          Quick Demo Test Check-In:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {quickDemoCustomers.map((cust) => (
            <button
              key={cust.code}
              type="button"
              onClick={() => handleDecodedText(cust.code)}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-left transition"
            >
              <span className="text-white text-[11px] font-bold block truncate">
                {cust.name}
              </span>
              <span className="text-[10px] font-mono text-amber-400 block truncate">
                {cust.code}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Manual Entry Fallback */}
      <form onSubmit={handleManualSubmit} className="space-y-2 pt-2 border-t border-zinc-800/80">
        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
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
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="gold-btn px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shrink-0 shadow-md"
          >
            Lookup
          </button>
        </div>
      </form>
    </div>
  );
}
