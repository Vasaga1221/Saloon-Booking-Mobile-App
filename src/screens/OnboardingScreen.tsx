import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { DeviceTopBar } from '../components/DeviceTopBar';
import { AtelierType } from '../types/salon';

interface OnboardingScreenProps {
  onSuccess?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onSuccess }) => {
  const { salonInfo, updateSalonInfo, setActiveTab } = useSalon();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('register');
  const [ownerName, setOwnerName] = useState(salonInfo.ownerName);
  const [executiveRole, setExecutiveRole] = useState(salonInfo.executiveRole);
  const [phone, setPhone] = useState(salonInfo.phone);
  const [salonName, setSalonName] = useState(salonInfo.salonName);
  const [city, setCity] = useState(salonInfo.city);
  const [atelierType, setAtelierType] = useState<AtelierType>(salonInfo.atelierType);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const roles = [
    'Creative Director & Salon Owner',
    'General Operations Manager',
    'Master Stylist & Founder',
    'Executive Spa Director',
  ];

  const cities = [
    'Bandra West, Mumbai',
    'Colaba, Mumbai',
    'Juhu, Mumbai',
    'Indiranagar, Bengaluru',
    'Mehrauli, New Delhi',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonInfo({
      ownerName,
      executiveRole,
      phone,
      salonName,
      city,
      atelierType,
      isRegistered: true,
    });
    if (onSuccess) {
      onSuccess();
    } else {
      setActiveTab('pulse');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fff9ef] text-[#1E1424] overflow-y-auto luxury-scrollbar">
      <DeviceTopBar islandText="Aura OS" />

      <div className="px-5 pt-3 pb-8 flex-1 flex flex-col">
        {/* Masthead */}
        <div className="text-center my-2">
          <span className="px-3 py-1 rounded-full border border-[#1E1424]/15 text-[#1E1424] text-[10px] font-sans font-bold uppercase tracking-widest inline-block bg-white/50 mb-2">
            SALON PARTNER PORTAL
          </span>
          <h1 className="font-serif text-[28px] md:text-[30px] font-bold text-[#1E1424] leading-tight">
            Aura Partner OS
          </h1>
          <p className="font-sans text-[12px] text-[#1E1424]/70 mt-1 max-w-[280px] mx-auto">
            Bespoke atelier ecosystem for haute salons & master stylists
          </p>
        </div>

        {/* Segmented toggle */}
        <div className="bg-[#1E1424]/5 p-1 rounded-2xl flex items-center mb-3.5 border border-[#1E1424]/10">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-xl font-sans text-[13px] transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white font-bold text-[#1E1424] shadow-xs'
                : 'font-medium text-[#1E1424]/60 hover:text-[#1E1424]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-xl font-sans text-[13px] transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white font-bold text-[#1E1424] shadow-xs'
                : 'font-medium text-[#1E1424]/60 hover:text-[#1E1424]'
            }`}
          >
            Register Salon
          </button>
        </div>

        {/* Step indicator */}
        <div className="p-3 bg-white rounded-2xl border border-[#1E1424]/10 mb-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#1E1424] text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <h2 className="font-sans text-[13px] font-bold text-[#1E1424]">Atelier Registration</h2>
              <p className="font-sans text-[11px] text-[#1E1424]/60">Step 1 of 2: Owner profile & space</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans">
            VIP ACCESS
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 flex-1 font-sans">
          {/* Owner info */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#1E1424]/10 space-y-2.5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Business Owner Information
            </span>

            <div>
              <label htmlFor="owner-name-input" className="text-[11px] text-[#1E1424]/70 block mb-1">
                Owner Full Name *
              </label>
              <input
                id="owner-name-input"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-[#1E1424]/15 text-[13px] font-medium text-[#1E1424] focus:outline-none focus:ring-1 focus:ring-[#C59B7D]"
                required
              />
            </div>

            <div className="relative">
              <label className="text-[11px] text-[#1E1424]/70 block mb-1">Executive Role</label>
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-[#1E1424]/15 text-[13px] font-medium text-[#1E1424] flex justify-between items-center text-left cursor-pointer"
              >
                <span>{executiveRole}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              {showRoleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#1E1424]/15 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setExecutiveRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] hover:bg-stone-50 text-[#1E1424] font-medium"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="direct-contact-input" className="text-[11px] text-[#1E1424]/70 block mb-1">
                Direct Contact Number *
              </label>
              <input
                id="direct-contact-input"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-[#1E1424]/15 text-[13px] font-medium text-[#1E1424] focus:outline-none focus:ring-1 focus:ring-[#C59B7D]"
                required
              />
            </div>
          </div>

          {/* Atelier Specs */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#1E1424]/10 space-y-2.5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Atelier & Space Details
            </span>

            <div>
              <label htmlFor="salon-name-input" className="text-[11px] text-[#1E1424]/70 block mb-1">
                Salon / Atelier Name *
              </label>
              <input
                id="salon-name-input"
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-[#1E1424]/15 text-[13px] font-medium text-[#1E1424] focus:outline-none focus:ring-1 focus:ring-[#C59B7D]"
                required
              />
            </div>

            <div className="relative">
              <label className="text-[11px] text-[#1E1424]/70 block mb-1">City & Locality *</label>
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-[#1E1424]/15 text-[13px] font-medium text-[#1E1424] flex justify-between items-center text-left cursor-pointer"
              >
                <span>{city}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#1E1424]/15 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                  {cities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setShowCityDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] hover:bg-stone-50 text-[#1E1424] font-medium"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAtelierType('luxury_spa')}
                className={`p-2 rounded-xl text-center cursor-pointer transition-all ${
                  atelierType === 'luxury_spa'
                    ? 'bg-[#1E1424] text-white shadow-sm ring-2 ring-[#1E1424]'
                    : 'border border-[#1E1424]/20 text-[#1E1424] bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <span className="text-[11px] font-bold block">Luxury Salon & Spa</span>
                <span
                  className={`text-[9px] block mt-0.5 ${
                    atelierType === 'luxury_spa' ? 'text-stone-300' : 'text-[#1E1424]/60'
                  }`}
                >
                  Full Service
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAtelierType('boutique_hair')}
                className={`p-2 rounded-xl text-center cursor-pointer transition-all ${
                  atelierType === 'boutique_hair'
                    ? 'bg-[#1E1424] text-white shadow-sm ring-2 ring-[#1E1424]'
                    : 'border border-[#1E1424]/20 text-[#1E1424] bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <span className="text-[11px] font-bold block">Boutique Hair Studio</span>
                <span
                  className={`text-[9px] block mt-0.5 ${
                    atelierType === 'boutique_hair' ? 'text-stone-300' : 'text-[#1E1424]/60'
                  }`}
                >
                  Hair & Color Focus
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1E1424] hover:bg-[#2C1E35] text-white rounded-xl font-sans text-[14px] font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Register Atelier & Setup Business
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          <div className="text-center pt-2">
            <span className="font-sans text-[11px] text-[#1E1424]/60">
              Looking to book an appointment?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('pulse')}
                className="font-bold underline text-amber-900 cursor-pointer"
              >
                Switch to Customer App
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
