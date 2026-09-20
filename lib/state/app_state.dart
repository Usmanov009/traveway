import 'dart:math';
import 'package:flutter/material.dart';
import '../models/app_enums.dart';
import '../models/tour_package.dart';
import '../models/trip_itinerary.dart';
import '../models/user_profile.dart';
import '../models/payment_card.dart';
import '../models/booking.dart';
import '../models/hot_deal.dart';
import '../data/mock_data.dart';
import '../data/translations.dart';

class AppState extends ChangeNotifier {
  // Navigation & Preferences
  TabType _currentTab = TabType.search;
  SearchMode _searchMode = SearchMode.packages;
  Language _language = Language.uz;
  AppThemeMode _themeMode = AppThemeMode.dark;
  bool _hasUnreadNotifs = true;
  bool _notificationsEnabled = true;
  bool _isAuthenticated = false;
  bool _isGuest = false;

  // Search parameters
  String _origin = "Toshkent (TAS)";
  String _destination = "Antalya, Turkiya";
  DateTime _flyDate = DateTime.now().add(const Duration(days: 7));
  int _travelersCount = 2;
  String _travelStyle = "Culture";
  String _filterType = "all"; // 'all', '5star', 'ultra', 'cheap'

  // Core Data
  List<TourPackage> _tourPackages = MockData.initialTourPackages;
  TripItinerary _itinerary = MockData.initialParisItinerary;
  int _activeDay = 1;
  UserProfile _user = MockData.initialUser;
  List<PaymentCard> _cards = MockData.initialCards;
  List<Booking> _bookings = MockData.initialBookings;

  // Getters
  TabType get currentTab => _currentTab;
  SearchMode get searchMode => _searchMode;
  Language get language => _language;
  AppThemeMode get themeMode => _themeMode;
  bool get isDark => _themeMode == AppThemeMode.dark;
  bool get hasUnreadNotifs => _hasUnreadNotifs;
  bool get notificationsEnabled => _notificationsEnabled;
  bool get isAuthenticated => _isAuthenticated;
  bool get isGuest => _isGuest;

  String get origin => _origin;
  String get destination => _destination;
  DateTime get flyDate => _flyDate;
  int get travelersCount => _travelersCount;
  String get travelStyle => _travelStyle;
  String get filterType => _filterType;

  List<TourPackage> get tourPackages => _tourPackages;
  List<TourPackage> get savedTours => _tourPackages.where((p) => p.saved).toList();
  TripItinerary get itinerary => _itinerary;
  int get activeDay => _activeDay;
  UserProfile get user => _user;
  List<PaymentCard> get cards => _cards;
  List<Booking> get bookings => _bookings;

  String t(String key) => AppTranslations.get(_language, key);

  List<TourPackage> get filteredPackages {
    return _tourPackages.where((pkg) {
      if (_destination.trim().isNotEmpty) {
        final q = _destination.trim().toLowerCase();
        final tokens = q.split(RegExp(r'[\s,]+')).where((t) => t.length >= 2).toList();
        if (tokens.isNotEmpty) {
          final matches = tokens.any((token) =>
              pkg.location.toLowerCase().contains(token) ||
              pkg.country.toLowerCase().contains(token) ||
              pkg.title.toLowerCase().contains(token));
          if (!matches) return false;
        }
      }
      if (_filterType == '5star') return pkg.is5Star;
      if (_filterType == 'ultra') {
        return pkg.badgeType == BadgeType.ultra ||
            pkg.tag.toLowerCase().contains('ultra') ||
            pkg.tag.toLowerCase().contains('all inclusive');
      }
      if (_filterType == 'cheap') return pkg.price <= 680;
      return true;
    }).toList();
  }

  // Navigation
  void setTab(TabType tab) {
    _currentTab = tab;
    notifyListeners();
  }

  void setSearchMode(SearchMode mode) {
    _searchMode = mode;
    notifyListeners();
  }

  void setLanguage(Language lang) {
    _language = lang;
    notifyListeners();
  }

  void setThemeMode(AppThemeMode mode) {
    _themeMode = mode;
    notifyListeners();
  }

  void toggleTheme() {
    _themeMode = _themeMode == AppThemeMode.dark ? AppThemeMode.light : AppThemeMode.dark;
    notifyListeners();
  }

  void toggleNotifications() {
    _notificationsEnabled = !_notificationsEnabled;
    notifyListeners();
  }

  void clearUnreadNotifs() {
    _hasUnreadNotifs = false;
    notifyListeners();
  }

  // Search parameters
  void setOrigin(String orig) {
    _origin = orig;
    notifyListeners();
  }

  void setDestination(String dest) {
    _destination = dest;
    notifyListeners();
  }

  void swapLocations() {
    final temp = _origin;
    _origin = _destination;
    _destination = temp;
    notifyListeners();
  }

  void setFlyDate(DateTime date) {
    _flyDate = date;
    notifyListeners();
  }

  void setTravelers(int count, String style) {
    _travelersCount = count;
    _travelStyle = style;
    _itinerary = _itinerary.copyWith(travelers: count, style: style);
    notifyListeners();
  }

  void setFilterType(String type) {
    _filterType = type;
    notifyListeners();
  }

