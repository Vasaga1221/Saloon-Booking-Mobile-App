import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { DeviceTopBar } from '../components/DeviceTopBar';
import { BottomNav } from '../components/BottomNav';
import { TimelineSlot } from '../types/salon';

interface TimelineScreenProps {
  onSelectSlot?: (slot: TimelineSlot) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onSelectSlot }) => {
  const {
    timelineSlots,
    selectedStylistFilter,
    setSelectedStylistFilter,
    stylists,
    addWalkIn,
    setActiveTab,
  } = useSalon();

  const [showAddWalkInModal, setShowAddWalkInModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [serviceName, setServiceName] = useState('Signature Blowout & Style');
  const [stylistId, setStylistId] = useState('aarav');
  const [slotTime, setSlotTime] = useState('04:15 PM');
  const [durationMins, setDurationMins] = useState(45);

  const filteredSlots =
    selectedStylistFilter === 'all'
      ? timelineSlots
      : timelineSlots.filter((slot) => slot.stylistId === selectedStylistFilter);

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const chosenStylist = stylists.find((s) => s.id === stylistId) || stylists[1];

    addWalkIn({
      time: slotTime,
      station: `Station 1 • ${chosenStylist.name}`,
      stylistId: chosenStylist.id,
      stylistName: chosenStylist.name,
      clientName: clientName.trim(),
      serviceName: `${serviceName} (${durationMins}m)`,
      durationMinutes: durationMins,
      status: 'confirmed',
      statusLabel: 'Walk-in Confirmed',
    });

    setClientName('');
    setShowAddWalkInModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fff9ef] text-[#1E1424] overflow-y-auto luxury-scrollbar relative">
      <DeviceTopBar islandText="Timeline" />

      {/* Header */}
      <div className="px-5 py-3 border-b border-[#1E1424]/10 bg-[#fff9ef] flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div>
          <h1 className="font-sans text-[20px] font-bold text-[#1E1424] leading-tight">
            Timeline & Roster
          </h1>
          <span className="text-[11px] text-amber-900 font-semibold">Today • 16 Oct 2025</span>
        </div>
        <button
          type="button"
          onClick={() => setShowAddWalkInModal(true)}
          className="px-3 py-1.5 rounded-xl bg-[#1E1424] hover:bg-[#2C1E35] text-white font-sans text-[12px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span> Add Walk-in
        </button>
      </div>

      {/* Stylist filter tabs */}
      <div className="px-5 py-2.5 flex gap-2 border-b border-[#1E1424]/10 bg-white overflow-x-auto no-scrollbar shrink-0">
        {stylists.map((st) => {
          const isSelected = selectedStylistFilter === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStylistFilter(st.id)}
              className={`px-3 py-1 rounded-xl font-sans text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#1E1424] text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-[#1E1424] font-medium hover:bg-stone-200'
              }`}
            >
              {st.name}
            </button>
          );
        })}
      </div>

      {/* Timeline Schedule Ruler & Blocks */}
      <div className="p-4 space-y-3 flex-1 font-sans">
        {/* Render timeline items */}
        {filteredSlots.map((slot, index) => {
          const isAnanya = slot.clientName.includes('Ananya');
          const isMeera = slot.clientName.includes('Meera');
          const isBreak = slot.isBreak;
          const isRohan = slot.clientName.includes('Rohan');

          let cardStyle = 'bg-stone-50 border-l-4 border-stone-300';
          let badgeStyle = 'bg-stone-200 text-stone-800';

          if (isAnanya) {
            cardStyle = 'bg-amber-50 border-l-4 border-amber-800 shadow-xs';
            badgeStyle = 'bg-amber-200/60 text-amber-900';
          } else if (isMeera) {
            cardStyle = 'bg-purple-50 border-l-4 border-purple-800 shadow-xs';
            badgeStyle = 'bg-purple-200/60 text-purple-900';
          } else if (isBreak) {
            cardStyle = 'bg-stone-100 border-l-4 border-stone-400';
          } else if (isRohan) {
            cardStyle = 'bg-emerald-50 border-l-4 border-emerald-700 shadow-xs';
            badgeStyle = 'bg-emerald-200/60 text-emerald-900';
          }

          return (
            <React.Fragment key={slot.id}>
              {/* If slot is after 01:00 PM, show the current time red marker */}
              {index === 1 && (
                <div className="flex items-center gap-2 pl-6 py-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                  <div className="h-0.5 flex-1 bg-rose-600/40" />
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/40 shrink-0">
                    01:45 PM (Now)
                  </span>
                </div>
              )}

              <div className="flex gap-3 items-start">
                <div className="w-14 text-right text-[11px] font-bold text-[#1E1424]/50 pt-2 shrink-0">
                  {slot.time}
                </div>

                <div
                  onClick={() => {
                    if (isAnanya) {
                      setActiveTab('checkout');
                    } else if (onSelectSlot) {
                      onSelectSlot(slot);
                    }
                  }}
                  className={`flex-1 p-3 rounded-2xl cursor-pointer hover:opacity-95 transition-all ${cardStyle}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85">
                        {slot.station}
                      </span>
                      <h2 className="text-[13px] font-bold text-[#1E1424] mt-0.5">
                        {slot.clientName}
                      </h2>
                      <p className="text-[11px] text-[#1E1424]/70 mt-0.5">
                        {slot.serviceName}
                      </p>
                    </div>

                    {isBreak ? (
                      <span className="material-symbols-outlined text-sm text-stone-500">
                        lock
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeStyle}`}>
                        {slot.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Add Walk-In Modal */}
      {showAddWalkInModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-[#1E1424]/10 font-sans">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-[#1E1424]">Add Walk-in Guest</h3>
              <button
                type="button"
                onClick={() => setShowAddWalkInModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshi Mehta"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#C59B7D]"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Service Requested
                </label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                >
                  <option value="Signature Blowout & Style">Signature Blowout & Style (₹2,500)</option>
                  <option value="Luxury Hair Spa & Mask">Luxury Hair Spa & Mask (₹3,800)</option>
                  <option value="Precision Beard Grooming">Precision Beard Grooming (₹1,500)</option>
                  <option value="Kérastase Caviar Scalp">Kérastase Caviar Scalp (₹4,200)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-stone-600 block mb-1">
                    Assign Stylist
                  </label>
                  <select
                    value={stylistId}
                    onChange={(e) => setStylistId(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                  >
                    <option value="aarav">Aarav M.</option>
                    <option value="rhea">Rhea Sen</option>
                    <option value="tara">Tara K.</option>
                    <option value="kabir">Kabir D.</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-stone-600 block mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalkInModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1E1424] rounded-xl hover:bg-[#2C1E35] cursor-pointer"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav currentScreen="timeline" />
    </div>
  );
};
