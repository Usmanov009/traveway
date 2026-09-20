import React from 'react';
import { Search, Flame, Bookmark } from 'lucide-react';
import { Language, TabType, ThemeMode } from '../types';

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
  const isDark = theme === 'dark';

  return (
    <nav
      id="tma-bottom-navigation"
      className={`shrink-0 z-40 border-t px-6 py-2 flex items-center justify-around select-none transition-colors backdrop-blur-md ${
        isDark ? 'bg-[#0c1424]/95 border-[#1f2d47]' : 'bg-white/95 border-slate-200'
      }`}
    >
      {/* 1. Tur paketlar / Search */}
      <button
        id="tab-btn-search"
        onClick={() => onSelectTab('search')}
        className={`flex-1 flex flex-col items-center gap-1 transition active:scale-95 py-1 ${
          activeTab === 'search'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Search size={21} className={activeTab === 'search' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'search' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[11px] tracking-tight ${activeTab === 'search' ? 'font-black' : 'font-medium'}`}>
          {language === 'uz' ? "Tur paketlar" : "Все туры"}
        </span>
      </button>

      {/* 2. Qaynoq turlar / Hot Sales */}
      <button
        id="tab-btn-hot"
        onClick={() => onSelectTab('hot')}
        className={`flex-1 flex flex-col items-center gap-1 transition active:scale-95 py-1 relative ${
          activeTab === 'hot'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="absolute -top-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full uppercase shadow">
          Hot
        </span>
        <div className="relative flex items-center justify-center">
          <Flame size={21} className={activeTab === 'hot' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'hot' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[11px] tracking-tight ${activeTab === 'hot' ? 'font-black' : 'font-medium'}`}>
          {language === 'uz' ? "Qaynoq turlar" : "Горящие туры"}
        </span>
      </button>

      {/* 3. Saqlanganlar / Saved */}
      <button
        id="tab-btn-saved"
        onClick={() => onSelectTab('trips')}
        className={`flex-1 flex flex-col items-center gap-1 transition active:scale-95 py-1 relative ${
          activeTab === 'trips'
            ? 'text-[#ff6600]'
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {savedTripsCount > 0 && (
          <span className="absolute -top-1 right-1/4 min-w-4 h-4 px-1 bg-[#ff6600] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a] shadow">
            {savedTripsCount}
          </span>
        )}
        <div className="relative flex items-center justify-center">
          <Bookmark size={21} className={activeTab === 'trips' ? 'stroke-[2.6]' : 'stroke-2'} />
          {activeTab === 'trips' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff6600]"></span>
          )}
        </div>
        <span className={`text-[11px] tracking-tight ${activeTab === 'trips' ? 'font-black' : 'font-medium'}`}>
          {language === 'uz' ? "Saqlanganlar" : "Сохраненные"}
        </span>
      </button>
    </nav>
  );
};
