import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { DeviceTopBar } from '../components/DeviceTopBar';
import { BottomNav } from '../components/BottomNav';
import { ClientProfile } from '../types/salon';

interface DirectoryScreenProps {
  onSelectClient?: (client: ClientProfile) => void;
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ onSelectClient }) => {
  const {
    clients,
    searchQuery,
    setSearchQuery,
    bookNextAppointment,
    selectedClientModal,
    setSelectedClientModal,
  } = useSalon();

  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.vipTier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#fff9ef] text-[#1E1424] overflow-y-auto luxury-scrollbar relative">
      <DeviceTopBar islandText="CRM Roster" />

      {/* Header */}
      <div className="px-5 py-3 border-b border-[#1E1424]/10 bg-[#fff9ef] flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div>
          <h1 className="font-sans text-[20px] font-bold text-[#1E1424] leading-tight">
            Client CRM & Roster
          </h1>
          <span className="text-[11px] text-[#1E1424]/60">1,240 Registered Guests</span>
        </div>
        <button
          type="button"
          onClick={() => setShowAddGuestModal(true)}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E1424] shadow-xs border border-[#1E1424]/10 hover:bg-stone-50 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
        </button>
      </div>

      <div className="px-5 py-3 space-y-4 flex-1 font-sans">
        {/* Search bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#1E1424]/40 text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or VIP tier..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#1E1424]/10 text-[12px] text-[#1E1424] placeholder-[#1E1424]/40 focus:outline-none focus:ring-1 focus:ring-[#C59B7D] shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Stylist utilization list */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[15px] font-bold text-[#1E1424]">Stylist Workload Today</h2>
            <button
              type="button"
              onClick={() => {}}
              className="text-[11px] text-amber-900 font-bold hover:underline cursor-pointer"
            >
              Manage Shifts ›
            </button>
          </div>

          {/* Stylist 1: Aarav Mehta */}
          <div className="p-3 rounded-2xl bg-white border border-[#1E1424]/10 mb-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AM
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#1E1424]">Aarav Mehta</h3>
                  <span className="text-[10px] text-amber-900 font-semibold block">
                    Master Art Director
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold text-[#1E1424]">5 / 6 Slots</span>
                <span className="text-[10px] text-emerald-700 block font-bold">92% Utilized</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="w-[92%] h-full bg-[#1E1424] rounded-full" />
            </div>
          </div>

          {/* Stylist 2: Rhea Sen */}
          <div className="p-3 rounded-2xl bg-white border border-[#1E1424]/10 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  RS
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#1E1424]">Rhea Sen</h3>
                  <span className="text-[10px] text-purple-900 font-semibold block">
                    Senior Colorist
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold text-[#1E1424]">4 / 6 Slots</span>
                <span className="text-[10px] text-stone-600 block font-bold">66% Utilized</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="w-[66%] h-full bg-amber-900 rounded-full" />
            </div>
          </div>
        </div>

        {/* VIP Guest Directory cards */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[15px] font-bold text-[#1E1424]">Frequent VIP Dossiers</h2>
            <span className="text-[11px] text-[#1E1424]/60">
              View All ({filteredClients.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClientModal(client);
                  if (onSelectClient) onSelectClient(client);
                }}
                className="p-3 rounded-2xl bg-white border border-[#1E1424]/10 flex items-center justify-between shadow-xs hover:border-[#1E1424]/25 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${client.avatarBg} ${client.avatarText} flex items-center justify-center font-bold text-xs shadow-xs`}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[13px] font-bold text-[#1E1424]">{client.name}</h3>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900">
                        {client.vipTier.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#1E1424]/60 block">
                      Lifetime spend: ₹{client.lifetimeSpend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    bookNextAppointment(client);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1E1424] text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Book Next
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Dossier Detail Modal */}
      {selectedClientModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl border-t border-[#1E1424]/15 font-sans">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${selectedClientModal.avatarBg} ${selectedClientModal.avatarText} flex items-center justify-center font-bold text-base shadow-xs`}
                >
                  {selectedClientModal.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-[#1E1424]">
                      {selectedClientModal.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {selectedClientModal.vipTier}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{selectedClientModal.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClientModal(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-2.5 my-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Lifetime Spend:</span>
                <span className="font-bold text-[#1E1424]">
                  ₹{selectedClientModal.lifetimeSpend.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Completed Visits:</span>
                <span className="font-bold text-[#1E1424]">
                  {selectedClientModal.totalVisits} sessions
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Preferred Stylist:</span>
                <span className="font-bold text-[#1E1424]">
                  {selectedClientModal.favoriteStylist}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">VIP Concierge Notes:</span>
                <p className="text-[#1E1424] font-medium leading-relaxed">
                  {selectedClientModal.preferenceNote}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  bookNextAppointment(selectedClientModal);
                  setSelectedClientModal(null);
                }}
                className="flex-1 py-3 bg-[#1E1424] text-white rounded-xl text-xs font-bold hover:bg-[#2C1E35] cursor-pointer"
              >
                Reserve Next Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-stone-200 font-sans">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-[#1E1424]">Register New Client</h3>
              <button
                type="button"
                onClick={() => setShowAddGuestModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGuestName.trim()) return;
                setShowAddGuestModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shalini Roy"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98..."
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1E1424] rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav currentScreen="crm" />
    </div>
  );
};
