import 'package:flutter_test/flutter_test.dart';
import 'package:tripcraft_mobile/models/app_enums.dart';
import 'package:tripcraft_mobile/models/payment_card.dart';
import 'package:tripcraft_mobile/state/app_state.dart';

void main() {
  group('AppState Unit Tests', () {
    late AppState appState;

    setUp(() {
      appState = AppState();
    });

    test('Initial state values are correct', () {
      expect(appState.currentTab, equals(TabType.search));
      expect(appState.searchMode, equals(SearchMode.packages));
      expect(appState.language, equals(Language.uz));
      expect(appState.themeMode, equals(AppThemeMode.dark));
      expect(appState.isDark, isTrue);
      expect(appState.hasUnreadNotifs, isTrue);
      expect(appState.notificationsEnabled, isTrue);
      expect(appState.tourPackages.isNotEmpty, isTrue);
      expect(appState.cards.isNotEmpty, isTrue);
      expect(appState.bookings.isNotEmpty, isTrue);
    });

    test('Tab switching updates currentTab', () {
      appState.setTab(TabType.explore);
      expect(appState.currentTab, equals(TabType.explore));

      appState.setTab(TabType.hot);
      expect(appState.currentTab, equals(TabType.hot));

      appState.setTab(TabType.trips);
      expect(appState.currentTab, equals(TabType.trips));

      appState.setTab(TabType.profile);
      expect(appState.currentTab, equals(TabType.profile));
    });

    test('Language toggle updates localization', () {
      appState.setLanguage(Language.ru);
      expect(appState.language, equals(Language.ru));
      expect(appState.t('searchTitle'), equals('Поиск турпакетов'));

      appState.setLanguage(Language.en);
      expect(appState.language, equals(Language.en));
      expect(appState.t('searchTitle'), equals('Tour Package Search'));

      appState.setLanguage(Language.uz);
      expect(appState.language, equals(Language.uz));
      expect(appState.t('searchTitle'), equals('Turpaketlar qidiruvi'));
    });

    test('Theme mode toggles correctly', () {
      expect(appState.isDark, isTrue);
      appState.toggleTheme();
      expect(appState.isDark, isFalse);
      expect(appState.themeMode, equals(AppThemeMode.light));

      appState.toggleTheme();
      expect(appState.isDark, isTrue);
      expect(appState.themeMode, equals(AppThemeMode.dark));
    });

    test('Filter packages by 5star, ultra, cheap, all', () {
      appState.setFilterType('5star');
      for (final pkg in appState.filteredPackages) {
        expect(pkg.is5Star, isTrue);
      }

      appState.setFilterType('cheap');
      for (final pkg in appState.filteredPackages) {
        expect(pkg.price <= 680, isTrue);
      }

      appState.setFilterType('all');
      expect(appState.filteredPackages.length, equals(appState.tourPackages.length));
    });

    test('Toggle save / bookmark tour package', () {
      final firstTour = appState.tourPackages.first;
      final initialSaved = firstTour.saved;

      appState.toggleSaveTour(firstTour.id);
      final updated = appState.tourPackages.firstWhere((p) => p.id == firstTour.id);
      expect(updated.saved, equals(!initialSaved));

      appState.toggleSaveTour(firstTour.id);
      final restored = appState.tourPackages.firstWhere((p) => p.id == firstTour.id);
      expect(restored.saved, equals(initialSaved));
    });

    test('Booking a tour increases bookings count and allows cancellation', () {
      final initialCount = appState.bookings.length;
      final tour = appState.tourPackages.first;

      appState.bookTour(tour);
      expect(appState.bookings.length, equals(initialCount + 1));
      final newBooking = appState.bookings.first;
      expect(newBooking.tourTitle, equals(tour.title));

      appState.cancelBooking(newBooking.id);
      expect(appState.bookings.length, equals(initialCount));
    });

    test('Adding and setting primary payment card', () {
      final initialCardCount = appState.cards.length;
      final newCard = PaymentCard(
        id: 'c-test-999',
        type: CardType.visa,
        last4: '9999',
        bank: 'Anorbank',
        isPrimary: false,
        expiry: '12/28',
      );

      appState.addCard(newCard);
      expect(appState.cards.length, equals(initialCardCount + 1));

      appState.setPrimaryCard(newCard.id);
      final primary = appState.cards.firstWhere((c) => c.id == newCard.id);
      expect(primary.isPrimary, isTrue);

      final otherCards = appState.cards.where((c) => c.id != newCard.id);
      for (final c in otherCards) {
        expect(c.isPrimary, isFalse);
      }

      appState.deleteCard(newCard.id);
      expect(appState.cards.length, equals(initialCardCount));
    });

    test('Updating user profile and passport', () {
      appState.updateProfile(name: 'Ali Valiyev', phone: '+998901234567');
      expect(appState.user.name, equals('Ali Valiyev'));
      expect(appState.user.phone, equals('+998901234567'));

      appState.updatePassport(number: 'FA1234567', expiry: '05/2032');
      expect(appState.user.passport.number, equals('FA1234567'));
      expect(appState.user.passport.expiry, equals('05/2032'));
    });
  });
}
