import React from 'react';
import { Search, Compass, Flame, ClipboardList, User } from 'lucide-react';
import { Language, TabType, ThemeMode } from '../types';
import { translations } from '../data/translations';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedTripsCount: number;
  language: Language;
  theme: ThemeMode;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedTripsCount,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  return (
    <nav
      id="tma-bottom-navigation"
      className={`shrink-0 z-40 border-t px-2 py-2 flex items-center justify-around select-none transition-colors backdrop-blur-md ${
        isDark ? 'bg-[#0c1424]/95 border-[#1f2d47]' : 'bg-white/95 border-slate-200'
      }`}
    >
      {/* 1. Qidiruv / Search */}
      <button
        id="tab-btn-search"
        onClick={() => onSelectTab('search')}
        className={`flex flex-col items-center gap-1 transition active:scale-90 px-3 py-1 ${
          activeTab === 'search'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Search size={20} className={activeTab === 'search' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'search' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${activeTab === 'search' ? 'font-black' : 'font-medium'}`}>
          {t.tabSearch}
        </span>
      </button>

      {/* 2. Kashf etish / Explore */}
      <button
        id="tab-btn-explore"
        onClick={() => onSelectTab('explore')}
        className={`flex flex-col items-center gap-1 transition active:scale-90 px-3 py-1 ${
          activeTab === 'explore'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Compass size={20} className={activeTab === 'explore' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'explore' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${activeTab === 'explore' ? 'font-black' : 'font-medium'}`}>
          {t.tabExplore}
        </span>
      </button>

      {/* 3. Qaynoq / Hot Sales */}
      <button
        id="tab-btn-hot"
        onClick={() => onSelectTab('hot')}
        className={`flex flex-col items-center gap-1 transition active:scale-90 px-3 py-1 relative ${
          activeTab === 'hot'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="absolute -top-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full uppercase shadow">
          Hot
        </span>
        <div className="relative flex items-center justify-center">
          <Flame size={20} className={activeTab === 'hot' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'hot' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${activeTab === 'hot' ? 'font-black' : 'font-medium'}`}>
          {t.tabHot}
        </span>
      </button>

      {/* 4. Turlarim / My Trips */}
      <button
        id="tab-btn-trips"
        onClick={() => onSelectTab('trips')}
        className={`flex flex-col items-center gap-1 transition active:scale-90 px-3 py-1 relative ${
          activeTab === 'trips'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {savedTripsCount > 0 && (
          <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 bg-[#ff6600] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a] shadow">
            {savedTripsCount}
          </span>
        )}
        <div className="relative flex items-center justify-center">
          <ClipboardList size={20} className={activeTab === 'trips' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'trips' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${activeTab === 'trips' ? 'font-black' : 'font-medium'}`}>
          {t.tabTrips}
        </span>
      </button>

      {/* 5. Profil / Profile */}
      <button
        id="tab-btn-profile"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-1 transition active:scale-90 px-3 py-1 ${
          activeTab === 'profile'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <User size={20} className={activeTab === 'profile' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'profile' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight ${activeTab === 'profile' ? 'font-black' : 'font-medium'}`}>
          {t.tabProfile}
        </span>
      </button>
    </nav>
  );
};
