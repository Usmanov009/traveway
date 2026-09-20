import React from 'react';
import { X, Star, Plane, Building, Bus, ShieldCheck, Check, ExternalLink } from 'lucide-react';
import { TourPackage, Language, ThemeMode } from '../../types';
import { translations } from '../../data/translations';

interface TourDetailsModalProps {
  tour: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (tour: TourPackage) => void;
  language: Language;
  theme: ThemeMode;
}

export const TourDetailsModal: React.FC<TourDetailsModalProps> = ({
  tour,
  isOpen,
  onClose,
  onBook,
  language,
  theme
}) => {
  if (!isOpen || !tour) return null;
  const t = translations[language];
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        id="tour-details-modal-box"
        className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 max-h-[88vh] overflow-y-auto no-scrollbar space-y-4 shadow-2xl border transition-colors ${
          isDark ? 'bg-[#121c2e] border-[#263756] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ff6600] text-white uppercase tracking-wider">
                {tour.tag}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Kompas Tour UZ
              </span>
            </div>
            <h3 className="text-base font-black mt-0.5 leading-tight">
              {tour.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition active:scale-90 ${
              isDark ? 'bg-[#1c2942] text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Hotel Cover Preview Banner */}
        <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-800 shadow-md">
          <img
            src={tour.img}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          
          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-amber-400 flex items-center gap-1 border border-amber-400/20">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{tour.rating}</span>
            <span className="text-[10px] text-slate-300 font-normal">/ 10</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] text-white border border-white/15">
            📍 {tour.location}
          </div>
        </div>

        {/* Hotel Description */}
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {tour.description}
        </p>

        {/* Inclusions Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isDark ? 'bg-[#17243a] border-[#223350]' : 'bg-slate-50 border-slate-200'
          }`}>
            <Plane size={18} className="text-sky-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Parvoz bloki</p>
              <p className="font-bold text-[11px] truncate">{tour.flightBlock || tour.airline}</p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isDark ? 'bg-[#17243a] border-[#223350]' : 'bg-slate-50 border-slate-200'
          }`}>
            <Building size={18} className="text-[#ff6600] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Ovqatlanish</p>
              <p className="font-bold text-[11px] truncate">{tour.mealPlan || "All Inclusive"}</p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isDark ? 'bg-[#17243a] border-[#223350]' : 'bg-slate-50 border-slate-200'
          }`}>
            <Bus size={18} className="text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Xona toifasi</p>
              <p className="font-bold text-[11px] text-emerald-400 truncate">{tour.roomType || "Standard Room"}</p>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isDark ? 'bg-[#17243a] border-[#223350]' : 'bg-slate-50 border-slate-200'
          }`}>
            <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Sug'urta va transfer</p>
              <p className="font-bold text-[11px] truncate">{tour.insurance}</p>
            </div>
          </div>
        </div>

        {/* Kompas Tour Official Source Box */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
          isDark ? 'bg-[#0f1728] border-[#223350]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Turoperator
            </span>
            <span className="font-bold text-amber-400 text-[11px]">
              Kompas Tour
            </span>
          </div>
          {tour.checkinDate && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">
                Uchish sanasi
              </span>
              <span className="font-bold text-sky-400 text-[11px]">
                {tour.checkinDate}
              </span>
            </div>
          )}
        </div>

        {/* Price & Action CTA */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-[#0b1322] border-[#1d2b45]' : 'bg-orange-50/60 border-orange-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              {t.perPerson}:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#ff6600]">
                {tour.currencySymbol === "so'm" ? `${tour.price.toLocaleString()} so'm` : `$${tour.price}`}
              </span>
              {tour.oldPrice && (
                <span className="text-xs line-through text-slate-500 font-bold">
                  {tour.currencySymbol === "so'm" ? `${tour.oldPrice.toLocaleString()} so'm` : `$${tour.oldPrice}`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {language === 'uz' ? 'Yopish' : 'Закрыть'}
            </button>
            <button
              onClick={() => onBook(tour)}
              className="px-5 py-2.5 bg-[#ff6600] hover:bg-[#e65c00] active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/30 transition flex items-center gap-1"
            >
              <Check size={14} />
              <span>{language === 'uz' ? 'Bron qilish' : 'Забронировать'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
