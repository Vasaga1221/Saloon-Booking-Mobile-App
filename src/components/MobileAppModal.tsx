import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>(() => {
    if (isIOS) return 'ios';
    return 'android';
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6vetaadw77mvyxqeomtqvz-60180803569.asia-east1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&bgcolor=1A1220&color=FFF9EF&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1A1220] text-stone-100 border border-[#C59B7D]/35 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative font-sans max-h-[92vh] overflow-y-auto luxury-scrollbar">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C59B7D]/20 border border-[#C59B7D]/40 flex items-center justify-center text-[#C59B7D] shrink-0">
            <span className="material-symbols-outlined text-2xl">smartphone</span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white leading-tight">
              Reactive Mobile App (Android &amp; iOS)
            </h2>
            <p className="text-xs text-stone-400">
              Install native package or open full-screen on mobile
            </p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'android'
                ? 'bg-[#C59B7D] text-[#1E1424] shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">android</span>
            <span>Android (APK)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-[#C59B7D] text-[#1E1424] shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">phone_iphone</span>
            <span>iOS (Apple)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-[#C59B7D] text-[#1E1424] shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">qr_code_2</span>
            <span>Scan QR</span>
          </button>
        </div>

        {/* TAB 1: ANDROID */}
        {activeTab === 'android' && (
          <div className="space-y-3 font-sans">
            {/* Direct WebAPK Install */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Option 1 • 1-Tap WebAPK
                </span>
                <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Install Signed WebAPK via Chrome
              </h3>
              <p className="text-[11px] text-stone-300 leading-relaxed mb-3">
                Android compiles a genuine <strong>.apk</strong> package directly on your device. It adds the AuraOS icon to your app drawer and opens full screen without browser URL bars.
              </p>

              {isInstalled ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Already installed on your device in standalone mode!
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
                  Install WebAPK on Android Now
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-stone-900/60 border border-white/10 text-[11px] text-stone-300 space-y-1">
                  <span className="font-bold text-stone-200 block mb-0.5">Quick Android Install:</span>
                  <div>1. Open this link in <strong>Chrome</strong> on Android</div>
                  <div>2. Tap menu <strong>⋮</strong> &gt; <strong>"Install app"</strong></div>
                </div>
              )}
            </div>

            {/* Download Standalone .APK File via PWABuilder */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Option 2 • Download .APK File
                </span>
                <span className="material-symbols-outlined text-purple-300 text-sm">build</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Generate Standalone APK via PWABuilder
              </h3>
              <p className="text-[11px] text-stone-300 leading-relaxed mb-3">
                Google/Microsoft tool generates a downloadable <strong>.apk</strong> or <strong>.aab</strong> package ready for distribution or side-loading:
              </p>
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Generate &amp; Download .APK Package
              </a>
            </div>

            {/* Build with Capacitor */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <h4 className="font-bold text-stone-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#C59B7D]">terminal</span>
                Option 3 • Build in Android Studio
              </h4>
              <div className="bg-black/60 p-2 rounded-xl font-mono text-[10px] text-purple-200 overflow-x-auto select-all">
                npm i @capacitor/core @capacitor/cli @capacitor/android<br />
                npx cap add android &amp;&amp; npx cap open android
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IOS (IPHONE / IPAD) */}
        {activeTab === 'ios' && (
          <div className="space-y-3 font-sans">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  Native iOS Safari WebApp
                </span>
                <span className="material-symbols-outlined text-sky-400 text-sm">apple</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Install on iPhone or iPad Home Screen
              </h3>
              <p className="text-[11px] text-stone-300 leading-relaxed mb-3">
                iOS uses WebKit WebApps instead of APKs. When added to your Home Screen, it runs as a genuine standalone iOS application with no Safari URL bar and smooth 120Hz gesture navigation:
              </p>

              <div className="bg-stone-900/80 p-3 rounded-2xl border border-white/10 space-y-2.5 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-[#C59B7D]">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-white">Open in Safari</span>
                    <p className="text-[11px] text-stone-400">
                      Open this URL on your iPhone in Apple Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-[#C59B7D]">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-white">Tap Share Button</span>
                    <p className="text-[11px] text-stone-400">
                      Tap the square Share icon with an arrow pointing up at the bottom of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-[#C59B7D]">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-white">Tap "Add to Home Screen"</span>
                    <p className="text-[11px] text-stone-400">
                      Tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> at top right. The AuraOS icon will appear on your iPhone screen!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Build with Xcode via Capacitor */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <h4 className="font-bold text-stone-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#C59B7D]">terminal</span>
                Build Native .IPA for iOS in Xcode
              </h4>
              <div className="bg-black/60 p-2 rounded-xl font-mono text-[10px] text-purple-200 overflow-x-auto select-all">
                npm i @capacitor/core @capacitor/cli @capacitor/ios<br />
                npx cap add ios &amp;&amp; npx cap open ios
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCAN QR CODE WITH MOBILE PHONE */}
        {activeTab === 'qr' && (
          <div className="text-center p-3 font-sans space-y-3">
            <p className="text-xs text-stone-300">
              Scan this QR code with your iPhone Camera or Android Google Lens to open the app directly on your phone:
            </p>
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-lg flex items-center justify-center">
              <img
                src={qrCodeUrl}
                alt="Scan to open on phone"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-stone-400">
              Once opened on your mobile phone, it automatically renders the 100% full-screen reactive mobile experience!
            </p>
          </div>
        )}

        {/* Footer Link & Copy */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-stone-400 truncate max-w-[240px] text-[11px]">
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
