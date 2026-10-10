import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { DeviceTopBar } from '../components/DeviceTopBar';
import { BottomNav } from '../components/BottomNav';

interface OperationsScreenProps {
  onNavigateToTimeline?: () => void;
  onNavigateToCheckout?: () => void;
}

export const OperationsScreen: React.FC<OperationsScreenProps> = ({
  onNavigateToTimeline,
  onNavigateToCheckout,
}) => {
  const {
    salonInfo,
    todayRevenue,
    posPending,
    appointmentsCount,
    occupancyPercent,
    vipGuestsCount,
    stations,
    startStationService,
    setActiveTab,
    notificationCount,
  } = useSalon();

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    { id: 1, text: 'Meera Kapoor checked in for Caviar Scalp Protocol', time: '5m ago' },
    { id: 2, text: 'Station 02 add-on requested: Scalp massage approved', time: '18m ago' },
    { id: 3, text: 'Rohan Varma confirmed for 03:30 PM appointment', time: '42m ago' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fff9ef] text-[#1E1424] overflow-y-auto luxury-scrollbar relative">
      <DeviceTopBar islandText="Live Pulse" />

      {/* Top Header */}
      <div className="px-5 py-3 border-b border-[#1E1424]/10 bg-[#fff9ef] flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            GB
          </div>
          <div>
            <h1 className="font-sans text-[13px] font-bold text-[#1E1424] truncate max-w-[170px]">
              {salonInfo.salonName.split(' ')[0]} {salonInfo.salonName.split(' ')[1] || 'de Beauté'}
            </h1>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
              Live Operations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Open POS Checkout"
            onClick={() => {
              if (onNavigateToCheckout) {
                onNavigateToCheckout();
              } else {
                setActiveTab('checkout');
              }
            }}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E1424] shadow-xs border border-[#1E1424]/10 hover:bg-stone-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">point_of_sale</span>
          </button>
          
          <div className="relative">
            <button
              type="button"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E1424] shadow-xs border border-[#1E1424]/10 hover:bg-stone-50 cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-base">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-10 w-64 bg-white border border-[#1E1424]/15 rounded-2xl shadow-xl p-3 z-50 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100 mb-2">
                  <span className="text-xs font-bold text-[#1E1424]">Floor Alerts</span>
                  <span className="text-[10px] text-amber-900 font-semibold">3 Unread</span>
                </div>
                <div className="space-y-2">
                  {notificationsList.map((n) => (
                    <div key={n.id} className="text-[11px] p-2 bg-stone-50 rounded-xl">
                      <p className="text-[#1E1424] font-medium leading-tight">{n.text}</p>
                      <span className="text-[9px] text-[#1E1424]/50 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-3 space-y-4 flex-1">
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-900 block tracking-wider">
              Thursday, Oct 16
            </span>
            <h2 className="font-sans text-[24px] font-bold text-[#1E1424] leading-tight">
              Executive Pulse
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-sans">
            +18.4% vs last wk
          </span>
        </div>

        {/* KPI Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Today's Revenue */}
          <div className="p-3.5 rounded-2xl bg-[#1E1424] text-white shadow-xs">
            <span className="text-[10px] uppercase font-bold text-stone-300 block tracking-wider">
              Today's Revenue
            </span>
            <div className="font-sans text-[26px] font-bold text-white tabular-nums mt-0.5">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-200 mt-1 flex items-center gap-1 font-medium">
              <span>₹{posPending.toLocaleString('en-IN')} POS Pending</span>
            </div>
          </div>

          {/* Appointments */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#1E1424]/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#1E1424]/60 block tracking-wider">
              Appointments
            </span>
            <div className="font-sans text-[26px] font-bold text-[#1E1424] tabular-nums mt-0.5">
              {appointmentsCount.total}
            </div>
            <div className="text-[10px] text-[#1E1424]/70 mt-1">
              {appointmentsCount.done} Done • {appointmentsCount.active} Active • {appointmentsCount.next} Next
            </div>
          </div>

          {/* Chair Occupancy */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#1E1424]/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#1E1424]/60 block tracking-wider">
              Chair Occupancy
            </span>
            <div className="font-sans text-[22px] font-bold text-emerald-700 tabular-nums mt-0.5">
              {occupancyPercent}%
            </div>
            <div className="text-[10px] text-[#1E1424]/60 mt-1">
              6 of 7 Stations Full
            </div>
          </div>

          {/* VIP Guests */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#1E1424]/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#1E1424]/60 block tracking-wider">
              VIP Guests
            </span>
            <div className="font-sans text-[22px] font-bold text-[#1E1424] tabular-nums mt-0.5">
              {vipGuestsCount}
            </div>
            <div className="text-[10px] text-amber-900 font-semibold mt-1">
              Gold & Platinum Tier
            </div>
          </div>
        </div>

        {/* Live Chair Tracker */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-sans text-[16px] font-bold text-[#1E1424]">Live Chair Tracker</h3>
            <button
              type="button"
              onClick={() => {
                if (onNavigateToTimeline) {
                  onNavigateToTimeline();
                } else {
                  setActiveTab('timeline');
                }
              }}
              className="text-[11px] text-amber-900 font-bold hover:underline cursor-pointer"
            >
              Timeline View ›
            </button>
          </div>

          {/* Chair 1: Station 02 */}
          <div
            onClick={() => {
              if (onNavigateToCheckout) {
                onNavigateToCheckout();
              } else {
                setActiveTab('checkout');
              }
            }}
            className="p-3 rounded-2xl bg-white border border-[#1E1424]/15 mb-2 shadow-xs hover:border-[#1E1424]/30 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold font-sans">
                  STATION 02 • IN SERVICE
                </span>
                <h4 className="font-sans text-[14px] font-bold text-[#1E1424] mt-1">
                  Ananya Sharma
                </h4>
                <p className="font-sans text-[11px] text-[#1E1424]/70">
                  Balayage & Gloss • Stylist: Aarav
                </p>
              </div>
              <span className="font-sans text-[12px] font-bold text-[#1E1424]">
                ₹7,500
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] font-sans text-[#1E1424]/60 mb-1">
                <span>45 min elapsed</span>
                <span>105 min remaining</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="w-[30%] h-full bg-[#1E1424] rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Chair 2: Station 04 */}
          {stations.find((s) => s.id === 'st-04') && (
            <div className="p-3 rounded-2xl bg-[#faf5ec] border border-[#1E1424]/10 flex items-center justify-between shadow-xs">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-sans ${
                    stations.find((s) => s.id === 'st-04')?.status === 'in_service'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  {stations.find((s) => s.id === 'st-04')?.tagText}
                </span>
                <h4 className="font-sans text-[13px] font-bold text-[#1E1424] mt-0.5">
                  Vikram Singhania
                </h4>
                <p className="font-sans text-[11px] text-[#1E1424]/60">Royal Beard Sculpt & Cut</p>
              </div>

              {stations.find((s) => s.id === 'st-04')?.status === 'arrived' ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startStationService('st-04');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1E1424] hover:bg-[#2C1E35] text-white font-sans text-[11px] font-bold cursor-pointer transition-all active:scale-95"
                >
                  Start Service
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
                  In Chair
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav
        currentScreen="pulse"
        onNavigate={(tab) => {
          if (tab === 'timeline' && onNavigateToTimeline) onNavigateToTimeline();
          else if (tab === 'checkout' && onNavigateToCheckout) onNavigateToCheckout();
          else setActiveTab(tab);
        }}
      />
    </div>
  );
};
