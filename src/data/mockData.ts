import { TourPackage, TripItinerary, ExploreVibe, HotDeal, PaymentCard, UserProfile, Booking } from '../types';
import { verifiedKompasPackages, verifiedKompasHotDeals } from '../services/kompasService';

export const initialTourPackages: TourPackage[] = verifiedKompasPackages;


export const initialParisItinerary: TripItinerary = {
  destination: "Paris, France",
  dates: "May 18 – 21 (3 Days)",
  style: "Culture & Highlights",
  travelers: 2,
  days: {
    1: {
      label: "Day 1",
      subtitle: "Classic Landmarks & River Seine",
      activities: [
        {
          id: "act-101",
          time: "09:30 AM",
          duration: "2h 30m",
          type: "Landmark",
          title: "Eiffel Tower Summit & Trocadéro",
          desc: "Panoramic morning elevator ascent to summit followed by photo walk across Trocadéro Gardens.",
          transit: "12 min metro ride (Line 6)",
          price: "$38",
          location: "Champ de Mars, 7th Arr.",
          rating: "4.9"
        },
        {
          id: "act-102",
          time: "12:45 PM",
          duration: "1h 15m",
          type: "Bistro & Food",
          title: "Lunch at Café de Flore",
          desc: "Historic Saint-Germain café for classic croque-monsieur and artisan hot chocolate.",
          transit: "8 min walk along Rue Bonaparte",
          price: "$28",
          location: "Saint-Germain-des-Prés",
          rating: "4.7"
        },
        {
          id: "act-103",
          time: "03:00 PM",
          duration: "3h 00m",
          type: "Museum",
          title: "Musée d'Orsay Impressionists",
          desc: "Skip-the-line pass to the converted railway station featuring Monet, Van Gogh, and Renoir.",
          transit: "15 min stroll across Pont Royal",
          price: "$19",
          location: "1 Rue de la Légion d'Honneur",
          rating: "4.8"
        },
        {
          id: "act-104",
          time: "07:30 PM",
          duration: "1h 45m",
          type: "Cruise",
          title: "Seine Sunset Vedettes Cruise",
          desc: "Open-air catamaran cruise navigating past illuminated Notre-Dame and Île de la Cité.",
          transit: "5 min from Pont Neuf pier",
          price: "$18",
          location: "Pont Neuf Pier",
          rating: "4.8"
        }
      ]
    },
    2: {
      label: "Day 2",
      subtitle: "Art, Royal Palaces & Montmartre",
      activities: [
        {
          id: "act-201",
          time: "09:00 AM",
          duration: "3h 00m",
          type: "World Heritage",
          title: "Louvre Masterpieces & Courtyard",
          desc: "Mona Lisa, Winged Victory, and Greek Antiquities with reserved morning quiet entry pass.",
          transit: "10 min walk",
          price: "$22",
          location: "Pyramide du Louvre",
          rating: "4.9"
        },
        {
          id: "act-202",
          time: "01:00 PM",
          duration: "1h 30m",
          type: "Pastry & Walk",
          title: "Palais-Royal Arcades & Pierre Hermé",
          desc: "Gourmet macaron tasting amidst Daniel Buren's striped columns and peaceful historic courtyards.",
          transit: "14 min metro line 12",
          price: "$16",
          location: "1st Arrondissement",
          rating: "4.8"
        },
        {
          id: "act-203",
          time: "04:30 PM",
          duration: "2h 30m",
          type: "Neighborhood",
          title: "Montmartre & Sacré-Cœur Funicular",
          desc: "Bohemian alleys, Place du Tertre painters, and golden hour views over the Paris cityscape.",
          transit: "5 min walk to Rue des Abbesses",
          price: "Free",
          location: "18th Arrondissement",
          rating: "4.9"
        },
        {
          id: "act-204",
          time: "08:00 PM",
          duration: "2h 00m",
          type: "Dinner & Wine",
          title: "Le Refuge des Fondus Experience",
          desc: "Traditional Savoyard fondue served in a warm communal atmosphere.",
          transit: "End of Day 2",
          price: "$34",
          location: "Rue des Trois Frères",
          rating: "4.6"
        }
      ]
    },
    3: {
      label: "Day 3",
      subtitle: "Latin Quarter, Catacombs & Rooftop Vibe",
      activities: [
        {
          id: "act-301",
          time: "10:00 AM",
          duration: "2h 00m",
          type: "Historic Quarter",
          title: "Shakespeare and Company & Panthéon",
          desc: "Legendary English bookstore followed by the majestic crypt and dome of the Panthéon.",
          transit: "15 min bus 38",
          price: "$14",
          location: "5th Arrondissement",
          rating: "4.8"
        },
        {
          id: "act-302",
          time: "01:30 PM",
          duration: "1h 45m",
          type: "Underground Tour",
          title: "Paris Underground Catacombs",
          desc: "Subterranean ossuary labyrinth holding historical remains of six million Parisians.",
          transit: "20 min metro to Galeries Lafayette",
          price: "$30",
          location: "Place Denfert-Rochereau",
          rating: "4.7"
        },
        {
          id: "act-303",
          time: "05:30 PM",
          duration: "2h 30m",
          type: "Sunset & Cocktails",
          title: "Galeries Lafayette Rooftop & Dinner",
          desc: "Free 360° panoramic viewing terrace overlooking Palais Garnier, followed by French tapas.",
          transit: "Farewell Paris Walk",
          price: "$45",
          location: "Boulevard Haussmann",
          rating: "4.9"
        }
      ]
    }
  }
};

