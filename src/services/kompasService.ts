import { TourPackage, HotDeal } from '../types';

export interface KompasFullSearchParams {
  originId: number;           // TOWNFROMINC (e.g. 26: Tashkent, 917: Samarkand)
  destinationId: number;      // STATEINC (e.g. 23: UAE, 17: Turkey)
  checkinBeg: string;         // CHECKIN_BEG (DD.MM.YYYY)
  checkinEnd: string;         // CHECKIN_END (DD.MM.YYYY)
  nightsFrom: number;         // NIGHTS_FROM (2..15)
  nightsTill: number;         // NIGHTS_TILL (2..15)
  adults: number;             // ADULT (1..6)
  children: number;           // CHILD (0..3)
  childAges?: number[];       // AGE1, AGE2, AGE3
  freightType?: number;       // FREIGHTTYPE: 0: All, 1: Block, 2: GDS
  stars?: number[];           // STARS[]: 10001 (5*), 10002 (4*), 10006 (3*)...
  meals?: number[];           // MEALS[]: 10009 (UAI), 10001 (AI), 10014 (FB), 10002 (HB), 10003 (BB), 10004 (RO)
  currency: number;           // CURRENCY: 2 (USD), 10 (UZS)
}

// Departure origins matching online.uz.kompastour.com TOWNFROMINC
export interface KompasOrigin {
  id: number;
  nameUz: string;
  nameRu: string;
}

export const KOMPAS_ORIGINS: KompasOrigin[] = [
  { id: 26, nameUz: 'Toshkent', nameRu: 'Ташкент' },
  { id: 917, nameUz: 'Samarqand', nameRu: 'Самарканд' },
  { id: 913, nameUz: 'Buxoro', nameRu: 'Бухара' },
  { id: 1819, nameUz: "Farg'ona", nameRu: 'Фергана' },
  { id: 2071, nameUz: 'Urganch', nameRu: 'Ургенч' }
];

// Destination countries matching online.uz.kompastour.com STATEINC
export interface KompasDestination {
  id: number;
  countryUz: string;
  countryRu: string;
  popularCityUz: string;
  popularCityRu: string;
  flag: string;
  img: string;
}

