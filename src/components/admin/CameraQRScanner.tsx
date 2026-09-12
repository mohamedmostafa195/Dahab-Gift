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
  Flashlight,
  Volume2,
} from 'lucide-react';
import { Html5Qrcode, CameraDevice, Html5QrcodeSupportedFormats } from 'html5-qrcode';

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
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isStartingRef = useRef(false);

  // Play audio & vibration feedback upon successful scan
  const playScanFeedback = () => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(120);
      }
    } catch {
      // Audio or vibration unavailable
    }
  };

  // Initialize camera lifecycle
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
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
    setTorchOn(false);
    setHasTorch(false);
  };

  const startCamera = async (cameraIdToUse?: string) => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError(null);

    try {
      await stopCamera();

      const element = document.getElementById('reader-container');
      if (!element) {
        throw new Error('Scanner container element not found');
      }

      // Support QR codes and common barcodes with maximum performance
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
      ];

      const html5QrCode = new Html5Qrcode('reader-container', {
        formatsToSupport,
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });
      html5QrCodeRef.current = html5QrCode;

      // Discover available video devices
      let cameras: CameraDevice[] = [];
      try {
        cameras = await Html5Qrcode.getCameras();
        setAvailableCameras(cameras);
        if (cameras.length > 0 && !selectedCameraId && !cameraIdToUse) {
          // Select standard/main back camera (avoid telephoto or ultra-wide lenses by default)
          const backCameras = cameras.filter((c) => {
            const label = c.label.toLowerCase();
            return (
              label.includes('back') ||
              label.includes('rear') ||
              label.includes('environment')
            );
          });

          // Prefer standard back/wide camera over telephoto or ultra-wide
          const mainBackCam =
            backCameras.find((c) => {
              const label = c.label.toLowerCase();
              return (
                !label.includes('telephoto') &&
                !label.includes('ultra') &&
                !label.includes('0.5x') &&
                !label.includes('3x') &&
                !label.includes('5x')
              );
            }) ||
            backCameras[0] ||
            cameras[0];

          setSelectedCameraId(mainBackCam.id);
        }
      } catch (camErr) {
        console.warn('Could not enumerate cameras:', camErr);
      }

      const qrConfig = {
        fps: 20,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const edgeSize = Math.floor(minEdge * 0.8);
          return {
            width: Math.min(edgeSize, 300),
            height: Math.min(edgeSize, 300),
          };
        },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const chosenCameraId =
        cameraIdToUse ||
        selectedCameraId ||
        (cameras.length > 0 ? cameras[0].id : undefined);

      const cameraParam = chosenCameraId
        ? { deviceId: { exact: chosenCameraId } }
        : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraParam,
        qrConfig,
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        () => {
          // Frame-level scan errors ignored
        }
      );

      setScanning(true);

      // Check for torch capability
      try {
        const capabilities = html5QrCode.getRunningTrackCameraCapabilities?.();
        if (capabilities && (capabilities as any).torchFeature?.isSupported?.()) {
          setHasTorch(true);
        }
      } catch {
        // torch not supported on this device
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);

      // Fallback try: default environment facing mode
      try {
        if (html5QrCodeRef.current && !html5QrCodeRef.current.isScanning) {
          const fallbackConfig = {
            fps: 15,
            qrbox: { width: 240, height: 240 },
          };
          await html5QrCodeRef.current.start(
            { facingMode: 'environment' },
            fallbackConfig,
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
        'Camera access was not permitted or is in use by another app. You can switch cameras, upload a QR image, or enter code manually below.'
      );
      setScanning(false);
    } finally {
      isStartingRef.current = false;
    }
  };

  const handleSwitchCamera = async (targetId?: string) => {
    if (availableCameras.length < 1) return;

    let nextId = targetId;
    if (!nextId) {
      const currentIndex = availableCameras.findIndex(
        (c) => c.id === selectedCameraId
      );
      const nextCamera =
        availableCameras[(currentIndex + 1) % availableCameras.length];
      nextId = nextCamera.id;
    }

    setSelectedCameraId(nextId);
    await startCamera(nextId);
  };

  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !html5QrCodeRef.current.isScanning) return;
    try {
      const newTorchState = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: newTorchState } as any],
      });
      setTorchOn(newTorchState);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setCameraError(null);

    try {
      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
        ];
        scanner = new Html5Qrcode('reader-container', {
          formatsToSupport,
          verbose: false,
        });
        html5QrCodeRef.current = scanner;
      }

      if (scanner.isScanning) {
        await scanner.stop();
      }

      const decodedResult = await scanner.scanFile(file, true);
      handleDecodedText(decodedResult);
    } catch (err: any) {
      setCameraError(
        'Could not detect a clear QR Code or Barcode in this image. Please try a clearer photo or enter the code manually.'
      );
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const extractIdentifier = (text: string): string => {
    let clean = (text || '').trim();
    if (!clean) return clean;

    // 1. JSON payload
    if ((clean.startsWith('{') && clean.endsWith('}')) || (clean.startsWith('"{') && clean.endsWith('}"'))) {
      try {
        const parsed = JSON.parse(clean.startsWith('"{') ? JSON.parse(clean) : clean);
        if (parsed.memberCode) return parsed.memberCode;
        if (parsed.phone || parsed.phoneNumber) return parsed.phone || parsed.phoneNumber;
        if (parsed.code) return parsed.code;
        if (parsed.id) return parsed.id;
      } catch (e) {}
    }

    // 2. URL containing query params or path segment
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      try {
        const url = new URL(clean);
        const codeParam =
          url.searchParams.get('code') ||
          url.searchParams.get('memberCode') ||
          url.searchParams.get('phone') ||
          url.searchParams.get('id');
        if (codeParam) return codeParam;

        const segments = url.pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        if (last && (last.startsWith('DHB-') || /^01[0-9]{9}$/.test(last))) {
          return last;
        }
      } catch (e) {}
    }

    // 3. Member Code pattern (e.g. DHB-1234)
    const dhbMatch = clean.match(/DHB-[A-Z0-9]+/i);
    if (dhbMatch) {
      return dhbMatch[0].toUpperCase();
    }

    // 4. Egyptian phone number pattern (e.g. 01012345678 or +201012345678)
    const phoneMatch = clean.match(/(?:\+20|0020|0)?(1[0125][0-9]{8})/);
    if (phoneMatch) {
      return '0' + phoneMatch[1];
    }

    return clean;
  };

  const handleDecodedText = (text: string) => {
    playScanFeedback();
    setScannedResult(text);
    stopCamera();

    const identifier = extractIdentifier(text);
    onCustomerFound(identifier);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleDecodedText(manualCode.trim());
    }
  };

  return (
    <div className="rounded-3xl bg-[#141418] border border-amber-500/30 p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Scan Customer Pass / QR
            </h3>
            <p className="text-xs text-zinc-400">
              Auto-detects QR codes & barcodes with high speed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {hasTorch && scanning && (
            <button
              onClick={toggleTorch}
              title="Toggle Flashlight"
              className={`p-2 rounded-xl transition ${
                torchOn
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}

          {availableCameras.length > 1 && (
            <button
              onClick={() => handleSwitchCamera()}
              title="Switch Camera (Front/Back/USB)"
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

      {/* Camera Selector Dropdown if multiple cameras detected */}
      {availableCameras.length > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <label className="text-[11px] text-zinc-400 shrink-0 font-medium">Camera:</label>
          <select
            value={selectedCameraId}
            onChange={(e) => handleSwitchCamera(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 focus:outline-none focus:border-amber-400 truncate"
          >
            {availableCameras.map((cam, idx) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Camera Video Viewport */}
      <div className="relative aspect-square max-h-[300px] sm:max-h-[340px] w-full bg-black rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 flex items-center justify-center mb-4 mx-auto">
        <div id="reader-container" className="w-full h-full [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full [&_video]:!rounded-2xl" />

        {/* Live scanning target overlay */}
        {scanning && !cameraError && !scannedResult && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-amber-400/80 rounded-2xl relative shadow-[0_0_25px_rgba(212,175,55,0.35)]">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-300 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-300 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-300 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-300 rounded-br-lg" />
              {/* Scan laser animation bar */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_#facc15]" />
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
                Upload Photo
              </button>
            </div>
          </div>
        )}

        {/* Success Recognized Display */}
        {scannedResult && (
          <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
            <p className="text-base font-bold text-white">QR Code / Pass Recognized!</p>
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
          <span>{isProcessingFile ? 'Reading Photo...' : 'Upload QR Image / Photo'}</span>
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
              placeholder="e.g. DHB-4821 or 01012345678"
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
