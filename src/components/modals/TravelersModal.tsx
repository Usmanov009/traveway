import React from 'react';
import { X, Check } from 'lucide-react';
import { Language, ThemeMode } from '../../types';

interface TravelersModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelers: number;
  setTravelers: (val: number) => void;
  style: string;
  setStyle: (val: string) => void;
  language: Language;
  theme: ThemeMode;
}

export const TravelersModal: React.FC<TravelersModalProps> = ({
  isOpen,
  onClose,
  travelers,
  setTravelers,
  style,
  setStyle,
  language,
  theme
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const vibes = [
    { key: 'Culture', uz: 'Madaniyat & Tarix', ru: 'Культура и Музеи', en: 'Culture & Heritage' },
    { key: 'Relaxing', uz: 'Hordiq & Plyaj', ru: 'Релакс и Пляж', en: 'Relaxing & Beach' },
    { key: 'Adventure', uz: 'Sarguzasht', ru: 'Приключения', en: 'Adventure' },
    { key: 'Party', uz: 'Tungi hayot', ru: 'Ночная жизнь', en: 'Nightlife & Party' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl border transition-colors ${
        isDark ? 'bg-[#121c2e] border-[#263756] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="w-12 h-1 bg-slate-500/40 rounded-full mx-auto mb-3 sm:hidden"></div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black">
            {language === 'uz' ? "Sayohatchilar & Uslub" : (language === 'ru' ? "Путешественники и стиль" : "Travelers & Style")}
          </h3>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              isDark ? 'bg-[#1c2942] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Travelers Stepper */}
        <div className={`p-4 rounded-2xl flex items-center justify-between mb-4 border ${
          isDark ? 'bg-[#172338] border-[#253755]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <h4 className="text-sm font-bold">
              {language === 'uz' ? "Sayohatchilar soni" : (language === 'ru' ? "Количество гостей" : "Number of Travelers")}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'uz' ? "Kattalar va yo'ldoshlar" : (language === 'ru' ? "Взрослые и дети" : "Adults & companions")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className={`w-9 h-9 rounded-xl font-black text-base flex items-center justify-center active:scale-90 border transition shadow-sm ${
                isDark ? 'bg-[#1f2d47] border-[#2b3e61] text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              -
            </button>
            <span className="text-base font-black w-6 text-center text-[#ff6600]">
              {travelers}
            </span>
            <button
              onClick={() => setTravelers(Math.min(8, travelers + 1))}
              className={`w-9 h-9 rounded-xl font-black text-base flex items-center justify-center active:scale-90 border transition shadow-sm ${
                isDark ? 'bg-[#1f2d47] border-[#2b3e61] text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Travel Style Pills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {language === 'uz' ? "Sayohat Kayfiyati" : (language === 'ru' ? "Атмосфера поездки" : "Trip Vibe")}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {vibes.map((v) => {
              const isSelected = style === v.key;
              const label = language === 'uz' ? v.uz : (language === 'ru' ? v.ru : v.en);
              return (
                <button
                  key={v.key}
                  onClick={() => setStyle(v.key)}
                  className={`p-3 rounded-xl text-xs font-bold transition flex items-center justify-between active:scale-95 border ${
                    isSelected
                      ? 'bg-[#ff6600]/15 border-[#ff6600] text-[#ff6600]'
                      : isDark
                      ? 'bg-[#172338] border-[#253755] text-slate-300 hover:bg-[#1f2d47]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate pr-1">{label}</span>
                  {isSelected && <Check size={14} className="text-[#ff6600] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white font-black text-xs py-3.5 rounded-xl mt-5 active:scale-95 transition shadow-lg shadow-orange-500/25"
        >
          {language === 'uz' ? "Tayyor" : (language === 'ru' ? "Готово" : "Done")}
        </button>
      </div>
    </div>
  );
};
