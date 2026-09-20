import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tripcraft_mobile/main.dart';
import 'package:tripcraft_mobile/models/app_enums.dart';
import 'package:tripcraft_mobile/state/app_state.dart';
import 'package:tripcraft_mobile/views/main_scaffold.dart';
import 'package:tripcraft_mobile/views/widgets/header_bar.dart';
import 'package:tripcraft_mobile/views/widgets/bottom_nav_bar.dart';
import 'package:tripcraft_mobile/views/tabs/search_tab.dart';
import 'package:tripcraft_mobile/views/tabs/explore_tab.dart';
import 'package:tripcraft_mobile/views/tabs/hot_sales_tab.dart';
import 'package:tripcraft_mobile/views/tabs/trips_tab.dart';
import 'package:tripcraft_mobile/views/tabs/profile_tab.dart';

void main() {
  testWidgets('TripCraft app smoke test - renders all main components', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);

    final appState = AppState();

    await tester.pumpWidget(
      ChangeNotifierProvider<AppState>.value(
        value: appState,
        child: const TripCraftApp(),
      ),
    );
    await tester.pumpAndSettle();

    // Verify main scaffold & bars exist
    expect(find.byType(TripCraftApp), findsOneWidget);
    expect(find.byType(MainScaffold), findsOneWidget);
    expect(find.byType(HeaderBar), findsOneWidget);
    expect(find.byType(CustomBottomNavBar), findsOneWidget);

    // Verify tabs exist in tree (IndexedStack keeps offstage tabs)
    expect(find.byType(SearchTab), findsOneWidget);
    expect(find.byType(ExploreTab, skipOffstage: false), findsOneWidget);
    expect(find.byType(HotSalesTab, skipOffstage: false), findsOneWidget);
    expect(find.byType(TripsTab, skipOffstage: false), findsOneWidget);
    expect(find.byType(ProfileTab, skipOffstage: false), findsOneWidget);
  });

  testWidgets('Switching tabs updates active tab view in widget tree', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);

    final appState = AppState();

    await tester.pumpWidget(
      ChangeNotifierProvider<AppState>.value(
        value: appState,
        child: const TripCraftApp(),
      ),
    );
    await tester.pumpAndSettle();

    // Switch to profile tab via state
    appState.setTab(TabType.profile);
    await tester.pumpAndSettle();
    expect(appState.currentTab, equals(TabType.profile));
    expect(find.byType(ProfileTab), findsOneWidget);

    // Switch to hot sales tab via state
    appState.setTab(TabType.hot);
    await tester.pumpAndSettle();
    expect(appState.currentTab, equals(TabType.hot));
    expect(find.byType(HotSalesTab), findsOneWidget);
  });
}