  void setActiveDay(int day) {
    _activeDay = day;
    notifyListeners();
  }

  // Tour Package Actions
  void toggleSaveTour(String id) {
    _tourPackages = _tourPackages.map((pkg) {
      if (pkg.id == id) {
        return pkg.copyWith(saved: !pkg.saved);
      }
      return pkg;
    }).toList();
    notifyListeners();
  }

  void bookTour(TourPackage tour) {
    final newBooking = Booking(
      id: 'b-${DateTime.now().millisecondsSinceEpoch}',
      tourTitle: tour.title,
      dest: tour.location,
      dates: '10 May — 17 May, 2025',
      status: _language == Language.uz
          ? 'Tasdiqlangan'
          : (_language == Language.ru ? 'Подтверждено' : 'Confirmed'),
      voucherId: 'VOUCHER-TC${10000 + Random().nextInt(90000)}',
      price: '\$${tour.price * 2} (2 kishi)',
      travelers: '2 kishi, 1 xona',
      type: BookingType.active,
      createdAt: DateTime.now().toIso8601String(),
    );
    _bookings = [newBooking, ..._bookings];
    notifyListeners();
  }

  void bookHotDeal(HotDeal deal) {
    final newBooking = Booking(
      id: 'b-${DateTime.now().millisecondsSinceEpoch}',
      tourTitle: deal.title,
      dest: deal.location,
      dates: 'Ertaga — 7 kecha',
      status: _language == Language.uz
          ? 'Tasdiqlangan'
          : (_language == Language.ru ? 'Подтверждено' : 'Confirmed'),
      voucherId: 'VOUCHER-FLASH${1000 + Random().nextInt(9000)}',
      price: '${deal.price} (Flash Narx)',
      travelers: '1 kishi',
      type: BookingType.active,
      createdAt: DateTime.now().toIso8601String(),
    );
    _bookings = [newBooking, ..._bookings];
    notifyListeners();
  }

  void cancelBooking(String id) {
    _bookings = _bookings.where((b) => b.id != id).toList();
    notifyListeners();
  }

  // Card Actions
  void addCard(PaymentCard card) {
    _cards = [..._cards, card];
    notifyListeners();
  }

  void setPrimaryCard(String id) {
    _cards = _cards.map((c) => c.copyWith(isPrimary: c.id == id)).toList();
    notifyListeners();
  }

  void deleteCard(String id) {
    _cards = _cards.where((c) => c.id != id).toList();
    notifyListeners();
  }

  // Profile Actions
  void updateProfile({String? name, String? phone, String? telegram}) {
    _user = _user.copyWith(
      name: name ?? _user.name,
      phone: phone ?? _user.phone,
      telegram: telegram ?? _user.telegram,
    );
    notifyListeners();
  }

  void updatePassport({String? number, String? expiry}) {
    _user = _user.copyWith(
      passport: _user.passport.copyWith(
        number: number ?? _user.passport.number,
        expiry: expiry ?? _user.passport.expiry,
      ),
    );
    notifyListeners();
  }

  // AI Itinerary Actions
  void swapActivity(String actId) {
    final altList = MockData.alternativeActivities;
    final randomAlt = altList[Random().nextInt(altList.length)];

    final currentDayPlan = _itinerary.days[_activeDay];
    if (currentDayPlan == null) return;

    final updatedActivities = currentDayPlan.activities.map((act) {
      if (act.id == actId) {
        return act.copyWith(
          title: randomAlt['title']!,
          desc: randomAlt['desc']!,
          transit: randomAlt['transit']!,
          price: randomAlt['price']!,
          location: randomAlt['location']!,
          type: randomAlt['type']!,
          rating: "4.8",
        );
      }
      return act;
    }).toList();

    final updatedDays = Map<int, DayPlan>.from(_itinerary.days);
    updatedDays[_activeDay] = currentDayPlan.copyWith(activities: updatedActivities);

    _itinerary = _itinerary.copyWith(days: updatedDays);
    notifyListeners();
  }

  void deleteActivity(String actId) {
    final currentDayPlan = _itinerary.days[_activeDay];
    if (currentDayPlan == null) return;

    final updatedActivities = currentDayPlan.activities.where((a) => a.id != actId).toList();
    final updatedDays = Map<int, DayPlan>.from(_itinerary.days);
    updatedDays[_activeDay] = currentDayPlan.copyWith(activities: updatedActivities);

    _itinerary = _itinerary.copyWith(days: updatedDays);
    notifyListeners();
  }

  void login({String? phone, String? name, String? telegram}) {
    _isAuthenticated = true;
    _isGuest = false;
    _user = _user.copyWith(
      phone: phone ?? _user.phone,
      name: name ?? _user.name,
      telegram: telegram ?? _user.telegram,
    );
    notifyListeners();
  }

  void continueAsGuest() {
    _isAuthenticated = true;
    _isGuest = true;
    _user = _user.copyWith(
      name: _language == Language.uz ? "Mehmon" : (_language == Language.ru ? "Гость" : "Guest"),
      phone: "",
      telegram: "",
    );
    notifyListeners();
  }

  void logout() {
    _isAuthenticated = false;
    _isGuest = false;
    _user = MockData.initialUser;
    _currentTab = TabType.search;
    notifyListeners();
  }
}
