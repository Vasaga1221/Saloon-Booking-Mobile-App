import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SalonInfo,
  ChairStation,
  TimelineSlot,
  Stylist,
  DocketData,
  DocketItem,
  ClientProfile
} from '../types/salon';

interface SalonContextType {
  salonInfo: SalonInfo;
  updateSalonInfo: (info: Partial<SalonInfo>) => void;
  activeTab: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup';
  setActiveTab: (tab: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup') => void;
  displayMode: 'showcase' | 'device';
  setDisplayMode: (mode: 'showcase' | 'device') => void;

  // KPIs
  todayRevenue: number;
  posPending: number;
  appointmentsCount: {
    total: number;
    done: number;
    active: number;
    next: number;
  };
  occupancyPercent: number;
  vipGuestsCount: number;

  // Stations
  stations: ChairStation[];
  startStationService: (stationId: string) => void;

  // Timeline
  timelineSlots: TimelineSlot[];
  selectedStylistFilter: string;
  setSelectedStylistFilter: (stylistId: string) => void;
  addWalkIn: (walkIn: Omit<TimelineSlot, 'id'>) => void;

  // Stylists
  stylists: Stylist[];

  // Docket / POS
  docket: DocketData;
  addDocketItem: (item: Omit<DocketItem, 'id'>) => void;
  settleDocket: (method: 'upi' | 'card' | 'cash') => void;
  resetDocket: () => void;

  // Clients
  clients: ClientProfile[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedClientModal: ClientProfile | null;
  setSelectedClientModal: (client: ClientProfile | null) => void;
  bookNextAppointment: (client: ClientProfile) => void;

  // Notifications
  notificationCount: number;
  showSuccessToast: string | null;
  setSuccessToast: (msg: string | null) => void;
}

const initialSalonInfo: SalonInfo = {
  ownerName: 'Genevieve Beaumont',
  executiveRole: 'Creative Director & Salon Owner',
  phone: '+91 9820184920',
  salonName: 'Maison de Beauté Luxe',
  city: 'Bandra West, Mumbai',
  atelierType: 'luxury_spa',
  isRegistered: true,
};

const initialStations: ChairStation[] = [
  {
    id: 'st-02',
    stationNumber: '02',
    status: 'in_service',
    clientName: 'Ananya Sharma',
    serviceName: 'Balayage & Gloss • Stylist: Aarav',
    stylistName: 'Aarav Mehta',
    price: 7500,
    elapsedMinutes: 45,
    totalMinutes: 150,
    tagText: 'STATION 02 • IN SERVICE',
  },
  {
    id: 'st-04',
    stationNumber: '04',
    status: 'arrived',
    clientName: 'Vikram Singhania',
    serviceName: 'Royal Beard Sculpt & Cut',
    stylistName: 'Kabir D.',
    price: 3200,
    elapsedMinutes: 0,
    totalMinutes: 45,
    tagText: 'STATION 04 • ARRIVED (LOUNGE)',
  },
];

const initialStylists: Stylist[] = [
  {
    id: 'all',
    name: 'All Stylists (4)',
    shortCode: 'ALL',
    role: 'Full Floor Roster',
    activeSlots: 15,
    totalSlots: 18,
    avatarBg: 'bg-[#1E1424]',
    avatarText: 'text-white',
    specialty: 'Master Roster',
  },
  {
    id: 'aarav',
    name: 'Aarav M.',
    shortCode: 'AM',
    role: 'Master Art Director',
    activeSlots: 5,
    totalSlots: 6,
    avatarBg: 'bg-amber-950',
    avatarText: 'text-amber-100',
    specialty: 'Precision Cut & Balayage',
  },
  {
    id: 'rhea',
    name: 'Rhea Sen',
    shortCode: 'RS',
    role: 'Senior Colorist',
    activeSlots: 4,
    totalSlots: 6,
    avatarBg: 'bg-purple-900',
    avatarText: 'text-purple-100',
    specialty: 'Caviar Scalp Protocol & Highlights',
  },
  {
    id: 'tara',
    name: 'Tara K.',
    shortCode: 'TK',
    role: 'Lead Esthetician',
    activeSlots: 3,
    totalSlots: 5,
    avatarBg: 'bg-stone-700',
    avatarText: 'text-stone-100',
    specialty: 'Skin Glow & Spa Therapies',
  },
  {
    id: 'kabir',
    name: 'Kabir D.',
    shortCode: 'KD',
    role: 'Artisan Barber',
    activeSlots: 3,
    totalSlots: 4,
    avatarBg: 'bg-emerald-900',
    avatarText: 'text-emerald-100',
    specialty: 'Beard Sculpt & Fade Artistry',
  },
];

const initialTimelineSlots: TimelineSlot[] = [
  {
    id: 'slot-1',
    time: '01:00 PM',
    station: 'Station 1 • Aarav M.',
    stylistId: 'aarav',
    stylistName: 'Aarav M.',
    clientName: 'Ananya Sharma',
    serviceName: 'Balayage & Gloss (150m)',
    durationMinutes: 150,
    status: 'in_chair',
    statusLabel: 'In-Chair',
  },
  {
    id: 'slot-2',
    time: '02:00 PM',
    station: 'Station 3 • Rhea Sen',
    stylistId: 'rhea',
    stylistName: 'Rhea Sen',
    clientName: 'Meera Kapoor',
    serviceName: 'Caviar Scalp Protocol (60m)',
    durationMinutes: 60,
    status: 'checked_in',
    statusLabel: 'Checked In',
  },
  {
    id: 'slot-3',
    time: '03:00 PM',
    station: 'Station 2 • Tara K.',
    stylistId: 'tara',
    stylistName: 'Tara K.',
    clientName: 'Sanitization & Rest Break',
    serviceName: '30 min block',
    durationMinutes: 30,
    status: 'break',
    statusLabel: 'Break',
    isBreak: true,
  },
  {
    id: 'slot-4',
    time: '03:30 PM',
    station: 'Station 1 • Aarav M.',
    stylistId: 'aarav',
    stylistName: 'Aarav M.',
    clientName: 'Rohan Varma',
    serviceName: 'Precision Fade & Beard Spa',
    durationMinutes: 45,
    status: 'confirmed',
    statusLabel: 'Confirmed',
  },
];

const initialDocket: DocketData = {
  stationNumber: '02',
  clientName: 'Ananya Sharma',
  clientInitials: 'AS',
  vipTier: 'GOLD VIP',
  phone: '+91 98765 43210',
  visitCount: 14,
  notes: '☕ Preference: Sensitive scalp treatment protocol; Sparkling water with lime.',
  items: [
    {
      id: 'doc-1',
      title: 'Sun-Kissed Balayage & Gloss',
      subtitle: 'Stylist: Aarav Mehta',
      price: 7500,
      isAddOn: false,
    },
    {
      id: 'doc-2',
      title: 'Chair-side Add-on: Scalp Massage',
      subtitle: 'Added during appointment',
      price: 850,
      isAddOn: true,
    },
  ],
  taxRate: 0.18,
  advancePaid: 7850,
  isSettled: false,
};

const initialClients: ClientProfile[] = [
  {
    id: 'cli-1',
    name: 'Ananya Sharma',
    initials: 'AS',
    phone: '+91 98765 43210',
    vipTier: 'GOLD VIP',
    lifetimeSpend: 42500,
    totalVisits: 14,
    favoriteStylist: 'Aarav Mehta',
    lastVisit: 'Today (In Service)',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-900',
    preferenceNote: 'Sensitive scalp treatment protocol; prefers iced green tea or sparkling water with lime.',
  },
  {
    id: 'cli-2',
    name: 'Vikram Singhania',
    initials: 'VS',
    phone: '+91 99304 88102',
    vipTier: 'PLATINUM VIP',
    lifetimeSpend: 28900,
    totalVisits: 9,
    favoriteStylist: 'Kabir D.',
    lastVisit: 'Today (Lounge)',
    avatarBg: 'bg-stone-200',
    avatarText: 'text-[#1E1424]',
    preferenceNote: 'Low-fade razor finish; always books private grooming suite.',
  },
  {
    id: 'cli-3',
    name: 'Meera Kapoor',
    initials: 'MK',
    phone: '+91 98112 30491',
    vipTier: 'GOLD VIP',
    lifetimeSpend: 34200,
    totalVisits: 11,
    favoriteStylist: 'Rhea Sen',
    lastVisit: 'Today (Checked In)',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-900',
    preferenceNote: 'Organic botanical color dyes only; scalp hydration serum finish.',
  },
  {
    id: 'cli-4',
    name: 'Rohan Varma',
    initials: 'RV',
    phone: '+91 97664 12093',
    vipTier: 'SILVER VIP',
    lifetimeSpend: 18400,
    totalVisits: 6,
    favoriteStylist: 'Aarav Mehta',
    lastVisit: '2 weeks ago',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-900',
    preferenceNote: 'Precision beard edging with hot towel eucalyptus steam.',
  },
  {
    id: 'cli-5',
    name: 'Natasha Poonawalla',
    initials: 'NP',
    phone: '+91 98200 44812',
    vipTier: 'PLATINUM VIP',
    lifetimeSpend: 86000,
    totalVisits: 22,
    favoriteStylist: 'Aarav Mehta',
    lastVisit: '10 days ago',
    avatarBg: 'bg-amber-200',
    avatarText: 'text-amber-950',
    preferenceNote: 'High fashion editorial styling; private back entrance access required.',
  },
];

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [salonInfo, setSalonInfo] = useState<SalonInfo>(initialSalonInfo);
  const [activeTab, setActiveTab] = useState<'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup'>('pulse');
  const [displayMode, setDisplayMode] = useState<'showcase' | 'device'>('showcase');

  // KPIs
  const [todayRevenue, setTodayRevenue] = useState<number>(48650);
  const [posPending, setPosPending] = useState<number>(12400);
  const [appointmentsCount, setAppointmentsCount] = useState({
    total: 24,
    done: 14,
    active: 6,
    next: 4,
  });
  const [occupancyPercent, setOccupancyPercent] = useState<number>(85);
  const [vipGuestsCount, setVipGuestsCount] = useState<number>(8);

  // Stations & Timeline
  const [stations, setStations] = useState<ChairStation[]>(initialStations);
  const [timelineSlots, setTimelineSlots] = useState<TimelineSlot[]>(initialTimelineSlots);
  const [selectedStylistFilter, setSelectedStylistFilter] = useState<string>('all');
  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);

