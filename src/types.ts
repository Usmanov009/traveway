export type TabType = 'search' | 'explore' | 'hot' | 'trips' | 'profile';
export type SearchMode = 'packages' | 'itinerary';
export type Language = 'uz' | 'ru' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface TourPackage {
  id: string;
  title: string;
  location: string;
  country: string;
  tag: string;
  badgeType: 'ultra' | 'luxury' | 'cheap' | 'culture';
  is5Star: boolean;
  rating: number;
  nights: string;
  flight: string;
  price: number;
  oldPrice?: number;
  img: string;
  saved: boolean;
  airline: string;
  insurance: string;
  transferIncluded: boolean;
  description: string;
  operator?: string;
  operatorUrl?: string;
  flightBlock?: string;
  mealPlan?: string;
  roomType?: string;
}

export interface Activity {
  id: string;
  time: string;
  duration: string;
  type: string;
  title: string;
  desc: string;
  transit: string;
  price: string;
  location: string;
  rating: string;
}

export interface DayPlan {
  label: string;
  subtitle: string;
  activities: Activity[];
}

export interface TripItinerary {
  destination: string;
  dates: string;
  style: string;
  travelers: number;
  days: {
    [day: number]: DayPlan;
  };
}

export interface Booking {
  id: string;
  tourTitle: string;
  dest: string;
  dates: string;
  status: string;
  voucherId: string;
  price: string;
  travelers: string;
  type: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PaymentCard {
  id: string;
  type: 'HUMO' | 'UZCARD' | 'VISA';
  last4: string;
  bank: string;
  isPrimary: boolean;
  expiry: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  telegram: string;
  id: string;
  cashback: number;
  passport: {
    type: string;
    number: string;
    expiry: string;
  };
}

export interface ExploreVibe {
  id: string;
  vibe: 'beach' | 'culture' | 'mountain' | 'luxury';
  title: string;
  badge: string;
  count: string;
  priceFrom: string;
  img: string;
  destKey: string;
}

export interface HotDeal {
  id: string;
  title: string;
  discount: string;
  oldPrice: string;
  price: string;
  timeLeft: string;
  flight: string;
  freeSeats: string;
  img: string;
  location: string;
  operator?: string;
  operatorUrl?: string;
  nights?: string;
}
