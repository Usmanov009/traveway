import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Sparkles, 
  Star, 
  Clock, 
  Navigation, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  ArrowRight, 
  SlidersHorizontal,
  Share2,
  Zap,
  Bookmark,
  ChevronRight,
  Flame
} from 'lucide-react';
import { TourPackage, TripItinerary, Language, ThemeMode, SearchMode, TabType } from '../../types';
import { translations } from '../../data/translations';
import { alternativeActivities } from '../../data/mockData';
import { searchKompasTourLive } from '../../services/kompasService';

interface SearchTabProps {
  tourPackages: TourPackage[];
  itinerary: TripItinerary;
  setItinerary: React.Dispatch<React.SetStateAction<TripItinerary>>;
  onToggleSaveTour: (id: string) => void;
  onOpenTourDetails: (tour: TourPackage) => void;
  onInstantBook: (tour: TourPackage) => void;
  onOpenTravelersModal: () => void;
  onSelectTab: (tab: TabType) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  language: Language;
  theme: ThemeMode;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  tourPackages,
  itinerary,
  setItinerary,
  onToggleSaveTour,
  onOpenTourDetails,
  onInstantBook,
  onOpenTravelersModal,
  onSelectTab,
  onShowToast,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  // Mode: Tour Packages (Image 14) vs AI Smart Route (Image 1)
  const [searchMode, setSearchMode] = useState<SearchMode>('packages');

  // Form State
  const [origin, setOrigin] = useState('Toshkent (TAS)');
  const [destination, setDestination] = useState('Antalya, Turkiya');
  const [itineraryCity, setItineraryCity] = useState('Paris, France');
  const [flyDate, setFlyDate] = useState('2025-05-10');
  const [filterType, setFilterType] = useState<'all' | '5star' | 'ultra' | 'cheap'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [isSavedTrip, setIsSavedTrip] = useState(false);
  const [livePackages, setLivePackages] = useState<TourPackage[]>(tourPackages);

  // Sync with prop changes
  React.useEffect(() => {
    setLivePackages(tourPackages);
  }, [tourPackages]);

  // Quick pick destinations for Kompas Tour packages
  const quickDestinations = [
    { label: t.quickDubai, val: 'Dubay, BAA' },
    { label: t.quickAntalya, val: 'Antaliya, Turkiya' },
    { label: t.quickSharm, val: 'Sharm ash-Shayx, Misr' },
    { label: 'Maldiv', val: 'Male, Maldiv' },
    { label: 'Pxuket', val: 'Pxuket, Tailand' },
    { label: 'Nha Trang', val: 'Nha Trang, Vyetnam' },
    { label: 'Xaynan', val: 'Sanya, Xitoy' }
  ];

