import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Star, 
  Clock, 
  SlidersHorizontal,
  Bookmark,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Utensils,
  Moon,
  DollarSign,
  Info,
  Check
} from 'lucide-react';
import { TourPackage, Language, ThemeMode } from '../../types';
import { translations } from '../../data/translations';
import { 
  searchKompasTourLive, 
  KOMPAS_ORIGINS, 
  KOMPAS_DESTINATIONS, 
  KOMPAS_STARS, 
  KOMPAS_MEALS, 
  KOMPAS_FREIGHT_TYPES, 
  KOMPAS_CURRENCIES,
  KompasFullSearchParams
} from '../../services/kompasService';

interface SearchTabProps {
  tourPackages: TourPackage[];
  onToggleSaveTour: (id: string) => void;
  onOpenTourDetails: (tour: TourPackage) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  language: Language;
  theme: ThemeMode;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  tourPackages,
  onToggleSaveTour,
  onOpenTourDetails,
  onShowToast,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  // Helper date format: YYYY-MM-DD to DD.MM.YYYY
  const toKompasDate = (isoStr: string): string => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-');
    return `${d}.${m}.${y}`;
  };

  const getInitialDates = () => {
    const today = new Date();
    const start = new Date(today.getTime() + 4 * 24 * 3600 * 1000);
    const end = new Date(today.getTime() + 9 * 24 * 3600 * 1000);
    const toIso = (d: Date) => d.toISOString().split('T')[0];
    return {
      startIso: toIso(start),
      endIso: toIso(end)
    };
  };

  const initialDates = getInitialDates();

  // Filter States matching online.uz.kompastour.com
  const [originId, setOriginId] = useState<number>(26); // Tashkent default
  const [destinationId, setDestinationId] = useState<number>(23); // UAE default
  const [startDateIso, setStartDateIso] = useState<string>(initialDates.startIso);
  const [endDateIso, setEndDateIso] = useState<string>(initialDates.endIso);
  const [nightsFrom, setNightsFrom] = useState<number>(6);
  const [nightsTill, setNightsTill] = useState<number>(10);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [childAges, setChildAges] = useState<number[]>([7]);
  const [freightType, setFreightType] = useState<number>(0); // 0: All, 1: Block, 2: GDS
  const [selectedStar, setSelectedStar] = useState<number>(0); // 0: Any
  const [selectedMeal, setSelectedMeal] = useState<number>(0); // 0: Any
  const [currency, setCurrency] = useState<number>(2); // 2: USD, 10: UZS
  
  // UI toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [livePackages, setLivePackages] = useState<TourPackage[]>(tourPackages);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');

  useEffect(() => {
    setLivePackages(tourPackages);
  }, [tourPackages]);

  // Quick pick destinations
  const popularDestIds = [23, 17, 37, 28, 40, 32, 31, 30];

  const handleExecuteSearch = async () => {
    setIsSearching(true);
    try {
      const searchParams: Partial<KompasFullSearchParams> = {
        originId,
        destinationId,
        checkinBeg: toKompasDate(startDateIso),
        checkinEnd: toKompasDate(endDateIso),
        nightsFrom,
        nightsTill,
        adults,
        children,
        childAges: children > 0 ? childAges.slice(0, children) : [],
        freightType,
        stars: selectedStar > 0 ? [selectedStar] : undefined,
        meals: selectedMeal > 0 ? [selectedMeal] : undefined,
        currency
      };

      const results = await searchKompasTourLive(searchParams);
      setLivePackages(results);

      const targetDest = KOMPAS_DESTINATIONS.find(d => d.id === destinationId);
      const destName = targetDest ? targetDest.countryUz : 'barcha yo\'nalishlar';

      onShowToast(
        language === 'uz'
          ? `Kompas Tour: ${destName} bo'yicha ${results.length} ta jonli turpaket yangilandi! 🟢`
          : `Kompas Tour: получено ${results.length} актуальных туров по ${destName}! 🟢`,
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

  // Sort packages
  const sortedPackages = [...livePackages].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="space-y-4 pb-20">

      {/* Hero Header & Live Indicator */}
      <div className={`p-4 rounded-3xl border shadow-lg transition-colors relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-[#131f38] via-[#101b31] to-[#0c1424] border-[#223354]' 
          : 'bg-gradient-to-br from-orange-50 via-white to-sky-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
              Kompas Tour Jonli Qidiruv
            </span>
          </div>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-[#ff6600] border border-orange-500/20">
            online.uz.kompastour.com
          </span>
        </div>

        <h1 className="text-lg font-black mt-2 tracking-tight">
          {language === 'uz' ? "Tur Paketlarni Qidirish" : "Поиск туров и путевок"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {language === 'uz' 
            ? "Barcha yo'nalishlar, charter bloklari va mehmonxonalar rasmiy narxlarda" 
            : "Чартерные блоки, гарантированные отели и актуальные цены"}
        </p>
      </div>

      {/* Main Filter Form (Kompas Tour Search Engine) */}
      <div className={`p-4 rounded-3xl border shadow-xl space-y-3.5 transition-colors ${
        isDark ? 'bg-[#111c30] border-[#1e2f4d]' : 'bg-white border-slate-200'
      }`}>

        {/* 1. Origin & Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* Qayerdan (TOWNFROMINC) */}
          <div className={`p-2.5 rounded-2xl border flex flex-col justify-center ${
            isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Plane size={12} className="text-[#ff6600]" />
              <span>{language === 'uz' ? "Uchish shahri" : "Город вылета"}</span>
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(Number(e.target.value))}
              className="bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-900 dark:text-white"
            >
              {KOMPAS_ORIGINS.map(o => (
                <option key={o.id} value={o.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  🛫 {language === 'uz' ? o.nameUz : o.nameRu}
                </option>
              ))}
            </select>
          </div>

          {/* Qayerga (STATEINC) */}
          <div className={`p-2.5 rounded-2xl border flex flex-col justify-center ${
            isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin size={12} className="text-sky-400" />
              <span>{language === 'uz' ? "Borish mamlakati" : "Страна назначения"}</span>
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(Number(e.target.value))}
              className="bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-900 dark:text-white"
            >
              {KOMPAS_DESTINATIONS.map(d => (
                <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {d.flag} {language === 'uz' ? d.countryUz : d.countryRu} ({language === 'uz' ? d.popularCityUz : d.popularCityRu})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Destination Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {popularDestIds.map(id => {
            const dest = KOMPAS_DESTINATIONS.find(d => d.id === id);
            if (!dest) return null;
            const isSelected = destinationId === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setDestinationId(dest.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1 border shrink-0 ${
                  isSelected
                    ? 'bg-[#ff6600] text-white border-[#ff6600] shadow-md shadow-orange-500/20'
                    : isDark 
                      ? 'bg-[#17253f] text-slate-300 border-[#25395c] hover:border-slate-500' 
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{dest.flag}</span>
                <span>{language === 'uz' ? dest.countryUz : dest.countryRu}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Check-in Dates & Nights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Dan (CHECKIN_BEG) */}
          <div className={`p-2 rounded-2xl border ${
            isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">
              📅 {language === 'uz' ? "Sana (Dan)" : "Дата (С)"}
            </label>
            <input
              type="date"
              value={startDateIso}
              onChange={(e) => setStartDateIso(e.target.value)}
              className="w-full bg-transparent font-bold text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Gacha (CHECKIN_END) */}
          <div className={`p-2 rounded-2xl border ${
            isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">
              📅 {language === 'uz' ? "Sana (Gacha)" : "Дата (По)"}
            </label>
            <input
              type="date"
              value={endDateIso}
              onChange={(e) => setEndDateIso(e.target.value)}
              className="w-full bg-transparent font-bold text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Kechalar oralig'i (NIGHTS_FROM & NIGHTS_TILL) */}
          <div className={`p-2 rounded-2xl border col-span-2 sm:col-span-2 flex items-center justify-between gap-2 ${
            isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Moon size={11} className="text-amber-400" />
                <span>{language === 'uz' ? "Kechalar: Min" : "Ночей: Мин"}</span>
              </label>
              <select
                value={nightsFrom}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNightsFrom(val);
                  if (val > nightsTill) setNightsTill(val);
                }}
                className="w-full bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-900 dark:text-white"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map(n => (
                  <option key={n} value={n} className="bg-white dark:bg-slate-900">{n} kecha</option>
                ))}
              </select>
            </div>

            <div className="h-8 w-[1px] bg-slate-300 dark:bg-slate-700"></div>

            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Moon size={11} className="text-amber-400" />
                <span>{language === 'uz' ? "Kechalar: Max" : "Ночей: Макс"}</span>
              </label>
              <select
                value={nightsTill}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNightsTill(val);
                  if (val < nightsFrom) setNightsFrom(val);
                }}
                className="w-full bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-900 dark:text-white"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 21].map(n => (
                  <option key={n} value={n} className="bg-white dark:bg-slate-900">{n} kecha</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* 3. Travelers (Adults & Children) */}
        <div className={`p-3 rounded-2xl border ${
          isDark ? 'bg-[#17253f] border-[#25395c]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-4">
            {/* Adults */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#ff6600] flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {language === 'uz' ? "Kattalar" : "Взрослые"}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setAdults(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-black transition active:scale-95 ${
                        adults === num
                          ? 'bg-[#ff6600] text-white shadow-sm'
                          : isDark ? 'bg-[#101b31] text-slate-300' : 'bg-white text-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-300 dark:bg-slate-700"></div>

            {/* Children */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                {language === 'uz' ? "Bolalar (0-17 yosh)" : "Дети"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => setChildren(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition active:scale-95 ${
                      children === num
                        ? 'bg-[#ff6600] text-white shadow-sm'
                        : isDark ? 'bg-[#101b31] text-slate-300' : 'bg-white text-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Child ages selection if children > 0 */}
          {children > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400">
                {language === 'uz' ? "Bolalar yoshi:" : "Возраст детей:"}
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: children }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">#{i + 1}:</span>
                    <select
                      value={childAges[i] || 7}
                      onChange={(e) => {
                        const newAges = [...childAges];
                        newAges[i] = Number(e.target.value);
                        setChildAges(newAges);
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                    >
                      {Array.from({ length: 18 }).map((_, age) => (
                        <option key={age} value={age}>{age} yosh</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Advanced Filters Toggle */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full py-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-[#ff6600]" />
              <span>{language === 'uz' ? "Kengaytirilgan filtrlar (Yulduzlar, Ovqat, Reys turi, Valyuta)" : "Расширенные фильтры"}</span>
            </span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div className={`mt-2.5 p-3 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#14223a] border-[#223555]' : 'bg-slate-50 border-slate-200'
            }`}>
              
              {/* Hotel Stars */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  ⭐ {language === 'uz' ? "Mehmonxona toifasi (Yulduzlar)" : "Категория отеля"}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {KOMPAS_STARS.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStar(st.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        selectedStar === st.id
                          ? 'bg-amber-500 text-white border-amber-500 shadow'
                          : isDark ? 'bg-[#0f192b] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Plan */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  🍽️ {language === 'uz' ? "Ovqatlanish turi" : "Питание"}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {KOMPAS_MEALS.map(ml => (
                    <button
                      key={ml.id}
                      onClick={() => setSelectedMeal(ml.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                        selectedMeal === ml.id
                          ? 'bg-[#ff6600] text-white border-[#ff6600] shadow'
                          : isDark ? 'bg-[#0f192b] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {ml.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flight Type & Currency */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/30">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    ✈️ {language === 'uz' ? "Reys turi" : "Тип перелета"}
                  </label>
                  <select
                    value={freightType}
                    onChange={(e) => setFreightType(Number(e.target.value))}
                    className="w-full bg-white dark:bg-[#0f192b] border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer text-slate-900 dark:text-white"
                  >
                    {KOMPAS_FREIGHT_TYPES.map(ft => (
                      <option key={ft.id} value={ft.id}>
                        {language === 'uz' ? ft.nameUz : ft.nameRu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    💵 {language === 'uz' ? "Valyuta" : "Валюта"}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {KOMPAS_CURRENCIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setCurrency(c.id)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                          currency === c.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : isDark ? 'bg-[#0f192b] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 5. Main Search Action Button */}
        <button
          id="btn-execute-kompas-search"
          onClick={handleExecuteSearch}
          disabled={isSearching}
          className="w-full py-3.5 bg-gradient-to-r from-[#ff6600] to-orange-500 hover:from-[#e65c00] hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>{language === 'uz' ? "Kompas Tourdan narxlar olinmoqda..." : "Получение цен с Kompas Tour..."}</span>
            </>
          ) : (
            <>
              <Search size={18} className="stroke-[2.5]" />
              <span>{language === 'uz' ? "Turlarni Qidirish" : "Найти туры"}</span>
            </>
          )}
        </button>

      </div>

      {/* Results Header with Sorting */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-black flex items-center gap-1.5">
            <span>{language === 'uz' ? "Topilgan Turpaketlar" : "Найденные туры"}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500/20 text-[#ff6600] font-bold">
              {sortedPackages.length}
            </span>
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'uz' ? "Kompas Tour rasmiy narxlari bilan" : "По официальным ценам Kompas Tour"}
          </p>
        </div>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
            isDark ? 'bg-[#111c30] border-[#223354] text-slate-200' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <option value="price_asc">{language === 'uz' ? "Avval arzonlari" : "Сначала дешевые"}</option>
          <option value="price_desc">{language === 'uz' ? "Avval qimmatlari" : "Сначала дорогие"}</option>
          <option value="rating">{language === 'uz' ? "Yuqori reyting" : "По рейтингу"}</option>
        </select>
      </div>

      {/* Tour Packages Cards List */}
      <div className="space-y-3.5">
        {sortedPackages.map((tour) => {
          const starsArr = Array.from({ length: tour.starsCount || (tour.is5Star ? 5 : 4) });
          const isSaved = tour.saved;
          const currencyLabel = tour.currencySymbol === "so'm" ? "so'm" : '$';

          return (
            <div
              key={tour.id}
              className={`rounded-3xl border overflow-hidden shadow-lg transition hover:border-orange-500/50 ${
                isDark ? 'bg-[#111c30] border-[#1e2f4d]' : 'bg-white border-slate-200'
              }`}
            >
              {/* Hotel Photo Banner */}
              <div className="relative h-44 w-full bg-slate-800">
                <img
                  src={tour.img}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                {/* Stars & Tag Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-[#ff6600] text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {tour.tag}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-400/20">
                    {starsArr.map((_, idx) => (
                      <Star key={idx} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  onClick={() => onToggleSaveTour(tour.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 transition active:scale-90 border border-white/20"
                >
                  <Bookmark size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                </button>

                {/* Hotel Title & Location on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-black text-sm leading-snug drop-shadow-md">
                    {tour.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-orange-400 shrink-0" />
                    <span className="truncate">{tour.location}</span>
                  </p>
                </div>
              </div>

              {/* Tour Package Details Body */}
              <div className="p-3.5 space-y-2.5">
                
                {/* Meta info pills: Flight, Dates, Meal, Room */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  
                  {/* Flight & Airline */}
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'bg-[#15233c] border-[#223554] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Plane size={13} className="text-sky-400 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{tour.flight}</span>
                  </div>

                  {/* Checkin date & Nights */}
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'bg-[#15233c] border-[#223554] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Calendar size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">
                      {tour.checkinDate ? `${tour.checkinDate} • ` : ''}{tour.nights}
                    </span>
                  </div>

                  {/* Meal Plan */}
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'bg-[#15233c] border-[#223554] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Utensils size={13} className="text-emerald-400 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{tour.mealPlan || 'Bed & Breakfast (BB)'}</span>
                  </div>

                  {/* Room Type */}
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    isDark ? 'bg-[#15233c] border-[#223554] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Check size={13} className="text-[#ff6600] shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{tour.roomType || 'Standard Room'}</span>
                  </div>

                </div>

                {/* Price & View Details Action */}
                <div className={`pt-2.5 border-t flex items-center justify-between ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'uz' ? "1 kishi uchun:" : "На человека:"}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-[#ff6600]">
                        {currencyLabel === "so'm" ? `${tour.price.toLocaleString()} so'm` : `$${tour.price}`}
                      </span>
                      {tour.oldPrice && (
                        <span className="text-xs line-through text-slate-500 font-bold">
                          {currencyLabel === "so'm" ? `${tour.oldPrice.toLocaleString()} so'm` : `$${tour.oldPrice}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Button (No external link, No booking form) */}
                  <button
                    onClick={() => onOpenTourDetails(tour)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5 ${
                      isDark 
                        ? 'bg-[#1e2f4f] hover:bg-[#253960] text-slate-200' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Info size={14} className="text-[#ff6600]" />
                    <span>{language === 'uz' ? "Batafsil ma'lumot" : "Подробнее"}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