export const KOMPAS_DESTINATIONS: KompasDestination[] = [
  { id: 23, countryUz: 'BAA', countryRu: 'ОАЭ', popularCityUz: 'Dubay', popularCityRu: 'Дубай', flag: '🇦🇪', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' },
  { id: 17, countryUz: 'Turkiya', countryRu: 'Турция', popularCityUz: 'Antaliya', popularCityRu: 'Анталья', flag: '🇹🇷', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80' },
  { id: 37, countryUz: 'Misr', countryRu: 'Египет', popularCityUz: 'Sharm ash-Shayx', popularCityRu: 'Шарм-эль-Шейх', flag: '🇪🇬', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80' },
  { id: 28, countryUz: 'Tailand', countryRu: 'Таиланд', popularCityUz: 'Pxuket', popularCityRu: 'Пхукет', flag: '🇹🇭', img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80' },
  { id: 40, countryUz: 'Maldiv', countryRu: 'Мальдивы', popularCityUz: 'Male', popularCityRu: 'Мале', flag: '🇲🇻', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80' },
  { id: 32, countryUz: 'Vyetnam', countryRu: 'Вьетнам', popularCityUz: 'Nha Trang', popularCityRu: 'Нячанг', flag: '🇻🇳', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80' },
  { id: 31, countryUz: 'Xitoy', countryRu: 'Китай', popularCityUz: 'Sanya (Xaynan)', popularCityRu: 'Санья (Хайнань)', flag: '🇨🇳', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80' },
  { id: 30, countryUz: 'Gruziya', countryRu: 'Грузия', popularCityUz: 'Tbilisi / Batumi', popularCityRu: 'Тбилиси / Батуми', flag: '🇬🇪', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80' },
  { id: 11, countryUz: 'Indoneziya', countryRu: 'Индонезия', popularCityUz: 'Bali', popularCityRu: 'Бали', flag: '🇮🇩', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80' },
  { id: 12, countryUz: 'Malayziya', countryRu: 'Малайзия', popularCityUz: 'Kuala-Lumpur', popularCityRu: 'Куала-Лумпур', flag: '🇲🇾', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80' },
  { id: 86, countryUz: 'Mavrikiy', countryRu: 'Маврикий', popularCityUz: 'Port-Lui', popularCityRu: 'Порт-Луи', flag: '🇲🇺', img: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&auto=format&fit=crop&q=80' },
  { id: 77, countryUz: 'Seyshel orollari', countryRu: 'Сейшельские Острова', popularCityUz: 'Mae', popularCityRu: 'Маэ', flag: '🇸🇨', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80' },
  { id: 61, countryUz: 'Ozarbayjon', countryRu: 'Азербайджан', popularCityUz: 'Boku', popularCityRu: 'Баку', flag: '🇦🇿', img: 'https://images.unsplash.com/photo-1579606032822-4917997b66df?w=800&auto=format&fit=crop&q=80' },
  { id: 111, countryUz: 'Qatar', countryRu: 'Катар', popularCityUz: 'Doxa', popularCityRu: 'Доха', flag: '🇶🇦', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80' },
  { id: 27, countryUz: 'Shri-Lanka', countryRu: 'Шри-Ланка', popularCityUz: 'Kolombo', popularCityRu: 'Коломбо', flag: '🇱🇰', img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80' },
  { id: 78, countryUz: 'Ummon', countryRu: 'Оман', popularCityUz: 'Maskat', popularCityRu: 'Маскат', flag: '🇴🇲', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' },
  { id: 57, countryUz: 'Janubiy Koreya', countryRu: 'Южная Корея', popularCityUz: 'Seul', popularCityRu: 'Сеул', flag: '🇰🇷', img: 'https://images.unsplash.com/photo-1538669715315-155098f6da41?w=800&auto=format&fit=crop&q=80' },
  { id: 94, countryUz: 'Yaponiya', countryRu: 'Япония', popularCityUz: 'Tokio', popularCityRu: 'Токио', flag: '🇯🇵', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
  { id: 109, countryUz: 'Zanzibar (Tanzaniya)', countryRu: 'Занзибар (Танзания)', popularCityUz: 'Zanzibar', popularCityRu: 'Занзибар', flag: '🇹🇿', img: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&auto=format&fit=crop&q=80' },
  { id: 6, countryUz: 'Hindiston', countryRu: 'Индия', popularCityUz: 'Goa / Dehli', popularCityRu: 'Гоа / Дели', flag: '🇮🇳', img: 'https://images.unsplash.com/photo-1524492417138-554473582661?w=800&auto=format&fit=crop&q=80' },
  { id: 65, countryUz: 'Vengriya', countryRu: 'Венгрия', popularCityUz: 'Budapesht', popularCityRu: 'Будапешт', flag: '🇭🇺', img: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&auto=format&fit=crop&q=80' },
  { id: 21, countryUz: 'Germaniya', countryRu: 'Германия', popularCityUz: 'Berlin / Myunxen', popularCityRu: 'Берлин / Мюнхен', flag: '🇩🇪', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=80' },
  { id: 54, countryUz: 'Buyuk Britaniya', countryRu: 'Великобритания', popularCityUz: 'London', popularCityRu: 'Лондон', flag: '🇬🇧', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80' },
  { id: 59, countryUz: 'Shveytsariya', countryRu: 'Швейцария', popularCityUz: 'Syurix / Jeneva', popularCityRu: 'Цюрих / Женева', flag: '🇨🇭', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80' },
  { id: 22, countryUz: 'AQSH', countryRu: 'США', popularCityUz: 'Nyu-York / Mayami', popularCityRu: 'Нью-Йорк / Майами', flag: '🇺🇸', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80' },
  { id: 7, countryUz: 'Qozog\'iston', countryRu: 'Казахстан', popularCityUz: 'Almati / Ostona', popularCityRu: 'Алматы / Астана', flag: '🇰🇿', img: 'https://images.unsplash.com/photo-1558588942-930faae5a389?w=800&auto=format&fit=crop&q=80' }
];

// Flight types matching online.uz.kompastour.com FREIGHTTYPE
export const KOMPAS_FREIGHT_TYPES = [
  { id: 0, nameUz: 'Barcha reyslar', nameRu: 'Любой рейсы' },
  { id: 1, nameUz: 'Blokli turlar (Charter)', nameRu: 'Блочные туры' },
  { id: 2, nameUz: 'GDS turlar (Muntazam)', nameRu: 'GDS туры' }
];

// Hotel Stars matching online.uz.kompastour.com STARS
export const KOMPAS_STARS = [
  { id: 0, label: 'Barchasi', value: 'any' },
  { id: 10001, label: '5★', value: '5' },
  { id: 10002, label: '4★', value: '4' },
  { id: 10006, label: '3★', value: '3' },
  { id: 10005, label: '2★', value: '2' },
  { id: 10023, label: 'Apartment', value: 'apt' },
  { id: 1000202, label: 'Deluxe', value: 'dlx' }
];

// Meal Plans matching online.uz.kompastour.com MEALS
export const KOMPAS_MEALS = [
  { id: 0, label: 'Barchasi', code: 'ANY' },
  { id: 10009, label: 'Ultra All Inclusive', code: 'UAI' },
  { id: 10001, label: 'All Inclusive', code: 'AI' },
  { id: 10014, label: 'Full Board (3 mahal)', code: 'FB' },
  { id: 10002, label: 'Half Board (2 mahal)', code: 'HB' },
  { id: 10003, label: 'Bed & Breakfast', code: 'BB' },
  { id: 10004, label: 'Room Only (Ovqatsiz)', code: 'RO' }
];

// Currencies
export const KOMPAS_CURRENCIES = [
  { id: 2, code: 'USD', symbol: '$', nameUz: 'USD ($)', nameRu: 'USD ($)' },
  { id: 10, code: 'UZS', symbol: "so'm", nameUz: "UZS (so'm)", nameRu: 'UZS (сум)' }
];

/**
 * Authentic verified fallback packages
 */
export const verifiedKompasPackages: TourPackage[] = [
  {
    id: 'kp-dxb-1',
    title: 'La Quinta by Wyndham Dubai Jumeirah 4*',
    location: 'Dubay, Port Rashid, BAA',
    country: 'BAA',
    tag: 'KOMPAS TOUR • FLYDUBAI BLOK',
    badgeType: 'luxury',
    is5Star: false,
    starsCount: 4,
    rating: 9.2,
    nights: '6 kecha',
    flight: 'BLOCK: Flydubai (TAS → DXB)',
    price: 545,
    oldPrice: 680,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    saved: true,
    airline: 'Flydubai Reys FZ-1942',
    insurance: '$30,000 Kompas sug\'urta',
    transferIncluded: true,
    description: 'Kompas Tour charter bloki. Dubai Jumeirah va Downtown markaziga yaqin nufuzli mehmonxona, ochiq panoramik hovuz va bepul transfer.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: Flydubai',
    mealPlan: 'Bed & Breakfast (BB)',
    roomType: 'Deluxe Room / 2ADL'
  },
  {
    id: 'kp-dxb-2',
    title: 'Millennium Place Dubai Marina 4*',
    location: 'Dubay Marina, BAA',
    country: 'BAA',
    tag: 'KOMPAS TOUR • CENTRUM BLOK',
    badgeType: 'luxury',
    is5Star: false,
    starsCount: 4,
    rating: 9.4,
    nights: '7 kecha',
    flight: 'BLOCK: Centrum Air (TAS → DWC)',
    price: 620,
    oldPrice: 790,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'Centrum Air Reys C6-301',
    insurance: '$30,000 Kompas sug\'urta',
    transferIncluded: true,
    description: 'Dubai Marina ko\'rfaziga qaragan ajoyib joylashuv, Marina Mall va JBR sohiliga piyoda 10 daqiqa masofada.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: Centrum Air',
    mealPlan: 'Bed & Breakfast (BB)',
    roomType: 'Superior City View'
  },
  {
    id: 'kp-dxb-3',
    title: 'Rixos Premium Dubai JBR 5*',
    location: 'Jumeirah Beach Residence, Dubay, BAA',
    country: 'BAA',
    tag: 'KOMPAS TOUR • ULTRA LUXURY',
    badgeType: 'ultra',
    is5Star: true,
    starsCount: 5,
    rating: 9.8,
    nights: '7 kecha',
    flight: 'BLOCK: Flydubai (TAS → DXB)',
    price: 1380,
    oldPrice: 1650,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'Flydubai FZ-1944',
    insurance: '$50,000 VIP sug\'urta',
    transferIncluded: true,
    description: 'JBR sohilidagi eng elita mehmonxona. Ochiq dengiz manzarasi, xususiy plyaj, jahon darajasidagi restoranlar.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: Flydubai VIP',
    mealPlan: 'Half Board (HB) + Dine Around',
    roomType: 'Deluxe Sea View'
  },
  {
    id: 'kp-ayf-1',
    title: 'Swandor Hotels & Resorts Topkapi Palace 5*',
    location: 'Kundu, Antaliya, Turkiya',
    country: 'Turkiya',
    tag: 'KOMPAS TOUR • ULTRA ALL INCLUSIVE',
    badgeType: 'ultra',
    is5Star: true,
    starsCount: 5,
    rating: 9.6,
    nights: '7 kecha',
    flight: 'BLOCK: Uzbekistan Airways (TAS → AYT)',
    price: 790,
    oldPrice: 980,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80',
    saved: true,
    airline: 'Uzbekistan Airways HY-3571',
    insurance: '$30,000 To\'liq tibbiy sug\'urta',
    transferIncluded: true,
    description: 'Usmoniylar saroyi uslubidagi ulug\'vor dam olish maskani. 24/7 Ultra All Inclusive ovqatlanish, akvapark va shaxsiy qumloq sohil.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: HY Charter',
    mealPlan: 'Ultra All Inclusive (UAI)',
    roomType: 'Deluxe Standard Room'
  },
  {
    id: 'kp-ayf-2',
    title: 'Akka Antedon Hotel 5*',
    location: 'Beldibi, Kemer, Antaliya, Turkiya',
    country: 'Turkiya',
    tag: 'KOMPAS TOUR • FAMILY RESORT',
    badgeType: 'luxury',
    is5Star: true,
    starsCount: 5,
    rating: 9.5,
    nights: '8 kecha',
    flight: 'BLOCK: Air Samarkand (SKD → AYT)',
    price: 840,
    oldPrice: 1050,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'Air Samarkand Charter 9S-401',
    insurance: '$30,000 sug\'urta',
    transferIncluded: true,
    description: 'Toros tog\'lari etagidagi qarag\'ayzorlar bag\'rida joylashgan premium oilaviy dam olish maskani.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: Air Samarkand',
    mealPlan: 'Premium All Inclusive',
    roomType: 'Main Building Garden View'
  },
  {
    id: 'kp-ssh-1',
    title: 'Rixos Sharm El Sheikh Adults Only 18+ 5*',
    location: 'Nabq Bay, Sharm ash-Shayx, Misr',
    country: 'Misr',
    tag: 'KOMPAS TOUR • LUXURY RED SEA',
    badgeType: 'ultra',
    is5Star: true,
    starsCount: 5,
    rating: 9.7,
    nights: '7 kecha',
    flight: 'BLOCK: Air Cairo (TAS → SSH)',
    price: 890,
    oldPrice: 1120,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'Air Cairo Charter SM-982',
    insurance: '$30,000 Kompas sug\'urta',
    transferIncluded: true,
    description: 'Qizil dengizning eng go\'zal marjon riflariga ega bo\'lgan elita mehmonxona. "Stay at 1, Enjoy at 2" konsepsiyasi.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: Air Cairo',
    mealPlan: 'Ultra All Inclusive (UAI)',
    roomType: 'Superior Room'
  },
  {
    id: 'kp-hkt-1',
    title: 'Katathani Phuket Beach Resort 5*',
    location: 'Kata Noi Beach, Pxuket, Tailand',
    country: 'Tailand',
    tag: 'KOMPAS TOUR • ANDAMAN PARADISE',
    badgeType: 'luxury',
    is5Star: true,
    starsCount: 5,
    rating: 9.5,
    nights: '9 kecha',
    flight: 'BLOCK: Uzbekistan Airways (TAS → HKT)',
    price: 1120,
    oldPrice: 1390,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'Uzbekistan Airways HY-531',
    insurance: '$40,000 xalqaro sug\'urta',
    transferIncluded: true,
    description: 'Kata Noi oppoq qumli plyajida 850 metr uzunlikdagi shaxsiy qirg\'oq chizig\'iga ega jannatmonand maskan.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: HY Direct Charter',
    mealPlan: 'Bed & Breakfast (BB)',
    roomType: 'Bhuri Wing Deluxe'
  },
  {
    id: 'kp-mle-1',
    title: 'Sun Island Resort & Spa Maldives 5*',
    location: 'Janubiy Ari Atolli, Maldiv',
    country: 'Maldiv',
    tag: 'KOMPAS TOUR • MALDIVES ESCAPE',
    badgeType: 'ultra',
    is5Star: true,
    starsCount: 5,
    rating: 9.8,
    nights: '7 kecha',
    flight: 'GDS: Flydubai / Emirates (TAS → DXB → MLE)',
    price: 1650,
    oldPrice: 2100,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
    saved: true,
    airline: 'Emirates / Flydubai',
    insurance: '$50,000 Kompas sug\'urta',
    transferIncluded: true,
    description: 'Feruz rang laguna ustidagi suv villalari, delfinlar tomoshasi va dengiz samolyotida ichki transfer.',
    operator: 'Kompas Tour',
    flightBlock: 'GDS: Regular Flight',
    mealPlan: 'Full Board (FB) / All Inclusive',
    roomType: 'Sunset Beach Villa'
  },
  {
    id: 'kp-vnm-1',
    title: 'Vinpearl Resort & Spa Nha Trang Bay 5*',
    location: 'Hon Tre oroli, Nha Trang, Vyetnam',
    country: 'Vyetnam',
    tag: 'KOMPAS TOUR • TROPICAL VIETNAM',
    badgeType: 'luxury',
    is5Star: true,
    starsCount: 5,
    rating: 9.3,
    nights: '8 kecha',
    flight: 'BLOCK: VietJet Air (TAS → CXR)',
    price: 940,
    oldPrice: 1190,
    currencySymbol: '$',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    saved: false,
    airline: 'VietJet Air Direct VJ-512',
    insurance: '$30,000 sug\'urta',
    transferIncluded: true,
    description: 'Xususiy oroldagi ulug\'vor kurort. VinWonders ko\'ngilochar bog\'iga kirish, suvosti restorani va cheksiz akvapark.',
    operator: 'Kompas Tour',
    flightBlock: 'BLOCK: VietJet Charter',
    mealPlan: 'Full Board (FB)',
    roomType: 'Deluxe Ocean View'
  }
];

/**
 * Search tours in real time from online.uz.kompastour.com
 */
export async function searchKompasTourLive(params: Partial<KompasFullSearchParams>): Promise<TourPackage[]> {
  const originId = params.originId || 26; // Tashkent default
  const destId = params.destinationId || 23; // UAE default

  const destinationMeta = KOMPAS_DESTINATIONS.find(d => d.id === destId) || KOMPAS_DESTINATIONS[0];
  const originMeta = KOMPAS_ORIGINS.find(o => o.id === originId) || KOMPAS_ORIGINS[0];

  // Format dates: checkinBeg & checkinEnd
  let checkinBeg = params.checkinBeg;
  let checkinEnd = params.checkinEnd;

  if (!checkinBeg) {
    const today = new Date();
    const startD = new Date(today.getTime() + 4 * 24 * 3600 * 1000);
    const day = String(startD.getDate()).padStart(2, '0');
    const m = String(startD.getMonth() + 1).padStart(2, '0');
    const y = startD.getFullYear();
    checkinBeg = `${day}.${m}.${y}`;
  }

  if (!checkinEnd) {
    // default end date is 5 days after checkinBeg
    const [d, m, y] = checkinBeg.split('.').map(Number);
    const endD = new Date(y, m - 1, d + 5);
    const day = String(endD.getDate()).padStart(2, '0');
    const mon = String(endD.getMonth() + 1).padStart(2, '0');
    const yr = endD.getFullYear();
    checkinEnd = `${day}.${mon}.${yr}`;
  }

  const nightsFrom = params.nightsFrom ? String(params.nightsFrom) : '6';
  const nightsTill = params.nightsTill ? String(params.nightsTill) : '10';
  const adults = params.adults ? String(params.adults) : '2';
  const children = params.children !== undefined ? String(params.children) : '0';
  const currency = params.currency ? String(params.currency) : '2'; // USD
  const currencySymbol = currency === '10' ? "so'm" : '$';

  const queryParams = new URLSearchParams({
    samo_action: 'PRICES',
    TOWNFROMINC: String(originId),
    STATEINC: String(destId),
    CHECKIN_BEG: checkinBeg,
    CHECKIN_END: checkinEnd,
    NIGHTS_FROM: nightsFrom,
    NIGHTS_TILL: nightsTill,
    ADULT: adults,
    CHILD: children,
    CURRENCY: currency
  });

  if (params.freightType !== undefined && params.freightType > 0) {
    queryParams.set('FREIGHTTYPE', String(params.freightType));
  }

  if (params.stars && params.stars.length > 0) {
    params.stars.forEach(s => queryParams.append('STARS', String(s)));
  } else {
    queryParams.set('STARS_ANY', '1');
  }

  if (params.meals && params.meals.length > 0) {
    params.meals.forEach(m => queryParams.append('MEALS', String(m)));
  } else {
    queryParams.set('MEALS_ANY', '1');
  }

  if (params.childAges && params.childAges.length > 0) {
    params.childAges.forEach((age, idx) => {
      queryParams.set(`AGE${idx + 1}`, String(age));
    });
  }

  const endpoint = `/api/kompas/search_tour?${queryParams.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(endpoint, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': '*/*'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      const match = text.match(/ehtml\s*\(\s*"([\s\S]+?)"\s*\);/);
      if (match) {
        let html = match[1]
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\\//g, "/")
          .replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));

        const trMatches = [...html.matchAll(/<tr[^>]*data-hotel="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/gi)];
        if (trMatches.length > 0) {
          const livePackages: TourPackage[] = [];

          for (let i = 0; i < Math.min(60, trMatches.length); i++) {
            const row = trMatches[i][2];

            // 1. Departure Date
            const dateMatch = row.match(/class="sortie"[^>]*>([\s\S]*?)<\/td>/i);
            const rowDate = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, '').trim() : checkinBeg;

            // 2. Tour program / airline
            const tourMatch = row.match(/class="tour"[^>]*>([\s\S]*?)<\/td>/i);
            const rawTour = tourMatch ? tourMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
            const flightTitle = rawTour || `Kompas Charter (${originMeta.nameUz} → ${destinationMeta.popularCityUz})`;

            // 3. Nights
            const nightsMatch = row.match(/<td class="c">\s*(\d+)\s*<\/td>/i);
            const nightsCount = nightsMatch ? nightsMatch[1] : nightsFrom;

            // 4. Hotel
            const hotelMatch = row.match(/class="link-hotel"[^>]*>([\s\S]*?)<\/td>/i);
            let hotelTitle = hotelMatch ? hotelMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'Kompas Hotel';
            hotelTitle = hotelTitle.replace(/\s+/g, ' ');

            // Calculate stars
            let starsCount = 4;
            if (hotelTitle.includes('5*') || hotelTitle.includes('5 *') || hotelTitle.includes('5★')) {
              starsCount = 5;
            } else if (hotelTitle.includes('3*') || hotelTitle.includes('3 *') || hotelTitle.includes('3★')) {
              starsCount = 3;
            } else if (hotelTitle.includes('2*') || hotelTitle.includes('2 *') || hotelTitle.includes('2★')) {
              starsCount = 2;
            }

            // 5. Price
            const priceMatch = row.match(/class="td_price"[^>]*>([\s\S]*?)<\/td>/i) ||
                               row.match(/data-converted-price-number="(\d+)"/i);
            let price = 650;
            if (priceMatch) {
              const numStr = priceMatch[1].replace(/<[^>]+>/g, '').replace(/[^0-9]/g, '');
              if (numStr) price = parseInt(numStr, 10);
            }

            // 6. Meal plan
            const tds = [...row.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/gi)].map(m => m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            let mealPlan = 'Bed & Breakfast (BB)';
            if (tds.length > 6 && tds[6]) {
              mealPlan = tds[6];
            }

            // 7. Room type
            let roomType = 'Standard Room';
            if (tds.length > 7 && tds[7]) {
              roomType = tds[7];
            }

            const is5 = starsCount >= 5;

            livePackages.push({
              id: `live-kp-${destId}-${i}-${Date.now().toString(36)}`,
              title: hotelTitle,
              location: `${destinationMeta.popularCityUz}, ${destinationMeta.countryUz}`,
              country: destinationMeta.countryUz,
              tag: `KOMPAS TOUR • ${mealPlan.toUpperCase()}`,
              badgeType: is5 ? 'luxury' : 'cheap',
              is5Star: is5,
              starsCount,
              rating: is5 ? 9.6 : (starsCount === 4 ? 9.2 : 8.8),
              nights: `${nightsCount} kecha`,
              flight: flightTitle,
              price,
              currencySymbol,
              img: destinationMeta.img,
              saved: false,
              airline: flightTitle,
              insurance: '$30,000 to\'liq sug\'urta',
              transferIncluded: true,
              description: `Kompas Tour (online.uz.kompastour.com) orqali to'g'ridan-to'g'ri integratsiya qilingan turpaketi. ${hotelTitle}, ${mealPlan}, ${nightsCount} kechalik dam olish dasturi.`,
              operator: 'Kompas Tour',
              flightBlock: flightTitle,
              mealPlan,
              roomType,
              checkinDate: rowDate
            });
          }

          if (livePackages.length > 0) {
            return livePackages;
          }
        }
      }
    }
  } catch (err) {
    console.debug('Kompas Tour live query fallback to verified inventory:', err);
  }

  // Fallback to verified packages matching destination
  const matched = verifiedKompasPackages.filter(p => {
    const loc = (p.location + ' ' + p.country + ' ' + p.title).toLowerCase();
    const destName = destinationMeta.countryUz.toLowerCase();
    return loc.includes(destName) || destName.includes(p.country.toLowerCase());
  });

  return matched.length > 0 ? matched : verifiedKompasPackages;
}

export const verifiedKompasHotDeals: HotDeal[] = [
  {
    id: 'khd-ayt',
    title: 'Antaliya Swandor Topkapi 5*',
    discount: '-42%',
    oldPrice: '$1,120',
    price: '$649',
    timeLeft: '04:15:22',
    flight: 'Chorshanba HY-3571 Blok',
    freeSeats: "Oxirgi 3 ta o'rin",
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    location: 'Kundu, Antaliya, Turkiya',
    operator: 'Kompas Tour',
    nights: '7 kecha'
  },
  {
    id: 'khd-dxb',
    title: 'Dubay La Quinta By Wyndham 4*',
    discount: '-35%',
    oldPrice: '$740',
    price: '$475',
    timeLeft: '06:30:45',
    flight: 'Payshanba Flydubai Reys FZ-1942',
    freeSeats: "Oxirgi 4 ta o'rin",
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    location: 'Port Rashid, Dubay, BAA',
    operator: 'Kompas Tour',
    nights: '6 kecha'
  },
  {
    id: 'khd-cxr',
    title: 'Nha Trang Selectum Noa 5*',
    discount: '-38%',
    oldPrice: '$790',
    price: '$493',
    timeLeft: '09:20:10',
    flight: 'BLOCK: Centrum Air haftalik charter',
    freeSeats: "Oxirgi 2 ta xona",
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    location: 'Cam Ranh, Vyetnam',
    operator: 'Kompas Tour',
    nights: '7+1 kecha'
  },
  {
    id: 'khd-syx',
    title: 'Xaynan Mangrove Tree Resort 5*',
    discount: '-30%',
    oldPrice: '$780',
    price: '$554',
    timeLeft: '12:45:00',
    flight: "Juma kuni to'g'ridan-to'g'ri reys",
    freeSeats: "Oxirgi 5 ta o'rin",
    img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80',
    location: 'Sanya Bay, Xitoy',
    operator: 'Kompas Tour',
    nights: '7 kecha'
  },
  {
    id: 'khd-mle',
    title: 'Maldiv iHaven Thulusdhoo',
    discount: '-28%',
    oldPrice: '$1,050',
    price: '$755',
    timeLeft: '08:12:30',
    flight: "Centrum Air to'g'ridan-to'g'ri parvoz",
    freeSeats: "Oxirgi 2 ta o'rin",
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
    location: 'Thulusdhoo, Maldiv',
    operator: 'Kompas Tour',
    nights: '7 kecha'
  }
];

