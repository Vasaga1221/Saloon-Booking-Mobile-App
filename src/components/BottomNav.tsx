import React from 'react';
import { useSalon } from '../context/SalonContext';

interface BottomNavProps {
  currentScreen?: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup';
  onNavigate?: (screen: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { activeTab, setActiveTab } = useSalon();
  const active = currentScreen || activeTab;

  const handleTabClick = (tab: 'pulse' | 'timeline' | 'crm' | 'checkout' | 'setup') => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      setActiveTab(tab);
    }
  };

  const navItems = [
    { id: 'pulse' as const, label: 'Pulse', icon: 'dashboard' },
    { id: 'timeline' as const, label: 'Timeline', icon: 'calendar_today' },
    { id: 'crm' as const, label: 'Clients', icon: 'groups' },
    { id: 'checkout' as const, label: 'POS', icon: 'point_of_sale' },
    { id: 'setup' as const, label: 'Setup', icon: 'settings' },
  ];

  return (
    <nav 
      aria-label="Salon Navigation" 
      className="mt-auto border-t border-[#1E1424]/10 bg-white/95 backdrop-blur-md px-6 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-between sticky bottom-0 z-30 shrink-0"
    >
      {navItems.map((item) => {
        const isCurrent = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center transition-all duration-150 relative py-1 px-2 cursor-pointer ${
              isCurrent ? 'text-[#1E1424]' : 'text-[#1E1424]/45 hover:text-[#1E1424]/75'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none mb-0.5">
              {item.icon}
            </span>
            <span className={`font-sans text-[10px] leading-none ${isCurrent ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
            {isCurrent && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E1424] absolute -bottom-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
