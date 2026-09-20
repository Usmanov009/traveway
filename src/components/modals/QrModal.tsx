import React from 'react';
import { X, QrCode } from 'lucide-react';
import { UserProfile, Language, ThemeMode } from '../../types';

interface QrModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: ThemeMode;
}

export const QrModal: React.FC<QrModalProps> = ({
  user,
  isOpen,
  onClose,
  language,
  theme
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`border rounded-3xl p-6 text-center max-w-[320px] w-full space-y-3.5 shadow-2xl transition-colors ${
        isDark ? 'bg-[#152238] border-[#2a3c5d] text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6600]">
            <QrCode size={16} />
            <span>TripCraft ID Pass</span>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
              isDark ? 'bg-[#1c2942] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold">
            {language === 'uz' ? "Foydalanuvchi QR Kodi" : (language === 'ru' ? "QR Код Пользователя" : "Traveler QR Pass")}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'uz' 
              ? "Aeroport va turoperator kassalarida tezkor identifikatsiya uchun" 
              : (language === 'ru' ? "Для быстрой посадки в аэропорту и в отелях" : "For fast check-in at airports & partner hotels")}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-3 flex items-center justify-center shadow-inner border border-slate-200">
          <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
            <rect fill="none" height="30" rx="4" stroke="currentColor" stroke-width="6" width="30" x="10" y="10"></rect>
            <rect height="14" width="14" x="18" y="18"></rect>
            <rect fill="none" height="30" rx="4" stroke="currentColor" stroke-width="6" width="30" x="60" y="10"></rect>
            <rect height="14" width="14" x="68" y="18"></rect>
            <rect fill="none" height="30" rx="4" stroke="currentColor" stroke-width="6" width="30" x="10" y="60"></rect>
            <rect height="14" width="14" x="18" y="68"></rect>
            <rect height="30" width="6" x="48" y="10"></rect>
            <rect height="8" width="20" x="48" y="55"></rect>
            <rect height="15" width="25" x="60" y="70"></rect>
            <rect height="12" width="8" x="48" y="78"></rect>
            <circle cx="75" cy="40" r="4"></circle>
            <circle cx="35" cy="48" r="3"></circle>
          </svg>
        </div>

        <p className="text-[11px] font-mono text-[#ff6600] font-bold">
          {user.id} • {user.name}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-2.5 text-xs font-semibold rounded-xl active:scale-95 transition ${
            isDark ? 'bg-[#202f4a] hover:bg-[#283b5c] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
          }`}
        >
          {language === 'uz' ? "Yopish" : (language === 'ru' ? "Закрыть" : "Close")}
        </button>
      </div>
    </div>
  );
};
