import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import 'widgets/header_bar.dart';
import 'widgets/bottom_nav_bar.dart';
import 'tabs/search_tab.dart';
import 'tabs/explore_tab.dart';
import 'tabs/hot_sales_tab.dart';
import 'tabs/trips_tab.dart';
import 'tabs/profile_tab.dart';
import 'auth/login_page.dart';

class MainScaffold extends StatelessWidget {
  const MainScaffold({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    if (!state.isAuthenticated) {
      return const LoginPage();
    }

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      body: SafeArea(
        top: false,
        child: Column(
          children: [
            // Telegram TMA Header Bar
            const HeaderBar(),

            // Active Tab View
            Expanded(
              child: IndexedStack(
                index: state.currentTab.index,
                children: const [
                  SearchTab(),
                  ExploreTab(),
                  HotSalesTab(),
                  TripsTab(),
                  ProfileTab(),
                ],
              ),
            ),

            // Bottom Navigation Bar
            const CustomBottomNavBar(),
          ],
        ),
      ),
    );
  }
}
