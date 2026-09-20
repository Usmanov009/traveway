import React from 'react';
import { Bookmark, MapPin, Plane, Info, Trash2 } from 'lucide-react';
import { TourPackage, Language, ThemeMode, TabType } from '../../types';

interface TripsTabProps {
  savedTours: TourPackage[];
  onOpenTourDetails: (tour: TourPackage) => void;
  onToggleSaveTour: (id: string) => void;
  onSelectTab: (tab: TabType) => void;
  language: Language;
  theme: ThemeMode;
}

export const TripsTab: React.FC<TripsTabProps> = ({
  savedTours,
  onOpenTourDetails,
  onToggleSaveTour,
  onSelectTab,
  language,
  theme
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header */}
      <div className={`p-4 rounded-3xl border shadow-lg ${
        isDark ? 'bg-[#111c30] border-[#1e2f4d]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-[#ff6600] flex items-center justify-center">
              <Bookmark size={20} className="fill-[#ff6600]" />
            </div>
            <div>
              <h2 className="text-base font-black">
                {language === 'uz' ? "Saqlangan Turpaketlar" : "Сохраненные туры"}
              </h2>
              <p className="text-xs text-slate-400">
                {savedTours.length > 0 
                  ? (language === 'uz' ? `${savedTours.length} ta saqlangan tur` : `${savedTours.length} сохраненных`)
                  : (language === 'uz' ? "Siz hali turpaket saqlamadingiz" : "Нет сохраненных туров")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved list */}
      {savedTours.length === 0 ? (
        <div className={`p-8 text-center rounded-3xl border space-y-3 ${
          isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
        }`}>
          <div className="w-14 h-14 rounded-full bg-orange-500/10 text-[#ff6600] mx-auto flex items-center justify-center">
            <Bookmark size={28} />
          </div>
          <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'uz' ? "Saqlangan turlar yo'q" : "Нет сохраненных туров"}
          </h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {language === 'uz' 
              ? "Qidiruv bo'limidagi istalgan tur paket kartasidagi saqlash tugmasini bosing." 
              : "Нажмите на иконку закладки в карточке любого тура в поиске."}
          </p>
          <button
            onClick={() => onSelectTab('search')}
            className="px-5 py-2.5 bg-[#ff6600] hover:bg-[#e65c00] text-white text-xs font-bold rounded-xl active:scale-95 shadow-md transition"
          >
            {language === 'uz' ? "Turpaketlarni ko'rish" : "Смотреть туры"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedTours.map((tour) => (
            <div
              key={tour.id}
              className={`p-3.5 rounded-3xl border space-y-3 shadow-md ${
                isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={tour.img}
                  alt={tour.title}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-[#ff6600] uppercase block">
                      {tour.tag}
                    </span>
                    <h4 className="text-xs font-black truncate mt-0.5">
                      {tour.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-orange-400 shrink-0" />
                      <span className="truncate">{tour.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-[#ff6600]">
                      {tour.currencySymbol === "so'm" ? `${tour.price.toLocaleString()} so'm` : `$${tour.price}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {tour.nights}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 gap-2">
                <button
                  onClick={() => onToggleSaveTour(tour.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={13} />
                  <span>{language === 'uz' ? "O'chirish" : "Удалить"}</span>
                </button>

                <button
                  onClick={() => onOpenTourDetails(tour)}
                  className="px-4 py-1.5 bg-[#ff6600] text-white text-xs font-bold rounded-xl shadow active:scale-95 transition flex items-center gap-1"
                >
                  <Info size={13} />
                  <span>{language === 'uz' ? "Batafsil" : "Подробнее"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
