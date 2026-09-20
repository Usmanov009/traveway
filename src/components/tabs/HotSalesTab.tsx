import React, { useState, useEffect } from 'react';
import { Flame, Clock, Plane, Zap } from 'lucide-react';
import { HotDeal, Language, ThemeMode } from '../../types';
import { initialHotDeals } from '../../data/mockData';
import { translations } from '../../data/translations';

interface HotSalesTabProps {
  onBookHotDeal: (deal: HotDeal) => void;
  language: Language;
  theme: ThemeMode;
}

export const HotSalesTab: React.FC<HotSalesTabProps> = ({
  onBookHotDeal,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  // Live Countdown Timer
  const [secondsRemaining, setSecondsRemaining] = useState(6 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Flash Deals Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-[#ff6600] to-amber-600 rounded-3xl p-4 text-white relative overflow-hidden shadow-xl border border-red-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 backdrop-blur-sm text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/20">
              🔥 {t.flashDeals}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-amber-200 border border-white/20">
              KOMPAS TOUR UZ
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-black/40 px-2.5 py-1 rounded-xl border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        <h2 className="text-base font-black tracking-tight mt-1 leading-tight">
          {language === 'uz' ? "Kompas Tour Qaynoq Takliflari" : (language === 'ru' ? "Горящие туры Kompas Tour" : "Kompas Tour Flash Sales")}
        </h2>
        <p className="text-[11px] text-orange-100 mt-1 leading-relaxed">
          {language === 'uz' ? "online.uz.kompastour.com dagi eng yaxshi narxlar va charter bloklari real vaqtda." : "Актуальные цены и чартерные блоки напрямую с online.uz.kompastour.com"}
        </p>
      </div>

      {/* Deals Cards List */}
      <div className="space-y-3">
        {initialHotDeals.map((deal) => (
          <div
            key={deal.id}
            className={`border rounded-2xl overflow-hidden shadow-lg transition hover:border-red-500/50 ${
              isDark ? 'bg-[#142138] border-red-500/30' : 'bg-white border-red-200'
            }`}
          >
            {/* Top Image Banner */}
            <div className="relative h-32 w-full bg-slate-800">
              <img
                src={deal.img}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-md">
                  🔥 {deal.discount} FLASH
                </span>
                <span className="bg-black/70 backdrop-blur-md text-amber-300 font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-amber-400/20">
                  Kompas Tour
                </span>
              </div>

              <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-500/30 flex items-center gap-1">
                <Clock size={11} />
                <span>{deal.timeLeft}</span>
              </span>

              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                <div>
                  <h4 className="text-xs font-black drop-shadow">
                    {deal.title}
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    📍 {deal.location} {deal.nights ? `• 🌙 ${deal.nights}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Deal Details & Pricing */}
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/20">
                  <Zap size={11} />
                  <span>{deal.freeSeats}</span>
                </span>

                <div className="text-right">
                  <span className="text-[10px] line-through text-slate-500 font-medium mr-1.5">
                    {deal.oldPrice}
                  </span>
                  <span className="text-base font-black text-red-500">
                    {deal.price}
                  </span>
                  <span className="text-[8px] text-slate-400 block -mt-0.5">
                    {t.perPerson}
                  </span>
                </div>
              </div>

              <div className={`p-2 rounded-xl text-[10px] flex items-center gap-1.5 border ${
                isDark ? 'bg-[#0f1728] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Plane size={12} className="text-sky-400 shrink-0" />
                <span className="truncate font-medium">{deal.flight}</span>
              </div>

              <button
                onClick={() => onBookHotDeal(deal)}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-[#ff6600] hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Flame size={14} className="fill-white" />
                <span>
                  {language === 'uz' ? "Qaynoq taklifni ko'rish" : (language === 'ru' ? "Смотреть горящий тур" : "View Flash Deal")}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
