import React from 'react';
import { ArrowLeft, Bell, QrCode, X } from 'lucide-react';
import { Language, TabType, ThemeMode } from '../types';
import { translations } from '../data/translations';

interface HeaderBarProps {
  currentTab: TabType;
  language: Language;
  theme: ThemeMode;
  onBack: () => void;
  onOpenQr: () => void;
  onToggleNotifs: () => void;
  hasUnreadNotifs: boolean;
  onCloseApp: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  language,
  theme,
  onBack,
  onOpenQr,
  onToggleNotifs,
  hasUnreadNotifs,
  onCloseApp
}) => {
  const t = translations[language];

  const getPageInfo = () => {
    switch (currentTab) {
      case 'search':
        return {
          title: t.searchTitle,
          subtitle: t.searchSub,
          canBack: false
        };
      case 'explore':
        return {
          title: language === 'uz' ? "Kashf etish & Vibes" : (language === 'ru' ? "Исследовать & Тренды" : "Explore & Vibes"),
          subtitle: language === 'uz' ? "Sayohat g'oyalari va arzon yo'nalishlar" : (language === 'ru' ? "Идеи для поездок и курорты" : "Travel ideas and top resorts"),
          canBack: true
        };
      case 'hot':
        return {
          title: language === 'uz' ? "Qaynoq Takliflar 🔥" : (language === 'ru' ? "Горящие туры 🔥" : "Hot Tour Deals 🔥"),
          subtitle: language === 'uz' ? "Katta chegirmali flash turpaketlar" : (language === 'ru' ? "Flash-скидки до 50%" : "Flash discounts up to 50%"),
          canBack: true
        };
      case 'trips':
        return {
          title: language === 'uz' ? "Saqlangan Turlar" : (language === 'ru' ? "Сохраненные Туры" : "Saved Tours"),
          subtitle: language === 'uz' ? "Tanlangan va yoqqan turpaketlar" : (language === 'ru' ? "Избранные турпакеты" : "Bookmarked tour packages"),
          canBack: true
        };
      case 'profile':
        return {
          title: t.myProfile,
          subtitle: t.settingsAndCabinet,
          canBack: true
        };
    }
  };

  const pageInfo = getPageInfo();
  const isDark = theme === 'dark';

  return (
    <div className={`shrink-0 z-30 transition-colors ${isDark ? 'bg-[#0f172a]' : 'bg-slate-100'} border-b ${isDark ? 'border-[#1f2d47]' : 'border-slate-300'}`}>
      {/* Telegram Chrome Status Bar */}
      <div className="px-5 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {t.appTitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
            isDark 
              ? 'bg-[#1b273d] text-[#ff6600] border-[#ff6600]/30' 
              : 'bg-orange-50 text-[#ff6600] border-orange-200'
          }`}>
            {t.vipUser}
          </span>
          <button
            id="btn-close-tma"
            onClick={onCloseApp}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
              isDark ? 'bg-[#1c2942] text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Close TMA"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Primary Navigation Top App Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-t ${isDark ? 'border-[#1b2840]' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <button
            id="btn-header-back"
            onClick={onBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
              isDark ? 'bg-[#1c2942] hover:bg-[#253654] text-slate-300' : 'bg-white hover:bg-slate-200 text-slate-700 shadow-sm'
            } ${pageInfo.canBack ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-default'}`}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className={`text-base font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {pageInfo.title}
            </h1>
            <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* QR Pass Button */}
          <button
            id="btn-header-qr"
            onClick={onOpenQr}
            aria-label="QR Code"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
              isDark ? 'bg-[#1c2942] hover:bg-[#253654] text-slate-300' : 'bg-white hover:bg-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <QrCode size={16} />
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              id="btn-header-notifs"
              onClick={onToggleNotifs}
              aria-label="Notifications"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
                isDark ? 'bg-[#1c2942] hover:bg-[#253654] text-slate-300' : 'bg-white hover:bg-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <Bell size={16} />
            </button>
            {hasUnreadNotifs && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff6600] ring-2 ring-[#0f172a]"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
