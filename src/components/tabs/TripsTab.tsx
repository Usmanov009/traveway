import React, { useState } from 'react';
import { Download, Trash2, Calendar, MapPin, Ticket, Heart, ExternalLink } from 'lucide-react';
import { Booking, TourPackage, Language, ThemeMode, TabType } from '../../types';
import { translations } from '../../data/translations';

interface TripsTabProps {
  bookings: Booking[];
  savedTours: TourPackage[];
  onOpenTourDetails: (tour: TourPackage) => void;
  onCancelBooking: (id: string) => void;
  onDownloadVoucher: (voucherId: string) => void;
  onToggleSaveTour: (id: string) => void;
  onSelectTab: (tab: TabType) => void;
  language: Language;
  theme: ThemeMode;
}

export const TripsTab: React.FC<TripsTabProps> = ({
  bookings,
  savedTours,
  onOpenTourDetails,
  onCancelBooking,
  onDownloadVoucher,
  onToggleSaveTour,
  onSelectTab,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const [subTab, setSubTab] = useState<'active' | 'saved'>('active');

  return (
    <div className="space-y-4 pb-20">
      
      {/* Sub Tabs Switcher */}
      <div className={`p-1 rounded-2xl border flex items-center ${
        isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setSubTab('active')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 ${
            subTab === 'active'
              ? 'bg-[#ff6600] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{t.activeOrders} ({bookings.length})</span>
        </button>

        <button
          onClick={() => setSubTab('saved')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 ${
            subTab === 'saved'
              ? 'bg-[#ff6600] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{t.savedTours} ({savedTours.length})</span>
        </button>
      </div>

      {/* ACTIVE BOOKINGS CONTENT */}
      {subTab === 'active' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className={`p-8 text-center rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
            }`}>
              <div className="w-14 h-14 rounded-full bg-orange-500/15 text-[#ff6600] mx-auto flex items-center justify-center">
                <Ticket size={28} />
              </div>
              <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'uz' ? "Faol buyurtmalar yo'q" : (language === 'ru' ? "Нет активных заказов" : "No active bookings")}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'uz' ? "Yangi turpaket yoki AI marshrutini band qiling." : (language === 'ru' ? "Забронируйте горящий тур или AI маршрут." : "Book a tour package or craft an AI itinerary.")}
              </p>
              <button
                onClick={() => onSelectTab('search')}
                className="px-5 py-2.5 bg-[#ff6600] text-white text-xs font-bold rounded-xl active:scale-95 shadow-md transition"
              >
                {t.btnSearchTours}
              </button>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border space-y-3 shadow-md ${
                  isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b ${
                  isDark ? 'border-[#1f2e47]' : 'border-slate-100'
                }`}>
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] font-mono text-slate-400 block truncate">
                      ID: {b.voucherId}
                    </span>
                    <h4 className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {b.tourTitle}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    ✓ {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">Yo'nalish:</span>
                    <span className={`font-semibold truncate block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      📍 {b.dest}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">Sanalar:</span>
                    <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      📅 {b.dates}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
                  <span className="text-xs font-black text-[#ff6600]">
                    {b.price}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDownloadVoucher(b.voucherId)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg active:scale-95 transition flex items-center gap-1 border ${
                        isDark ? 'bg-[#202f4a] hover:bg-[#283b5c] text-white border-transparent' : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <Download size={12} className="text-sky-400" />
                      <span>{t.voucher}</span>
                    </button>

                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-2 py-1.5 text-rose-400 hover:text-rose-300 text-[11px] font-medium active:scale-95 transition"
                    >
                      {t.cancelBooking}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SAVED TOURS CONTENT */}
      {subTab === 'saved' && (
        <div className="space-y-3">
          {savedTours.length === 0 ? (
            <div className={`p-8 text-center rounded-3xl border space-y-2 ${
              isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
            }`}>
              <Heart size={32} className="text-slate-400 mx-auto" />
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'uz' ? "Saqlangan turlar yo'q" : "Нет сохраненных туров"}
              </h4>
            </div>
          ) : (
            savedTours.map((tour) => (
              <div
                key={tour.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-sm ${
                  isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                }`}
              >
                <img
                  src={tour.img}
                  alt={tour.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {tour.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    📍 {tour.location}
                  </p>
                  <p className="text-xs font-black text-[#ff6600] mt-0.5">
                    ${tour.price} <span className="text-[9px] text-slate-400 font-normal">/ {t.perPerson}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => onOpenTourDetails(tour)}
                    className="px-3 py-1 bg-[#ff6600] text-white text-[10px] font-bold rounded-lg active:scale-95 transition"
                  >
                    {t.btnDetails}
                  </button>
                  <button
                    onClick={() => onToggleSaveTour(tour.id)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 py-0.5 active:scale-95 transition text-center"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
