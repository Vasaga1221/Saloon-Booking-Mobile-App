export type AtelierType = 'luxury_spa' | 'boutique_hair';

export interface SalonInfo {
  ownerName: string;
  executiveRole: string;
  phone: string;
  salonName: string;
  city: string;
  atelierType: AtelierType;
  isRegistered: boolean;
}

export type AppointmentStatus = 'in_service' | 'in_chair' | 'arrived' | 'checked_in' | 'confirmed' | 'break' | 'completed';

export interface ChairStation {
  id: string;
  stationNumber: string;
  status: 'in_service' | 'arrived' | 'available';
  clientName: string;
  serviceName: string;
  stylistName: string;
  price: number;
  elapsedMinutes: number;
  totalMinutes: number;
  tagText: string;
}

export interface TimelineSlot {
  id: string;
  time: string;
  station: string;
  stylistId: string;
  stylistName: string;
  clientName: string;
  serviceName: string;
  durationMinutes: number;
  status: AppointmentStatus;
  statusLabel: string;
  isBreak?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  shortCode: string;
  role: string;
  activeSlots: number;
  totalSlots: number;
  avatarBg: string;
  avatarText: string;
  specialty: string;
}

export interface DocketItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  isAddOn?: boolean;
}

export interface DocketData {
  stationNumber: string;
  clientName: string;
  clientInitials: string;
  vipTier: 'GOLD VIP' | 'PLATINUM VIP' | 'SILVER VIP';
  phone: string;
  visitCount: number;
  notes: string;
  items: DocketItem[];
  taxRate: number; // e.g. 0.18
  advancePaid: number;
  isSettled: boolean;
  settledAt?: string;
  paymentMethod?: 'upi' | 'card' | 'cash';
}

export interface ClientProfile {
  id: string;
  name: string;
  initials: string;
  phone: string;
  vipTier: 'GOLD VIP' | 'PLATINUM VIP' | 'SILVER VIP';
  lifetimeSpend: number;
  totalVisits: number;
  favoriteStylist: string;
  lastVisit: string;
  avatarBg: string;
  avatarText: string;
  preferenceNote: string;
}
