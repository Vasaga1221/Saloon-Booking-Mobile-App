import React from 'react';

interface DeviceTopBarProps {
  islandText?: string;
  forceShow?: boolean;
}

export const DeviceTopBar: React.FC<DeviceTopBarProps> = ({ islandText, forceShow = false }) => {
  return (
    <div
      className={`pt-2 px-6 items-center justify-between text-[#1E1424] text-[12px] font-semibold select-none shrink-0 z-40 bg-[#fff9ef] ${
        forceShow ? 'flex' : 'hidden md:flex'
      }`}
    >
      <span className="tabular-nums font-medium text-[13px] tracking-tight">01:45</span>

      {/* Dynamic Island */}
      <div className="device-island shadow-inner flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-black/60 border border-white/20 inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block animate-pulse" />
          {islandText && (
            <span className="text-[9px] text-white/80 font-medium truncate max-w-[50px]">
              {islandText}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[#1E1424]/80 text-[11px]">
        <span className="material-symbols-outlined text-[13px] leading-none">signal_cellular_alt</span>
        <span className="material-symbols-outlined text-[13px] leading-none">wifi</span>
        <span className="material-symbols-outlined text-[15px] leading-none">battery_full</span>
      </div>
    </div>
  );
};