  // Docket & Settlement
  const [docket, setDocket] = useState<DocketData>(initialDocket);

  // Clients
  const [clients, setClients] = useState<ClientProfile[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClientModal, setSelectedClientModal] = useState<ClientProfile | null>(null);

  // Toast
  const [showSuccessToast, setSuccessToast] = useState<string | null>(null);
  const [notificationCount] = useState<number>(3);

  const updateSalonInfo = (info: Partial<SalonInfo>) => {
    setSalonInfo((prev) => ({ ...prev, ...info }));
    setSuccessToast('Atelier settings updated successfully');
  };

  const startStationService = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId) {
          return {
            ...s,
            status: 'in_service',
            tagText: `STATION ${s.stationNumber} • IN SERVICE`,
            elapsedMinutes: 5,
          };
        }
        return s;
      })
    );
    setSuccessToast('Service started for Station 04. Timer engaged.');
  };

  const addWalkIn = (walkIn: Omit<TimelineSlot, 'id'>) => {
    const newId = `slot-${Date.now()}`;
    const newSlot: TimelineSlot = {
      ...walkIn,
      id: newId,
    };
    setTimelineSlots((prev) => [...prev, newSlot]);
    setAppointmentsCount((prev) => ({
      ...prev,
      total: prev.total + 1,
      active: prev.active + 1,
    }));
    setSuccessToast(`Walk-in confirmed for ${walkIn.clientName}`);
  };

  const addDocketItem = (item: Omit<DocketItem, 'id'>) => {
    const newItem: DocketItem = {
      ...item,
      id: `doc-${Date.now()}`,
    };
    setDocket((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSuccessToast(`Added ${item.title} to Station ${docket.stationNumber} docket`);
  };

  const settleDocket = (method: 'upi' | 'card' | 'cash') => {
    const subtotal = docket.items.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.round(subtotal * docket.taxRate);
    const total = subtotal + tax;
    const balanceDue = Math.max(0, total - docket.advancePaid);

    setDocket((prev) => ({
      ...prev,
      isSettled: true,
      settledAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: method,
    }));

    setTodayRevenue((prev) => prev + balanceDue);
    setPosPending((prev) => Math.max(0, prev - balanceDue));
    setAppointmentsCount((prev) => ({
      ...prev,
      done: prev.done + 1,
      active: Math.max(0, prev.active - 1),
    }));

    setSuccessToast(`Settled ₹${balanceDue.toLocaleString('en-IN')} via ${method.toUpperCase()}! Docket closed.`);
  };

  const resetDocket = () => {
    setDocket(initialDocket);
  };

  const bookNextAppointment = (client: ClientProfile) => {
    const newSlot: TimelineSlot = {
      id: `slot-${Date.now()}`,
      time: '04:30 PM',
      station: 'Station 2 • Rhea Sen',
      stylistId: 'rhea',
      stylistName: 'Rhea Sen',
      clientName: client.name,
      serviceName: 'Express Blowout & Refresh',
      durationMinutes: 45,
      status: 'confirmed',
      statusLabel: 'Confirmed',
    };
    setTimelineSlots((prev) => [...prev, newSlot]);
    setSuccessToast(`Reserved next slot for ${client.name} with Rhea Sen at 04:30 PM`);
  };

  return (
    <SalonContext.Provider
      value={{
        salonInfo,
        updateSalonInfo,
        activeTab,
        setActiveTab,
        displayMode,
        setDisplayMode,
        todayRevenue,
        posPending,
        appointmentsCount,
        occupancyPercent,
        vipGuestsCount,
        stations,
        startStationService,
        timelineSlots,
        selectedStylistFilter,
        setSelectedStylistFilter,
        addWalkIn,
        stylists,
        docket,
        addDocketItem,
        settleDocket,
        resetDocket,
        clients,
        searchQuery,
        setSearchQuery,
        selectedClientModal,
        setSelectedClientModal,
        bookNextAppointment,
        notificationCount,
        showSuccessToast,
        setSuccessToast,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
