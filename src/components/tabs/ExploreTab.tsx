import React, { useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { ExploreVibe, Language, ThemeMode } from '../../types';
import { initialExploreVibes } from '../../data/mockData';

interface ExploreTabProps {
  onSelectDestination: (destName: string) => void;
  language: Language;
  theme: ThemeMode;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  onSelectDestination,
  language,
  theme
}) => {
  const isDark = theme === 'dark';
  const [selectedVibe, setSelectedVibe] = useState<'all' | 'beach' | 'culture' | 'mountain' | 'luxury'>('all');

  const vibesFilter = [
    { key: 'all', uz: '✨ Hammasi', ru: '✨ Все', en: '✨ All' },
    { key: 'beach', uz: '🏖 Plyaj & Dengiz', ru: '🏖 Пляж и Море', en: '🏖 Beach & Sea' },
    { key: 'culture', uz: '🏛 Madaniyat & Tarix', ru: '🏛 Культура', en: '🏛 Culture & History' },
    { key: 'mountain', uz: "⛰ Tog' & Tabiat", ru: '⛰ Горы', en: '⛰ Mountains & Nature' },
    { key: 'luxury', uz: '💎 Hashamat & Relaks', ru: '💎 Люкс', en: '💎 Luxury & Spa' }
  ];

  const filteredList = selectedVibe === 'all'
    ? initialExploreVibes
    : initialExploreVibes.filter(v => v.vibe === selectedVibe);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Explore Hero Banner */}
      <div className={`p-4 rounded-3xl border shadow-lg relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs bg-blue-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            TripCraft Vibes
          </span>
          <span className={`text-[11px] font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
            {language === 'uz' ? "Kayfiyatingizga mos yo'nalishlar" : (language === 'ru' ? "Подбор под настроение" : "Curated for your vibe")}
          </span>
        </div>

        <h2 className={`text-base font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {language === 'uz' ? "Qayerga sayohat qilishni xohlaysiz?" : (language === 'ru' ? "Куда хотите отправиться?" : "Where would you like to travel?")}
        </h2>
        <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {language === 'uz'
            ? "Turpaketlar, vizasiz mamlakatlar va maxsus ekskursiyalar to'plami."
            : (language === 'ru' ? "Готовые турпакеты, безвизовые страны и эксклюзивные отели." : "Pre-packaged deals, visa-free countries & curated hotel stays.")}
        </p>
      </div>

      {/* Vibe Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {vibesFilter.map((v) => {
          const isSelected = selectedVibe === v.key;
          const label = language === 'uz' ? v.uz : (language === 'ru' ? v.ru : v.en);
          return (
            <button
              key={v.key}
              onClick={() => setSelectedVibe(v.key as any)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition active:scale-95 border ${
                isSelected
                  ? 'bg-[#ff6600] text-white border-[#ff6600] shadow-md shadow-orange-500/25'
                  : isDark
                  ? 'bg-[#142035] text-slate-300 border-[#243755] hover:bg-[#1a2842]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Explore Grid Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectDestination(item.destKey)}
            className={`rounded-2xl overflow-hidden relative shadow-md transition active:scale-98 cursor-pointer border group hover:border-[#ff6600]/50 ${
              isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="h-40 relative w-full bg-slate-800">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <span className="absolute top-2.5 left-2.5 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                {item.badge}
              </span>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                <div>
                  <h4 className="text-sm font-black leading-tight drop-shadow-md">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-medium">
                    {item.count}
                  </p>
                </div>

                <div className="text-right bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                  <span className="text-[9px] text-slate-300 block font-medium">
                    {language === 'uz' ? "Boshlang'ich" : (language === 'ru' ? "от" : "from")}
                  </span>
                  <span className="text-xs font-black text-[#ff6600]">
                    {item.priceFrom}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
