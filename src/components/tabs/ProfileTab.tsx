import React from 'react';
import { 
  BadgeCheck, 
  Send, 
  Settings, 
  CreditCard, 
  Plus, 
  Globe, 
  Moon, 
  Sun, 
  Sliders, 
  Bell, 
  Headphones, 
  Info, 
  LogOut, 
  ShieldCheck,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import { UserProfile, PaymentCard, Language, ThemeMode, TabType } from '../../types';
import { translations } from '../../data/translations';

interface ProfileTabProps {
  user: UserProfile;
  cards: PaymentCard[];
  onOpenEditProfile: () => void;
  onOpenAddCard: () => void;
  onSetPrimaryCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
  onUpdatePassport: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onSetTheme: (mode: ThemeMode) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onSelectTab: (tab: TabType) => void;
  onLogout: () => void;
  savedToursCount: number;
  bookingsCount: number;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  cards,
  onOpenEditProfile,
  onOpenAddCard,
  onSetPrimaryCard,
  onDeleteCard,
  onUpdatePassport,
  language,
  onSetLanguage,
  theme,
  onSetTheme,
  notificationsEnabled,
  onToggleNotifications,
  onSelectTab,
  onLogout,
  savedToursCount,
  bookingsCount
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const initials = user.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Main User Profile Card (Exact match to Image 12) */}
      <section 
        className={`border rounded-3xl p-4 shadow-xl relative overflow-hidden transition-colors ${
          isDark 
            ? 'bg-gradient-to-br from-[#1b2842] to-[#121c2e] border-[#263756]' 
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#ff6600]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5 relative z-10">
          
          {/* Avatar with PRO Badge */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff6600] to-amber-400 p-[2px] shadow-lg shadow-orange-500/20">
              <div className={`w-full h-full rounded-2xl flex items-center justify-center font-black text-2xl tracking-wider ${
                isDark ? 'bg-[#18243b] text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                {initials || 'JR'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[#0f172a] text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase border border-[#0f172a] shadow">
              PRO
            </span>
          </div>

          {/* User Credentials */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <h2 className={`text-base font-black truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user.name}
                </h2>
                <BadgeCheck size={16} className="text-sky-400 shrink-0" />
              </div>

              <button
                onClick={onOpenEditProfile}
                className="text-[11px] text-[#ff6600] font-black hover:underline active:scale-95 px-2 py-0.5 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/20 transition"
              >
                {t.update}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 truncate">
                <Send size={10} className="fill-sky-400" />
                <span>{user.telegram}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold shrink-0">
                Ulangan
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>{user.phone}</span>
              <span className="font-mono text-[10px] text-slate-400 font-bold">
                ID: {user.id}
              </span>
            </div>
          </div>

        </div>

        {/* 3 Metric Summary Boxes */}
        <div className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t text-center ${
          isDark ? 'border-[#2a3c5d]/70' : 'border-slate-100'
        }`}>
          <div
            onClick={() => onSelectTab('trips')}
            className={`rounded-xl p-2 border cursor-pointer active:scale-95 transition ${
              isDark ? 'bg-[#152035] border-[#223350]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="text-[10px] text-slate-400 font-medium">{t.orders}</p>
            <p className={`text-sm font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {bookingsCount} ta
            </p>
          </div>

          <div
            onClick={() => onSelectTab('trips')}
            className={`rounded-xl p-2 border cursor-pointer active:scale-95 transition ${
              isDark ? 'bg-[#152035] border-[#223350]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="text-[10px] text-slate-400 font-medium">{t.saved}</p>
            <p className={`text-sm font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {savedToursCount} ta
            </p>
          </div>

          <div
            className={`rounded-xl p-2 border relative overflow-hidden ${
              isDark ? 'bg-[#152035] border-[#223350]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff6600] rounded-full"></div>
            <p className="text-[10px] text-slate-400 font-medium">{t.cashback}</p>
            <p className="text-sm font-black text-[#ff6600] mt-0.5">
              ${user.cashback} ball
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sayohatchi Hujjatlari (Travel Documents) */}
      <section className={`border rounded-2xl p-3.5 space-y-2.5 shadow-sm ${
        isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6600] text-sm">🛂</span>
            <h3 className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.travelDocs}
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {language === 'uz' ? "Saqlangan" : "Сохранено"}
          </span>
        </div>

        <div className={`rounded-xl p-3 border flex items-center justify-between ${
          isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-0.5">
            <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {user.passport.type}
            </p>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider font-bold">
              {user.passport.number}
            </p>
            <p className="text-[10px] text-slate-400">
              {t.validUntil} <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{user.passport.expiry}</span>
            </p>
          </div>

          <button
            onClick={onUpdatePassport}
            className="text-xs text-[#ff6600] font-black hover:underline active:scale-95 p-1 transition"
          >
            {t.update}
          </button>
        </div>
      </section>

      {/* 3. Mening To'lov Kartalarim (Payment Cards) */}
      <section className={`border rounded-2xl p-3.5 space-y-3 shadow-sm ${
        isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6600] text-sm">💳</span>
            <h3 className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.myCards}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {cards.length} {t.cardsConnected}
          </span>
        </div>

        {/* Cards List */}
        <div className="space-y-2">
          {cards.map((c) => {
            const isHumo = c.type === 'HUMO';
            const isVisa = c.type === 'VISA';
            const badgeGrad = isHumo 
              ? 'from-emerald-600 to-teal-700' 
              : (isVisa ? 'from-blue-700 to-indigo-900' : 'from-purple-600 to-indigo-700');

            return (
              <div
                key={c.id}
                className={`rounded-xl p-3 border flex items-center justify-between transition ${
                  c.isPrimary
                    ? isDark ? 'border-emerald-500/40 bg-[#111a2c]' : 'border-emerald-400 bg-emerald-50/40'
                    : isDark ? 'border-[#202f4a] bg-[#111a2c]' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-7 bg-gradient-to-r ${badgeGrad} rounded-md flex items-center justify-center text-[9px] font-black text-white tracking-widest shadow shrink-0`}>
                    {c.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        •••• {c.last4}
                      </p>
                      {c.isPrimary && (
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {t.primary}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">
                      {c.bank}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!c.isPrimary ? (
                    <button
                      onClick={() => onSetPrimaryCard(c.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded active:scale-95 transition ${
                        isDark ? 'bg-[#1b2842] text-slate-300 hover:text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t.btnSelect}
                    </button>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                      ✓
                    </div>
                  )}

                  <button
                    onClick={() => onDeleteCard(c.id)}
                    className="text-slate-400 hover:text-rose-400 p-1 text-xs active:scale-90 transition"
                    title="Delete card"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Click, Payme & TG Stars Info */}
        <div className={`p-2 rounded-xl flex items-center justify-between text-[11px] border ${
          isDark ? 'bg-[#121c2e] border-[#1f2d47]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Click, Payme & Telegram Stars</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded">
            Faol
          </span>
        </div>

        {/* Add New Card Button */}
        <button
          onClick={onOpenAddCard}
          className={`w-full py-2.5 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition active:scale-95 ${
            isDark 
              ? 'border-[#293c5d] hover:border-[#ff6600]/60 text-slate-300 hover:text-[#ff6600]' 
              : 'border-slate-300 hover:border-[#ff6600] text-slate-600 hover:text-[#ff6600]'
          }`}
        >
          <Plus size={15} />
          <span>{t.addCard}</span>
        </button>
      </section>

      {/* 4. Ilova Tili (Language Selector) */}
      <section className={`border rounded-2xl p-3.5 space-y-2.5 shadow-sm ${
        isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6600] text-sm">🌐</span>
            <h3 className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.appLanguage}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {t.activeLang}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {/* Uzbek */}
          <button
            onClick={() => onSetLanguage('uz')}
            className={`w-full rounded-xl px-3 py-2 flex items-center justify-between text-left transition active:scale-98 border ${
              language === 'uz'
                ? 'bg-[#ff6600]/15 border-[#ff6600]/40'
                : isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🇺🇿</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>O'zbekcha</p>
                <p className="text-[10px] text-slate-400">Lotin yozuvida</p>
              </div>
            </div>
            {language === 'uz' ? (
              <div className="w-5 h-5 rounded-full bg-[#ff6600] text-white flex items-center justify-center text-xs font-black">
                ✓
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600"></div>
            )}
          </button>

          {/* Russian */}
          <button
            onClick={() => onSetLanguage('ru')}
            className={`w-full rounded-xl px-3 py-2 flex items-center justify-between text-left transition active:scale-98 border ${
              language === 'ru'
                ? 'bg-[#ff6600]/15 border-[#ff6600]/40'
                : isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🇷🇺</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Русский</p>
                <p className="text-[10px] text-slate-400">Русский язык</p>
              </div>
            </div>
            {language === 'ru' ? (
              <div className="w-5 h-5 rounded-full bg-[#ff6600] text-white flex items-center justify-center text-xs font-black">
                ✓
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600"></div>
            )}
          </button>

          {/* English */}
          <button
            onClick={() => onSetLanguage('en')}
            className={`w-full rounded-xl px-3 py-2 flex items-center justify-between text-left transition active:scale-98 border ${
              language === 'en'
                ? 'bg-[#ff6600]/15 border-[#ff6600]/40'
                : isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🇬🇧</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>English</p>
                <p className="text-[10px] text-slate-400">International version</p>
              </div>
            </div>
            {language === 'en' ? (
              <div className="w-5 h-5 rounded-full bg-[#ff6600] text-white flex items-center justify-center text-xs font-black">
                ✓
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600"></div>
            )}
          </button>
        </div>
      </section>

      {/* 5. Mavzu Rejimi (Theme Mode) */}
      <section className={`border rounded-2xl p-3.5 space-y-2.5 shadow-sm ${
        isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6600] text-sm">🌓</span>
            <h3 className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.themeMode}
            </h3>
          </div>
          <span className="text-[10px] text-[#ff6600] font-bold">
            {theme === 'dark' ? "Tungi rejim yoqilgan" : "Kunduzgi rejim yoqilgan"}
          </span>
        </div>

        <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${
          isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => onSetTheme('light')}
            className={`py-2 px-2 rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 transition active:scale-95 ${
              theme === 'light'
                ? 'bg-[#ff6600] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sun size={13} />
            <span>{t.themeLight}</span>
          </button>

          <button
            onClick={() => onSetTheme('dark')}
            className={`py-2 px-2 rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 transition active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#ff6600] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon size={13} />
            <span>{t.themeDark}</span>
          </button>
        </div>
      </section>

      {/* 6. Xavfsizlik va Yordam (Security & Support) */}
      <section className={`border rounded-2xl p-3.5 space-y-2.5 shadow-sm ${
        isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xs font-black tracking-wide uppercase mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {t.securitySupport}
        </h3>

        <div className="space-y-1.5">
          {/* Notification Toggle */}
          <div className={`rounded-xl p-2.5 border flex items-center justify-between ${
            isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-sky-400 text-sm">🔔</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {t.botNotifs}
                </p>
                <p className="text-[10px] text-slate-400">
                  {t.botNotifsSub}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleNotifications}
              className={`w-10 h-5 rounded-full relative p-0.5 transition active:scale-95 ${
                notificationsEnabled ? 'bg-[#ff6600]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                notificationsEnabled ? 'ml-auto' : 'mr-auto'
              }`}></div>
            </button>
          </div>

          {/* 24/7 Support */}
          <div className={`rounded-xl p-2.5 border flex items-center justify-between ${
            isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">💬</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {t.support247}
                </p>
                <p className="text-[10px] text-slate-400">
                  {t.supportSub}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Version Info */}
          <div className={`rounded-xl p-2.5 border flex items-center justify-between ${
            isDark ? 'bg-[#111a2c] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-amber-400 text-sm">ℹ️</span>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {t.appVersion}
                </p>
                <p className="text-[10px] text-slate-400">
                  Aviasales Engine Connected
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              v2.4.0
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full mt-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-xl text-rose-400 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <LogOut size={14} />
            <span>{t.logout}</span>
          </button>
        </div>
      </section>

      <footer className="text-center pt-2 pb-4">
        <p className="text-[10px] text-slate-500 font-medium">
          TripCraft — O'zbekistondagi eng yaxshi turpaketlar qidiruvi.
        </p>
        <p className="text-[9px] text-slate-600 mt-0.5">
          Aviasales xalqaro arxitekturasi asosida yaratilgan
        </p>
      </footer>

    </div>
  );
};