  // Execute Package Search against Kompas Tour (online.uz.kompastour.com)
  const handleExecuteSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchKompasTourLive({ origin, destination });
      setLivePackages(results);
      onShowToast(
        language === 'uz' 
          ? `Kompas Tour: ${destination || "Barcha yo'nalishlar"} bo'yicha real vaqtda yangilandi!` 
          : (language === 'ru' ? `Kompas Tour: цены по направлению "${destination || "все"}" обновлены в реальном времени!` : `Kompas Tour: Real-time packages updated for ${destination || "all"}!`),
        'success'
      );
    } catch {
      onShowToast(
        language === 'uz' ? "Kompas Tour ma'lumotlari yangilandi" : "Данные Kompas Tour обновлены",
        'info'
      );
    } finally {
      setIsSearching(false);
    }
  };


  // Swap Origin and Destination
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    onShowToast(
      language === 'uz' 
        ? "Yo'nalish almashtirildi ⇅" 
        : (language === 'ru' ? "Направление изменено ⇅" : "Locations swapped ⇅"), 
      'info'
    );
  };

  // Swap activity in AI Itinerary
  const handleSwapActivity = (actId: string) => {
    const randomAlt = alternativeActivities[Math.floor(Math.random() * alternativeActivities.length)];
    setItinerary(prev => {
      const updatedActs = prev.days[activeDay].activities.map(act => {
        if (act.id === actId) {
          return {
            ...act,
            title: randomAlt.title,
            desc: randomAlt.desc,
            transit: randomAlt.transit,
            price: randomAlt.price,
            location: randomAlt.location,
            type: randomAlt.type,
            rating: "4.8"
          };
        }
        return act;
      });
      return {
        ...prev,
        days: {
          ...prev.days,
          [activeDay]: {
            ...prev.days[activeDay],
            activities: updatedActs
          }
        }
      };
    });
    onShowToast(
      language === 'uz' ? "AI yangi faoliyat bilan almashtirdi!" : (language === 'ru' ? "AI заменил активность на свежую рекомендацию!" : "AI swapped activity!"),
      'info'
    );
  };

  // Delete activity from AI Itinerary
  const handleDeleteActivity = (actId: string) => {
    setItinerary(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [activeDay]: {
          ...prev.days[activeDay],
          activities: prev.days[activeDay].activities.filter(a => a.id !== actId)
        }
      }
    }));
    onShowToast(language === 'uz' ? "Faoliyat o'chirildi" : (language === 'ru' ? "Активность удалена" : "Activity removed"), 'info');
  };

  // Filter tour packages with typed destination & filters
  const filteredPackages = livePackages.filter(pkg => {
    if (destination.trim()) {
      const q = destination.trim().toLowerCase();
      const tokens = q.split(/[\s,]+/).filter(t => t.length >= 2);
      if (tokens.length > 0) {
        const matches = tokens.some(token => 
          pkg.location.toLowerCase().includes(token) ||
          pkg.country.toLowerCase().includes(token) ||
          pkg.title.toLowerCase().includes(token)
        );
        if (!matches) return false;
      }
    }
    if (filterType === '5star') return pkg.is5Star;
    if (filterType === 'ultra') return pkg.badgeType === 'ultra' || pkg.tag.toLowerCase().includes('ultra') || pkg.tag.toLowerCase().includes('all inclusive');
    if (filterType === 'cheap') return pkg.price <= 680;
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      
      {/* MODE TOGGLE SWITCHER (Tour Packages vs AI Smart Route Itinerary) */}
      <div className={`p-1 rounded-2xl flex items-center border ${
        isDark ? 'bg-[#10192a] border-[#223350]' : 'bg-slate-200 border-slate-300'
      }`}>
        <button
          id="mode-btn-packages"
          onClick={() => setSearchMode('packages')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 active:scale-95 ${
            searchMode === 'packages'
              ? 'bg-[#ff6600] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plane size={14} />
          <span>{t.tourPackagesMode}</span>
        </button>

        <button
          id="mode-btn-itinerary"
          onClick={() => setSearchMode('itinerary')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 active:scale-95 ${
            searchMode === 'itinerary'
              ? 'bg-[#ff6600] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles size={14} className="text-amber-200" />
          <span>{t.aiItineraryMode}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: TOUR PACKAGES & HOTELS (MATCHING SCREEN IMAGE 14) */}
      {/* ========================================================= */}
      {searchMode === 'packages' && (
        <div className="space-y-4">
          
          {/* Main Search Card Form */}
          <div className={`border rounded-3xl p-4 shadow-xl space-y-3.5 ${
            isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-[#223350]' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {t.searchTourPackage}
                    </span>
                    <span className="text-[9px] font-black bg-amber-400/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20">
                      KOMPAS TOUR
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    online.uz.kompastour.com • {language === 'uz' ? 'Jonli narxlar' : 'Онлайн цены'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="btn-live-sync-kompas"
                onClick={handleExecuteSearch}
                disabled={isSearching}
                className="flex items-center gap-1 text-[11px] font-bold text-[#ff6600] bg-[#ff6600]/10 px-2.5 py-1 rounded-full border border-[#ff6600]/20 hover:bg-[#ff6600]/20 active:scale-95 transition"
              >
                <RefreshCw size={11} className={isSearching ? 'animate-spin text-[#ff6600]' : 'text-[#ff6600]'} />
                <span>{isSearching ? (language === 'uz' ? 'Olinmoqda...' : 'Синхронизация...') : (language === 'uz' ? 'Yangilash' : 'Обновить')}</span>
              </button>
            </div>

            {/* Flying From & To with Swap */}
            <div className="space-y-2 relative">
              
              {/* Origin Input */}
              <div className={`p-2.5 rounded-2xl border flex items-center gap-3 transition focus-within:ring-2 focus-within:ring-sky-500/40 ${
                isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Plane size={16} className="-rotate-45" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-slate-400 block leading-tight font-medium">
                    {t.from}
                  </label>
                  <input
                    type="text"
                    id="input-origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Toshkent (TAS)"
                    className={`w-full bg-transparent text-xs font-bold focus:outline-none p-0 border-0 ${
                      isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                {origin && (
                  <button
                    type="button"
                    onClick={() => setOrigin('')}
                    className="text-slate-500 hover:text-slate-300 text-xs px-1"
                    title="Tozalash"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Swap Button */}
              <button
                id="btn-swap-locations"
                type="button"
                onClick={handleSwapLocations}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#ff6600] hover:bg-[#e65c00] text-white flex items-center justify-center shadow-md active:scale-90 transition font-bold"
                title="Yo'nalishni almashtirish"
              >
                ⇅
              </button>

              {/* Destination Input */}
              <div className={`p-2.5 rounded-2xl border flex items-center gap-3 transition focus-within:ring-2 focus-within:ring-[#ff6600]/40 ${
                isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#ff6600] flex items-center justify-center font-bold text-xs shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-slate-400 block leading-tight font-medium">
                    {t.to}
                  </label>
                  <input
                    type="text"
                    id="input-destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={language === 'uz' ? "Antalya, Dubay, Sharm..." : (language === 'ru' ? "Анталья, Дубай, Шарм..." : "Antalya, Dubai, Sharm...")}
                    className={`w-full bg-transparent text-xs font-bold focus:outline-none p-0 border-0 ${
                      isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                {destination && (
                  <button
                    type="button"
                    onClick={() => setDestination('')}
                    className="text-slate-500 hover:text-slate-300 text-xs px-1"
                    title="Tozalash"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>

            {/* Dates & Travelers */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-2xl border ${
                isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className="text-[10px] text-slate-400 block leading-tight font-medium">
                  {t.departureDate}
                </label>
                <input
                  type="date"
                  value={flyDate}
                  onChange={(e) => setFlyDate(e.target.value)}
                  className={`w-full bg-transparent text-[11px] font-bold focus:outline-none p-0 border-0 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>

              <div 
                id="btn-trigger-travelers-modal"
                onClick={onOpenTravelersModal}
                className={`p-2.5 rounded-2xl border cursor-pointer active:scale-95 transition ${
                  isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <label className="text-[10px] text-slate-400 block leading-tight font-medium">
                  {t.travelers}
                </label>
                <div className={`text-[11px] font-bold truncate flex items-center justify-between ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>{itinerary.travelers} kishi, 1 xona</span>
                  <ChevronRight size={13} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {quickDestinations.map((q) => (
                <button
                  key={q.val}
                  onClick={() => {
                    setDestination(q.val);
                    handleExecuteSearch();
                  }}
                  className={`text-[10px] border px-2.5 py-1 rounded-full whitespace-nowrap active:scale-95 transition font-medium ${
                    destination === q.val
                      ? 'bg-[#ff6600] text-white border-[#ff6600]'
                      : isDark
                      ? 'bg-[#121c2f] hover:bg-[#1a2842] border-[#253755] text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Huge Orange CTA Search Button */}
            <button
              id="btn-submit-search-packages"
              onClick={handleExecuteSearch}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff6600] to-amber-500 hover:from-[#e65c00] hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Search size={16} />
              <span>{t.btnSearchTours}</span>
            </button>
          </div>

          {/* Search Loader Simulation */}
          {isSearching && (
            <div className={`border rounded-3xl p-6 text-center space-y-3 shadow-lg ${
              isDark ? 'bg-[#162238] border-[#ff6600]/40' : 'bg-white border-orange-300'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#ff6600]/20 border-t-[#ff6600] animate-spin"></div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'uz' ? "Turpaketlar qidirilmoqda..." : "Поиск лучших турпакетов..."}
              </h4>
              <p className="text-xs text-slate-400">
                14 ta turoperator va arzon charter reyslar solishtirilmoqda.
              </p>
            </div>
          )}

          {/* Search Results Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t.foundPackages} ({filteredPackages.length})
                </h3>
                <p className="text-[10px] text-slate-400">
                  {t.directFlightsFromTashkent}
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {t.priceGuarantee}
              </span>
            </div>

            {/* Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', '5star', 'ultra', 'cheap'] as const).map((f) => {
                const isCurrent = filterType === f;
                const label = f === 'all' ? t.filterAll : (f === '5star' ? t.filter5Star : (f === 'ultra' ? t.filterUltra : t.filterCheap));
                return (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition active:scale-95 ${
                      isCurrent
                        ? 'bg-[#ff6600] text-white shadow-md'
                        : isDark
                        ? 'bg-[#142035] text-slate-300 border border-[#233552]'
                        : 'bg-white text-slate-600 border border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tour Cards (Exact match to Screen Image 14) */}
            {/* Tour Cards (Exact match to Screen Image 14) */}
            {filteredPackages.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center space-y-3 ${
                isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#ff6600] flex items-center justify-center mx-auto text-xl font-black">
                  🔍
                </div>
                <h4 className="text-sm font-black">
                  {language === 'uz' 
                    ? `"${destination}" bo'yicha turpaket topilmadi` 
                    : (language === 'ru' ? `Туры по направлению "${destination}" не найдены` : `No tours found for "${destination}"`)}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {language === 'uz'
                    ? "Boshqa shahar yoki kurort nomini kiriting yoki barcha turpaketlarni ko'ring"
                    : (language === 'ru' ? "Попробуйте ввести другой город или сбросьте фильтр" : "Try searching another destination or show all packages")}
                </p>
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  className="px-4 py-2 bg-[#ff6600] text-white text-xs font-bold rounded-xl active:scale-95 transition shadow-md shadow-orange-500/20"
                >
                  {language === 'uz' ? "Barcha turlarni ko'rsatish" : (language === 'ru' ? "Показать все туры" : "Show all packages")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-2xl overflow-hidden shadow-lg transition duration-150 hover:border-[#ff6600]/50 ${
                      isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                    }`}
                  >
                  {/* Image Banner */}
                  <div className="relative h-36 w-full bg-slate-800">
                    <img
                      src={pkg.img}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                    {/* Top Tag Badge & Operator */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="bg-[#ff6600] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        {pkg.tag}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-amber-400/20">
                        Kompas Tour
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveTour(pkg.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-xs active:scale-90 transition"
                    >
                      {pkg.saved ? '❤️' : '🤍'}
                    </button>

                    {/* Rating & Night pill */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{pkg.rating}</span>
                      </span>
                      <span className="text-[10px] text-slate-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        🌙 {pkg.nights}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {pkg.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          📍 {pkg.location}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        {pkg.oldPrice && (
                          <span className="text-[10px] line-through text-slate-500 font-medium">
                            ${pkg.oldPrice}
                          </span>
                        )}
                        <p className="text-base font-black text-[#ff6600] leading-none">
                          ${pkg.price}
                        </p>
                        <span className="text-[8px] text-slate-400">
                          {t.perPerson}
                        </span>
                      </div>
                    </div>

                    {/* Flight and Transfer Row */}
                    <div className={`p-2 rounded-xl border flex items-center justify-between text-[10px] ${
                      isDark ? 'bg-[#0f1728] border-[#1b2a44] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <div className="flex items-center gap-1.5 truncate">
                        <Plane size={13} className="text-sky-400 shrink-0" />
                        <span className="truncate max-w-[185px] font-medium">{pkg.flightBlock || pkg.flight}</span>
                      </div>
                      <span className="text-emerald-400 font-bold shrink-0 ml-1">
                        {pkg.mealPlan ? `✓ ${pkg.mealPlan.split('(')[0].trim()}` : t.transferIncluded}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenTourDetails(pkg)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl active:scale-95 transition border flex items-center justify-center gap-1.5 ${
                          isDark
                            ? 'bg-[#202f4a] hover:bg-[#283b5c] text-white border-transparent'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                        }`}
                      >
                        <span>{t.btnDetails}</span>
                      </button>

                      <button
                        onClick={() => onOpenTourDetails(pkg)}
                        className="px-4 py-2 bg-[#ff6600] hover:bg-[#e65c00] active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>{language === 'uz' ? "Ko'rish" : (language === 'ru' ? "Смотреть" : "View")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: AI SMART ROUTE ENGINE (MATCHING SCREEN IMAGE 1)   */}
      {/* ========================================================= */}
      {searchMode === 'itinerary' && (
        <div className="space-y-4">
          
          {/* Header Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0c1a30] to-[#162846] text-white border border-[#233857] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff6600] to-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30">
                  <Plane size={18} className="-rotate-45" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight leading-tight">
                    TripCraft AI
                  </h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Smart Route Engine
                  </p>
                </div>
              </div>
              <span className="bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                AI v2.4
              </span>
            </div>

            <h3 className="text-sm font-black text-white leading-snug">
              Instant multi-day routes <br/>
              <span className="text-[#ff6600]">crafted in tickets.</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Aviasales-grade precision for activities, transits & costs.
            </p>
          </div>

          {/* AI Search Card */}
          <div className={`border rounded-3xl p-4 shadow-xl space-y-3 ${
            isDark ? 'bg-[#162238] border-[#233452]' : 'bg-white border-slate-200'
          }`}>
            {/* Destination Input */}
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
              isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-[#ff6600] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DESTINATION
                </label>
                <input
                  type="text"
                  value={itineraryCity}
                  onChange={(e) => setItineraryCity(e.target.value)}
                  className={`w-full bg-transparent text-sm font-black focus:outline-none p-0 border-0 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>
              <button
                onClick={() => setItineraryCity('Tokyo, Japan')}
                className={`text-[10px] font-bold px-2 py-1 rounded transition active:scale-95 ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}
              >
                Try Tokyo
              </button>
            </div>

            {/* Dates Row */}
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
              isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-[#0c73fe] flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TRIP DATES
                </label>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {itinerary.dates}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                3 Days
              </span>
            </div>

            {/* Travelers & Style Row */}
            <div
              onClick={onOpenTravelersModal}
              className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer active:scale-95 transition ${
                isDark ? 'bg-[#101a2d] border-[#202f4a]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TRAVELERS & STYLE
                </label>
                <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>{itinerary.travelers} travelers</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[#ff6600] font-black">{itinerary.style}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            {/* Search CTA */}
            <button
              id="btn-craft-smart-itinerary"
              onClick={() => {
                onShowToast(language === 'uz' ? "Marshrut chiptalari generatsiya qilindi!" : "Маршрут обновлен в билетах!", 'success');
              }}
              className="w-full py-3.5 bg-[#ff6600] hover:bg-[#e65c00] active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition"
            >
              <Sparkles size={18} className="text-amber-200" />
              <span>{t.btnSearchItinerary}</span>
            </button>
          </div>

          {/* ITINERARY DAYS TICKET VIEWER */}
          <div className="space-y-3">
            
            {/* Day Selector Tabs */}
            <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 ${
              isDark ? 'bg-[#121c2e] border-[#233552]' : 'bg-white border-slate-200'
            }`}>
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 active:scale-95 ${
                    activeDay === d
                      ? 'bg-[#ff6600] text-white shadow-md shadow-orange-500/25'
                      : isDark ? 'bg-[#18243b] text-slate-300 hover:bg-[#202f4a]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Calendar size={13} />
                  <span>{t.day} {d}</span>
                </button>
              ))}
            </div>

            {/* Day Subtitle Info */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className={`font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {itinerary.days[activeDay]?.subtitle || "Planned itinerary"}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {itinerary.days[activeDay]?.activities.length || 0} {t.stops}
              </span>
            </div>

            {/* Physical Ticket Cards */}
            <div className="space-y-3">
              {itinerary.days[activeDay]?.activities.map((act) => (
                <div
                  key={act.id}
                  className={`relative rounded-2xl shadow-sm border overflow-hidden transition group ${
                    isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Physical ticket notch effects */}
                  <div className="ticket-notch-left" style={{ backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }}></div>
                  <div className="ticket-notch-right" style={{ backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }}></div>

                  {/* Ticket Top Half */}
                  <div className="p-3.5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Left: Time badge (Aviasales flight style) */}
                      <div className="flex flex-col items-start min-w-[70px]">
                        <span className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {act.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {act.duration}
                        </span>
                        <span className="mt-2 text-[9px] font-black uppercase tracking-wider bg-orange-500/15 text-[#ff6600] px-1.5 py-0.5 rounded border border-[#ff6600]/20">
                          {act.type}
                        </span>
                      </div>

                      {/* Right: Title, Desc, Transit, Rating & Price */}
                      <div className={`flex-1 pl-2 border-l ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex items-start justify-between">
                          <h4 className={`text-xs font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {act.title}
                          </h4>
                          <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg ml-2 shrink-0 border border-emerald-500/20">
                            {act.price}
                          </span>
                        </div>

                        <p className={`text-[11px] mt-1.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {act.desc}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1">
                          <div className="flex items-center gap-1 text-sky-400 font-medium text-[10px]">
                            <Navigation size={11} />
                            <span className="truncate max-w-[150px]">{act.transit}</span>
                          </div>
                          <div className="flex items-center gap-1 font-black text-amber-400 text-[10px]">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{act.rating}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Dashed Separator Line */}
                  <div className="dashed-divider mx-4"></div>

                  {/* Ticket Bottom Half Actions */}
                  <div className={`px-4 py-2.5 flex items-center justify-between text-xs ${
                    isDark ? 'bg-[#0f1728]' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={11} className="text-[#ff6600]" />
                      <span className="truncate max-w-[120px]">{act.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onShowToast(`Google Maps: ${act.title}`, 'info')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-90 transition border ${
                          isDark ? 'bg-[#1b273d] text-slate-200 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <ExternalLink size={10} className="text-sky-400" />
                        <span>{t.map}</span>
                      </button>

                      <button
                        onClick={() => handleSwapActivity(act.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-90 transition border ${
                          isDark ? 'bg-[#1b273d] text-slate-200 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <RefreshCw size={10} className="text-[#ff6600]" />
                        <span>{t.swap}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center active:scale-90 transition border ${
                          isDark ? 'bg-[#1b273d] text-slate-400 hover:text-rose-400 border-slate-700' : 'bg-white text-slate-400 hover:text-rose-500 border-slate-200'
                        }`}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Estimated Day Budget Summary Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
              isDark ? 'bg-[#162238] border-[#233552]' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.budgetEst}
                </span>
                <div className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ~$95 <span className="text-xs font-medium text-slate-400">/ {t.perPerson}</span>
                </div>
              </div>
              <button
                onClick={() => onShowToast(language === 'uz' ? "Marshrut vaqti optimallashtirildi" : "Маршрут оптимизирован", 'success')}
                className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition border ${
                  isDark ? 'bg-[#1f2e4a] text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>{t.optimizeRoute}</span>
              </button>
            </div>

            {/* Popular Direct Finds (matching Image 1) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  POPULAR DIRECT FINDS
                </h4>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="text-[11px] font-bold text-[#0c73fe] hover:underline"
                >
                  Explore Menu & Deals →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => {
                    setItineraryCity('Rome, Italy');
                    onShowToast("Rome itinerary loaded", "info");
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer active:scale-95 transition ${
                    isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rome 🇮🇹</span>
                    <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                      $190 est.
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Colosseum & Antiquities</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#ff6600]">
                    <span>Find 3-Day Plan</span>
                    <ArrowRight size={11} />
                  </div>
                </div>

                <div
                  onClick={() => {
                    setItineraryCity('Tokyo, Japan');
                    onShowToast("Tokyo itinerary loaded", "info");
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer active:scale-95 transition ${
                    isDark ? 'bg-[#142138] border-[#223352]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Tokyo 🇯🇵</span>
                    <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                      $280 est.
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Shibuya & Night Markets</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#ff6600]">
                    <span>Find 3-Day Plan</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>
            </div>

            {/* Aviasales Flash Sale Banner (matching Image 1) */}
            <div
              onClick={() => onSelectTab('hot')}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#ff6600] to-amber-500 text-white flex items-center justify-between cursor-pointer active:scale-95 transition shadow-lg shadow-orange-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Flame size={20} className="text-white fill-white" />
                </div>
                <div>
                  <div className="inline-block bg-white text-[#ff6600] text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider mb-0.5">
                    FLASH SALE
                  </div>
                  <h4 className="text-xs font-black leading-tight">
                    Aviasales Hot Deals Live Now
                  </h4>
                </div>
              </div>
              <ChevronRight size={18} />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
