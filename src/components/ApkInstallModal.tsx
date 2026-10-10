import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6vetaadw77mvyxqeomtqvz-60180803569.asia-east1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A1220] text-stone-100 border border-[#C59B7D]/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto luxury-scrollbar">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#C59B7D]/20 border border-[#C59B7D]/40 flex items-center justify-center text-[#C59B7D]">
            <span className="material-symbols-outlined text-2xl">android</span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white leading-tight">
              Get APK / Install on Android
            </h2>
            <p className="text-xs text-stone-400">
              Aura Partner OS native mobile package
            </p>
          </div>
        </div>

        {/* Option 1: Native Android WebAPK (Recommended - 1 Click) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mb-1 border border-emerald-500/20">
                Recommended & Instant
              </span>
              <h3 className="text-sm font-bold text-white">
                1. Native Android WebAPK (Direct on Device)
              </h3>
            </div>
            <span className="material-symbols-outlined text-emerald-400">verified</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            Android automatically compiles and installs a signed <strong>WebAPK</strong> file into your phone’s app drawer. It launches with zero browser chrome, full splash screen, and offline cache.
          </p>

          {isInstalled ? (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Already installed and running in native standalone mode!
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={async () => {
                await install();
                onClose();
              }}
              className="w-full py-3 bg-[#C59B7D] hover:bg-[#b88c6e] text-[#1E1424] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Install WebAPK Now
            </button>
          ) : (
            <div className="space-y-2 text-xs text-stone-300">
              <p className="text-[11px] text-stone-400">
                To install on your Android phone right now:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-stone-300 text-[11px]">
                <li>Open this app URL in <strong>Google Chrome</strong> on Android.</li>
                <li>Tap the <strong>three dots menu (⋮)</strong> at top right.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Option 2: Download standalone .APK via PWABuilder */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full inline-block mb-1 border border-purple-500/20">
                Official Google & Microsoft Tool
              </span>
              <h3 className="text-sm font-bold text-white">
                2. Download Standalone .APK File
              </h3>
            </div>
            <span className="material-symbols-outlined text-purple-300">build</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            Generate an unsigned or signed <strong>.apk</strong> / <strong>.aab</strong> package using <strong>PWABuilder</strong> (powered by Google Bubblewrap). This packages the live manifest into a downloadable Android package:
          </p>
          <a
            href={pwaBuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mb-2"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Generate .APK Package via PWABuilder
          </a>
        </div>

        {/* Option 3: Compile via Capacitor / Android Studio */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4 text-xs">
          <h3 className="font-bold text-stone-200 mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#C59B7D]">terminal</span>
            3. Build with Capacitor CLI (Local Android Studio)
          </h3>
          <p className="text-[11px] text-stone-400 mb-2">
            If you want to build the raw Java/Kotlin APK in Android Studio:
          </p>
          <div className="bg-black/60 p-2.5 rounded-xl font-mono text-[10px] text-purple-200 overflow-x-auto select-all">
            npm i @capacitor/core @capacitor/cli @capacitor/android<br />
            npx cap init "Aura Partner OS" com.aura.partneros<br />
            npm run build<br />
            npx cap add android &amp;&amp; npx cap open android
          </div>
        </div>

        {/* Share / Copy URL to Phone */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-stone-400 truncate max-w-[260px]">
            {currentUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied Link!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