export const alternativeActivities = [
  {
    title: "Centre Pompidou Modern Rooftop",
    desc: "High-tech 20th-century museum architecture with glass escalators and modern art collections.",
    transit: "9 min walk",
    price: "$17",
    location: "Place Georges-Pompidou",
    type: "Modern Art"
  },
  {
    title: "Sainte-Chapelle Stained Glass Marvel",
    desc: "Radiant Gothic chapel with 1,113 luminous stained glass windows depicting biblical epics.",
    transit: "10 min walk",
    price: "$13",
    location: "Île de la Cité",
    type: "Architecture"
  },
  {
    title: "Marché des Enfants Rouges Food Market",
    desc: "The oldest covered food market in Paris featuring authentic Mediterranean and French stalls.",
    transit: "15 min metro",
    price: "$20",
    location: "Le Marais",
    type: "Local Cuisine"
  },
  {
    title: "Atelier des Lumières Digital Exhibit",
    desc: "Immersive 360-degree digital light and sound projection inside a 19th-century foundry.",
    transit: "12 min metro",
    price: "$21",
    location: "11th Arrondissement",
    type: "Immersive Art"
  }
];

export const initialExploreVibes: ExploreVibe[] = [
  {
    id: 'v1',
    vibe: 'beach',
    title: 'Antalya Qaynoq Plyajlari',
    badge: 'Eng Ommabop',
    count: '142 ta mehmonxona',
    priceFrom: '$480 dan',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    destKey: 'Antalya, Turkiya'
  },
  {
    id: 'v2',
    vibe: 'culture',
    title: "Istanbul Tarixi & Bo'g'oz",
    badge: 'Tarixiy Joylar',
    count: '89 ta turpaket',
    priceFrom: '$390 dan',
    img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80',
    destKey: 'Istanbul, Turkiya'
  },
  {
    id: 'v3',
    vibe: 'mountain',
    title: "Tbilisi & Kavkaz Tog'lari",
    badge: 'Vizasiz Mamlakat',
    count: "34 ta yo'nalish",
    priceFrom: '$320 dan',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    destKey: 'Tbilisi, Gruziya'
  },
  {
    id: 'v4',
    vibe: 'luxury',
    title: 'Maldiv Suv Ustidagi Villalar',
    badge: 'Romantik',
    count: '27 ta orol kurorti',
    priceFrom: '$1,199 dan',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
    destKey: 'Male, Maldiv orollari'
  },
  {
    id: 'v5',
    vibe: 'beach',
    title: 'Sharm ash-Shayx Marjon Rifi',
    badge: 'Dayving & Quyosh',
    count: '65 ta tur',
    priceFrom: '$460 dan',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    destKey: 'Sharm ash-Shayx, Misr'
  }
];

export const initialHotDeals: HotDeal[] = verifiedKompasHotDeals;


export const initialUser: UserProfile = {
  name: 'Jasur Rahimov',
  phone: '+998 90 123-45-67',
  telegram: '@jasur_traveler',
  id: '#TC-884291',
  cashback: 45,
  passport: {
    type: 'Xorijga chiqish pasporti (Zagran)',
    number: 'FA •••• 9104',
    expiry: '14.10.2029 gacha'
  }
};

export const initialCards: PaymentCard[] = [
  {
    id: 'c1',
    type: 'HUMO',
    last4: '4892',
    bank: "O'zbekiston banki (UZS)",
    isPrimary: true,
    expiry: '09/28'
  },
  {
    id: 'c2',
    type: 'VISA',
    last4: '7710',
    bank: "Xalqaro turpaketlar uchun (USD)",
    isPrimary: false,
    expiry: '12/29'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'b1',
    tourTitle: 'Rixos Premium Belek 5*',
    dest: 'Antalya, Turkiya',
    dates: '10 May — 17 May, 2025',
    status: 'Tasdiqlangan',
    voucherId: 'VOUCHER-TR88210',
    price: '$1,480 (2 kishi)',
    travelers: '2 kishi, 1 xona',
    type: 'active',
    createdAt: '2025-05-01'
  },
  {
    id: 'b2',
    tourTitle: 'Dubay Marina Tour 4*',
    dest: 'Dubay, BAA',
    dates: '02 Iyul — 09 Iyul, 2025',
    status: 'Vaucher tayyor',
    voucherId: 'VOUCHER-DXB4412',
    price: '$1,190 (2 kishi)',
    travelers: '2 kishi, 1 xona',
    type: 'active',
    createdAt: '2025-05-03'
  }
];
