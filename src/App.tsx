import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Language, 
  ThemeMode, 
  TourPackage, 
  TripItinerary, 
  UserProfile, 
  PaymentCard, 
  Booking,
  HotDeal 
} from './types';
import { 
  initialTourPackages, 
  initialParisItinerary, 
  initialUser, 
  initialCards, 
  initialBookings 
} from './data/mockData';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SearchTab } from './components/tabs/SearchTab';
import { ExploreTab } from './components/tabs/ExploreTab';
import { HotSalesTab } from './components/tabs/HotSalesTab';
import { TripsTab } from './components/tabs/TripsTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { TourDetailsModal } from './components/modals/TourDetailsModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { QrModal } from './components/modals/QrModal';
import { TravelersModal } from './components/modals/TravelersModal';
import { Toast, ToastData } from './components/Toast';
import { LoginPage } from './components/auth/LoginPage';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tripcraft_auth') === 'true';
  });
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('tripcraft_guest') === 'true';
  });

  // Navigation & Preferences
  const [currentTab, setCurrentTab] = useState<TabType>('search');
  const [language, setLanguage] = useState<Language>('uz');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Core Data State
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(initialTourPackages);
  const [itinerary, setItinerary] = useState<TripItinerary>(initialParisItinerary);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [cards, setCards] = useState<PaymentCard[]>(initialCards);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Modals State
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastData = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const handleLoginSuccess = (userData: Partial<UserProfile>, guest = false) => {
    if (guest) {
      setIsGuest(true);
      setIsAuthenticated(true);
      localStorage.setItem('tripcraft_auth', 'true');
      localStorage.setItem('tripcraft_guest', 'true');
    } else {
      setIsGuest(false);
      setIsAuthenticated(true);
      localStorage.setItem('tripcraft_auth', 'true');
      localStorage.removeItem('tripcraft_guest');
      if (userData.name || userData.phone) {
        setUser(prev => ({
          ...prev,
          ...userData,
          id: userData.id || prev.id
        }));
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm(
      language === 'uz' 
        ? "Rostdan ham akkauntdan chiqmoqchimisiz?" 
        : (language === 'ru' ? "Вы уверены, что хотите выйти?" : "Are you sure you want to log out?")
    )) {
      setIsAuthenticated(false);
      setIsGuest(false);
      localStorage.removeItem('tripcraft_auth');
      localStorage.removeItem('tripcraft_guest');
      setUser(initialUser);
      showToast(
        language === 'uz' 
          ? "Akkauntdan muvaffaqiyatli chiqildi" 
          : (language === 'ru' ? "Вы вышли из системы" : "Successfully logged out"), 
        'info'
      );
    }
  };

  // Toggle Save / Favorite Tour
  const handleToggleSaveTour = (tourId: string) => {
    setTourPackages(prev =>
      prev.map(pkg => {
        if (pkg.id === tourId) {
          const nextSaved = !pkg.saved;
          showToast(
            nextSaved
              ? (language === 'uz' ? "Turpaket saqlanganlarga qo'shildi ❤️" : "Тур добавлен в сохраненные ❤️")
              : (language === 'uz' ? "Saqlanganlardan olib tashlandi" : "Удалено из сохраненных"),
            nextSaved ? 'success' : 'info'
          );
          return { ...pkg, saved: nextSaved };
        }
        return pkg;
      })
    );
  };

  // Instant Booking
  const handleBookTour = (tour: TourPackage) => {
    const newBooking: Booking = {
      id: 'b-' + Date.now(),
      tourTitle: tour.title,
      dest: tour.location,
      dates: '10 May — 17 May, 2025',
      status: language === 'uz' ? 'Tasdiqlangan' : (language === 'ru' ? 'Подтверждено' : 'Confirmed'),
      voucherId: 'VOUCHER-TC' + Math.floor(10000 + Math.random() * 90000),
      price: `$${tour.price * 2} (2 kishi)`,
      travelers: '2 kishi, 1 xona',
      type: 'active',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsTourModalOpen(false);
    showToast(
      language === 'uz'
        ? `🎉 "${tour.title}" band qilindi! Vaucher 'Turlarim' bo'limida saqlandi.`
        : `🎉 "${tour.title}" забронирован! Ваучер доступен в «Мои туры».`,
      'success'
    );

    setTimeout(() => {
      setCurrentTab('trips');
    }, 700);
  };

  // Book Hot Flash Deal
  const handleBookHotDeal = (deal: HotDeal) => {
    const newBooking: Booking = {
      id: 'b-hot-' + Date.now(),
      tourTitle: deal.title,
      dest: deal.location,
      dates: 'Yaqin 3 kun ichida',
      status: language === 'uz' ? 'Tasdiqlangan' : (language === 'ru' ? 'Подтверждено' : 'Confirmed'),
      voucherId: 'VOUCHER-HOT' + Math.floor(1000 + Math.random() * 9000),
      price: `${deal.price} (1 kishi)`,
      travelers: '1 kishi',
      type: 'active',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(
      language === 'uz'
        ? `🔥 Qaynoq tur "${deal.title}" muvaffaqiyatli band qilindi!`
        : `🔥 Горящий тур "${deal.title}" успешно забронирован!`,
      'success'
    );

    setTimeout(() => {
      setCurrentTab('trips');
    }, 600);
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast(
      language === 'uz'
        ? "Buyurtma bekor qilindi. Mablag' hisobingizga qaytarildi."
        : "Бронирование отменено. Средства возвращены на карту.",
      'info'
    );
  };

  // Download Voucher
  const handleDownloadVoucher = (voucherId: string) => {
    showToast(
      language === 'uz'
        ? `📄 ${voucherId} vaucheri PDF holatida Telegram chatga yuborildi!`
        : `📄 Ваучер ${voucherId} отправлен в Telegram бот!`,
      'success'
    );
  };

  // Add Card
  const handleAddCard = (newCardData: Omit<PaymentCard, 'id'>) => {
    const newCard: PaymentCard = {
      ...newCardData,
      id: 'c-' + Date.now()
    };
    setCards(prev => [...prev, newCard]);
    showToast(
      language === 'uz'
        ? "Yangi to'lov kartasi muvaffaqiyatli saqlandi! 💳"
        : "Новая карта успешно привязана! 💳",
      'success'
    );
  };

  // Set Primary Card
  const handleSetPrimaryCard = (cardId: string) => {
    setCards(prev =>
      prev.map(c => ({
        ...c,
        isPrimary: c.id === cardId
      }))
    );
    showToast(
      language === 'uz' ? "Asosiy to'lov kartasi yangilandi" : "Основная карта обновлена",
      'info'
    );
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    if (cards.length <= 1) {
      showToast(
        language === 'uz'
          ? "Kamida 1 ta to'lov kartasi qolishi kerak!"
          : "Должна остаться хотя бы одна активная карта!",
        'error'
      );
      return;
    }
    setCards(prev => {
      const remaining = prev.filter(c => c.id !== cardId);
      if (!remaining.some(c => c.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
    showToast(language === 'uz' ? "Karta o'chirildi" : "Карта удалена", 'info');
  };

  // Update Passport
  const handleUpdatePassport = () => {
    const input = window.prompt(
      language === 'uz' ? "Yangi pasport seriya va raqamini kiriting:" : "Введите серию и номер загранпаспорта:",
      "FA 9876543"
    );
    if (input) {
      const masked = input.substring(0, 3) + '•••• ' + input.slice(-4);
      setUser(prev => ({
        ...prev,
        passport: {
          ...prev.passport,
          number: masked
        }
      }));
      showToast(
        language === 'uz'
          ? "Pasport ma'lumotlari yangilandi va xavfsiz shifrlab saqlandi."
          : "Данные загранпаспорта обновлены и сохранены.",
        'success'
      );
    }
  };

  // Header Back Button
  const handleHeaderBack = () => {
    if (currentTab !== 'search') {
      setCurrentTab('search');
    } else {
      showToast(language === 'uz' ? "Siz qidiruv sahifasidasiz" : "Вы на главной странице поиска", 'info');
    }
  };

  // Saved Tours Count
  const savedTours = tourPackages.filter(p => p.saved);

  const isDark = theme === 'dark';

  if (!isAuthenticated) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans antialiased transition-colors ${
          isDark ? 'bg-[#070c17] text-slate-100' : 'bg-slate-200 text-slate-800'
        }`}
      >
        <Toast toasts={toasts} />
        <div 
          id="tma-login-container"
          className={`relative w-full max-w-[430px] h-[100dvh] sm:h-[890px] sm:max-h-[96vh] rounded-none sm:rounded-[40px] border-0 sm:border-[8px] flex flex-col overflow-y-auto no-scrollbar shadow-2xl transition-colors ${
            isDark 
              ? 'bg-[#0f172a] border-[#22314d] text-slate-100 shadow-black/80' 
              : 'bg-[#f8fafc] border-slate-400/60 text-slate-900 shadow-slate-400/40'
          }`}
        >
          <LoginPage
            language={language}
            onSetLanguage={setLanguage}
            theme={theme}
            onSetTheme={setTheme}
            onLoginSuccess={handleLoginSuccess}
            onShowToast={showToast}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans antialiased transition-colors ${
        isDark ? 'bg-[#070c17] text-slate-100' : 'bg-slate-200 text-slate-800'
      }`}
    >
      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* Telegram App Container Frame */}
      <div 
        id="tma-app-container"
        className={`relative w-full max-w-[430px] h-[100dvh] sm:h-[890px] sm:max-h-[96vh] rounded-none sm:rounded-[40px] border-0 sm:border-[8px] flex flex-col overflow-hidden shadow-2xl transition-colors ${
          isDark 
            ? 'bg-[#0f172a] border-[#22314d] text-slate-100 shadow-black/80' 
            : 'bg-[#f8fafc] border-slate-400/60 text-slate-900 shadow-slate-400/40'
        }`}
      >
        {/* Top Header Bar */}
        <HeaderBar
          currentTab={currentTab}
          language={language}
          theme={theme}
          onBack={handleHeaderBack}
          onOpenQr={() => setIsQrModalOpen(true)}
          onToggleNotifs={() => {
            showToast(
              language === 'uz'
                ? "Sizda 1 ta yangi xabar bor: Antalya reysiga ro'yxatdan o'tish boshlandi!"
                : "Новое уведомление: Началась онлайн-регистрация на чартер в Анталью!",
              'info'
            );
            setHasUnreadNotifs(false);
          }}
          hasUnreadNotifs={hasUnreadNotifs}
          onCloseApp={() => {
            showToast(
              language === 'uz'
                ? "Telegram Mini App yopish taqlid qilindi"
                : "Симуляция закрытия Telegram Mini App",
              'info'
            );
          }}
        />

        {/* Main Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative p-3.5 space-y-3.5 pb-20">
          {/* TAB 1: Search & Kompas Tour Packages */}
          {currentTab === 'search' && (
            <SearchTab
              tourPackages={tourPackages}
              onToggleSaveTour={handleToggleSaveTour}
              onOpenTourDetails={(tour) => {
                setSelectedTour(tour);
                setIsTourModalOpen(true);
              }}
              onShowToast={showToast}
              language={language}
              theme={theme}
            />
          )}

          {/* TAB 2: Explore */}
          {currentTab === 'explore' && (
            <ExploreTab
              onSelectDestination={(destName) => {
                setCurrentTab('search');
                showToast(
                  language === 'uz' ? `${destName} bo'yicha qidiruv yuklandi` : `Загружен поиск для ${destName}`,
                  'info'
                );
              }}
              language={language}
              theme={theme}
            />
          )}

          {/* TAB 3: Hot Flash Deals */}
          {currentTab === 'hot' && (
            <HotSalesTab
              onBookHotDeal={(deal) => {
                const tourFromDeal: TourPackage = {
                  id: deal.id,
                  title: deal.title,
                  location: deal.location,
                  country: deal.location.split(',').pop()?.trim() || 'BAA',
                  tag: 'KOMPAS TOUR • FLASH SALE',
                  badgeType: 'luxury',
                  is5Star: deal.title.includes('5*'),
                  rating: 9.5,
                  nights: deal.nights || '7 kecha',
                  flight: deal.flight,
                  price: parseInt(deal.price.replace(/[^0-9]/g, ''), 10) || 450,
                  oldPrice: parseInt(deal.oldPrice.replace(/[^0-9]/g, ''), 10) || 600,
                  currencySymbol: '$',
                  img: deal.img,
                  saved: false,
                  airline: deal.flight,
                  insurance: '$30,000 sug\'urta',
                  transferIncluded: true,
                  description: `Kompas Tour (online.uz.kompastour.com) qaynoq aksiyasi: ${deal.title}. Bo'sh joylar soni cheklangan.`,
                  operator: 'Kompas Tour',
                  flightBlock: deal.flight,
                  mealPlan: 'All Inclusive',
                  roomType: 'Standard Room'
                };
                setSelectedTour(tourFromDeal);
                setIsTourModalOpen(true);
              }}
              language={language}
              theme={theme}
            />
          )}

          {/* TAB 4: Saved Tours */}
          {currentTab === 'trips' && (
            <TripsTab
              savedTours={tourPackages.filter(p => p.saved)}
              onOpenTourDetails={(tour) => {
                setSelectedTour(tour);
                setIsTourModalOpen(true);
              }}
              onToggleSaveTour={handleToggleSaveTour}
              onSelectTab={setCurrentTab}
              language={language}
              theme={theme}
            />
          )}

          {/* TAB 5: Profile & Settings */}
          {currentTab === 'profile' && (
            <ProfileTab
              user={user}
              cards={cards}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenAddCard={() => setIsAddCardOpen(true)}
              onSetPrimaryCard={handleSetPrimaryCard}
              onDeleteCard={handleDeleteCard}
              onUpdatePassport={handleUpdatePassport}
              language={language}
              onSetLanguage={setLanguage}
              theme={theme}
              onSetTheme={setTheme}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={() => {
                setNotificationsEnabled(prev => {
                  const next = !prev;
                  showToast(
                    next 
                      ? (language === 'uz' ? "Telegram bildirishnomalari yoqildi 🔔" : "Уведомления бота включены 🔔") 
                      : (language === 'uz' ? "Bildirishnomalar o'chirildi" : "Уведомления отключены"),
                    next ? 'success' : 'info'
                  );
                  return next;
                });
              }}
              onSelectTab={setCurrentTab}
              onLogout={handleLogout}
              savedToursCount={savedTours.length}
              bookingsCount={bookings.length}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={currentTab}
          onSelectTab={setCurrentTab}
          savedTripsCount={tourPackages.filter(p => p.saved).length}
          language={language}
          theme={theme}
        />

        {/* MODALS */}
        <TourDetailsModal
          tour={selectedTour}
          isOpen={isTourModalOpen}
          onClose={() => setIsTourModalOpen(false)}
          onBook={() => setIsTourModalOpen(false)}
          language={language}
          theme={theme}
        />

        <EditProfileModal
          user={user}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updated) => {
            setUser(prev => ({ ...prev, ...updated }));
            showToast(
              language === 'uz' ? "Profil ma'lumotlari yangilandi ✓" : "Профиль успешно обновлен ✓",
              'success'
            );
          }}
          language={language}
          theme={theme}
        />

        <AddCardModal
          isOpen={isAddCardOpen}
          onClose={() => setIsAddCardOpen(false)}
          onAddCard={handleAddCard}
          language={language}
          theme={theme}
        />

        <QrModal
          user={user}
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          language={language}
          theme={theme}
        />

        <TravelersModal
          isOpen={isTravelersOpen}
          onClose={() => setIsTravelersOpen(false)}
          travelers={itinerary.travelers}
          setTravelers={(val) => setItinerary(prev => ({ ...prev, travelers: val }))}
          style={itinerary.style}
          setStyle={(val) => setItinerary(prev => ({ ...prev, style: val }))}
          language={language}
          theme={theme}
        />
      </div>
    </div>
  );
}
