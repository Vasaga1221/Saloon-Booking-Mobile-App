import React, { useState, useEffect } from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { OperationsScreen } from './screens/OperationsScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { MobileAppModal } from './components/MobileAppModal';

const SalonAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    showSuccessToast,
    setSuccessToast,
    displayMode,
    setDisplayMode,
  } = useSalon();

  const [activeDeviceScreen, setActiveDeviceScreen] = useState<
    'onboarding' | 'operations' | 'timeline' | 'checkout' | 'crm'
  >('operations');
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Screen width detection for native full-bleed phone mode
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync tab navigation with device screen
  const handleTabChange = (tab: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup') => {
    setActiveTab(tab);
    if (tab === 'setup') setActiveDeviceScreen('onboarding');
    else if (tab === 'pulse') setActiveDeviceScreen('operations');
    else if (tab === 'timeline') setActiveDeviceScreen('timeline');
    else if (tab === 'checkout') setActiveDeviceScreen('checkout');
    else if (tab === 'crm') setActiveDeviceScreen('crm');
  };

  // Render the active mobile screen component
  const renderCurrentMobileScreen = () => {
    switch (activeDeviceScreen) {
      case 'onboarding':
        return <OnboardingScreen onSuccess={() => handleTabChange('pulse')} />;
      case 'operations':
        return (
          <OperationsScreen
            onNavigateToTimeline={() => handleTabChange('timeline')}
            onNavigateToCheckout={() => handleTabChange('checkout')}
          />
        );
      case 'timeline':
        return (
          <TimelineScreen
            onSelectSlot={(slot) => {
              if (slot.clientName.includes('Ananya')) {
                handleTabChange('checkout');
              }
            }}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            onBack={() => handleTabChange('pulse')}
            onComplete={() => handleTabChange('pulse')}
          />
        );
      case 'crm':
        return <DirectoryScreen />;
      default:
        return (
          <OperationsScreen
            onNavigateToTimeline={() => handleTabChange('timeline')}
            onNavigateToCheckout={() => handleTabChange('checkout')}
          />
        );
    }
  };

  // If user is on an actual mobile device or narrow screen:
  // Render PURE FULL-BLEED NATIVE MOBILE APP UX without desktop wrapper!
  if (isMobileViewport) {
    return (
      <div className="native-mobile-app text-[#1E1424]">
        {/* Floating install / APK badge button at top-right for mobile */}
        <button
          type="button"
          onClick={() => setShowMobileModal(true)}
          className="fixed top-2.5 right-3 z-50 bg-[#1E1424]/90 backdrop-blur-md text-[#FFF9EF] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#C59B7D]/40 shadow-lg flex items-center gap-1 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[13px] text-[#C59B7D]">smartphone</span>
          <span>Get App</span>
        </button>

        {/* Global Toast */}
        {showSuccessToast && (
          <div className="fixed top-4 left-4 right-16 z-50 bg-[#1E1424] text-white border border-[#C59B7D]/40 px-3 py-2 rounded-xl shadow-2xl flex items-center justify-between text-xs animate-fade-in font-sans">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">{showSuccessToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-stone-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Screen */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {renderCurrentMobileScreen()}
        </div>

        <MobileAppModal isOpen={showMobileModal} onClose={() => setShowMobileModal(false)} />
      </div>
    );
  }

  // DESKTOP EXPERIENCE: Choice of Full 5-Screens Artboard Canvas or Centered Device Simulator
  return (
    <div className="min-h-screen bg-[#0d0a10] text-stone-100 p-4 md:p-8 flex flex-col font-sans selection:bg-[#C59B7D]/30 selection:text-white">
      {/* Toast Alert */}
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E1424] text-white border border-[#C59B7D]/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{showSuccessToast}</span>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Showcase Header */}
      <header className="max-w-7xl mx-auto w-full mb-6 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium tracking-wide uppercase mb-3 border border-purple-500/20">
            <span className="material-symbols-outlined text-sm">storefront</span>
            Owner & Operations OS Flow • 5 Screens
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Aura Partner OS — Salon Management
          </h1>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl font-sans">
            Complete enterprise operational suite for salon owners and managers: Partner Registration,
            Operations Dashboard, Multi-Stylist Daily Timeline, POS Counter Checkout, and Client CRM Roster.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-stone-900/90 border border-white/10 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setDisplayMode('showcase')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                displayMode === 'showcase'
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All 5 Screens Canvas
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('device')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                displayMode === 'device'
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Interactive Device
            </button>
          </div>

          {/* Get APK / Install Button */}
          <button
            type="button"
            onClick={() => setShowMobileModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C59B7D] hover:bg-[#b88c6e] text-[#1E1424] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-base">android</span>
            <span>Get Mobile App (APK &amp; iOS)</span>
          </button>

          <span className="text-xs text-stone-400 bg-stone-900/80 px-3 py-2 rounded-xl border border-white/5 flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block animate-pulse" />
            Haute Tactile Minimal Token Grid
          </span>
        </div>
      </header>

      {/* APK / PWA Install Modal */}
      <MobileAppModal isOpen={showMobileModal} onClose={() => setShowMobileModal(false)} />

      {/* Screen Navigation Quick Bar (in Interactive Device mode) */}
      {displayMode === 'device' && (
        <div className="max-w-md mx-auto w-full mb-6 flex items-center justify-between bg-stone-900/70 border border-white/10 p-1.5 rounded-2xl">
          {[
            { id: 'onboarding', label: '1. Onboarding' },
            { id: 'operations', label: '2. Pulse' },
            { id: 'timeline', label: '3. Timeline' },
            { id: 'checkout', label: '4. Checkout' },
            { id: 'crm', label: '5. CRM' },
          ].map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setActiveDeviceScreen(sc.id as any);
                if (sc.id === 'onboarding') setActiveTab('setup');
                else if (sc.id === 'operations') setActiveTab('pulse');
                else if (sc.id === 'timeline') setActiveTab('timeline');
                else if (sc.id === 'checkout') setActiveTab('checkout');
                else if (sc.id === 'crm') setActiveTab('crm');
              }}
              className={`px-2.5 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                activeDeviceScreen === sc.id
                  ? 'bg-white text-[#1E1424] font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* Canvas View: All 5 Screens Horizontally (exact match with user image) */}
      {displayMode === 'showcase' ? (
        <main className="max-w-[100vw] overflow-x-auto pb-12 pt-2 luxury-scrollbar">
          <div className="flex items-start gap-8 min-w-max px-4">
            {/* SCREEN 1: PARTNER ONBOARDING & REGISTRATION */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-[390px] mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-xs font-bold font-sans">
                    1
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 font-sans">
                    Onboarding
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">Partner Registration</span>
              </div>

              <div className="mobile-device-frame">
                <OnboardingScreen
                  onSuccess={() => {
                    setActiveTab('pulse');
                  }}
                />
              </div>
            </div>

            {/* SCREEN 2: OPERATIONS & REVENUE DASHBOARD */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-[390px] mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-xs font-bold font-sans">
                    2
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 font-sans">
                    Operations
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">Executive Pulse</span>
              </div>

              <div className="mobile-device-frame">
                <OperationsScreen
                  onNavigateToTimeline={() => {
                    const el = document.getElementById('screen-3-marker');
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                  }}
                  onNavigateToCheckout={() => {
                    const el = document.getElementById('screen-4-marker');
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                  }}
                />
              </div>
            </div>

            {/* SCREEN 3: DAILY SCHEDULE & STYLIST TIMELINE */}
            <div id="screen-3-marker" className="flex flex-col items-center">
              <div className="flex items-center justify-between w-[390px] mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-xs font-bold font-sans">
                    3
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 font-sans">
                    Timeline
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">Multi-Stylist Grid</span>
              </div>

              <div className="mobile-device-frame">
                <TimelineScreen
                  onSelectSlot={(slot) => {
                    if (slot.clientName.includes('Ananya')) {
                      const el = document.getElementById('screen-4-marker');
                      el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                    }
                  }}
                />
              </div>
            </div>

            {/* SCREEN 4: APPOINTMENT DETAILS & POS CHECKOUT */}
            <div id="screen-4-marker" className="flex flex-col items-center">
              <div className="flex items-center justify-between w-[390px] mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-xs font-bold font-sans">
                    4
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 font-sans">
                    Checkout
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">Docket & Settlement</span>
              </div>

              <div className="mobile-device-frame">
                <CheckoutScreen
                  onBack={() => {
                    const el = document.getElementById('screen-3-marker');
                    el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                  }}
                  onComplete={() => {
                    setActiveTab('pulse');
                  }}
                />
              </div>
            </div>

            {/* SCREEN 5: CLIENT DIRECTORY & STAFF ROSTER */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-[390px] mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-xs font-bold font-sans">
                    5
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 font-sans">
                    Directory
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">CRM & Staff</span>
              </div>

              <div className="mobile-device-frame">
                <DirectoryScreen />
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Single Native Phone Device View for Desktop Testing */
        <main className="flex-1 flex items-center justify-center pb-8">
          <div className="mobile-device-frame shadow-2xl">
            {renderCurrentMobileScreen()}
          </div>
        </main>
      )}

      {/* Footer info */}
      <footer className="text-center text-stone-500 text-xs py-4 border-t border-white/5 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Aura Partner OS © 2025 • Haute Salon & Master Stylist Enterprise Suite</span>
        <div className="flex items-center gap-4 text-stone-400">
          <span>Obsidian Plum (#1E1424)</span>
          <span>•</span>
          <span>Porcelain Ivory (#FFF9EF)</span>
          <span>•</span>
          <span>Muted Bronze (#C59B7D)</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <SalonAppContent />
    </SalonProvider>
  );
}
