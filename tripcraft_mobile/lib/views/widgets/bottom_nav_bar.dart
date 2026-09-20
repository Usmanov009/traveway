import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../state/app_state.dart';
import '../../models/app_enums.dart';
import '../../theme/app_colors.dart';

class CustomBottomNavBar extends StatelessWidget {
  const CustomBottomNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkNavBg : AppColors.lightNavBg,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                context,
                tab: TabType.search,
                icon: Icons.search_rounded,
                label: state.t("tabSearch"),
                isActive: state.currentTab == TabType.search,
              ),
              _buildNavItem(
                context,
                tab: TabType.explore,
                icon: Icons.explore_outlined,
                activeIcon: Icons.explore,
                label: state.t("tabExplore"),
                isActive: state.currentTab == TabType.explore,
              ),
              _buildNavItem(
                context,
                tab: TabType.hot,
                icon: Icons.local_fire_department_outlined,
                activeIcon: Icons.local_fire_department,
                label: state.t("tabHot"),
                isActive: state.currentTab == TabType.hot,
                isHot: true,
              ),
              _buildNavItem(
                context,
                tab: TabType.trips,
                icon: Icons.receipt_long_outlined,
                activeIcon: Icons.receipt_long,
                label: state.t("tabTrips"),
                isActive: state.currentTab == TabType.trips,
                badgeCount: state.savedTours.length,
              ),
              _buildNavItem(
                context,
                tab: TabType.profile,
                icon: Icons.person_outline,
                activeIcon: Icons.person,
                label: state.t("tabProfile"),
                isActive: state.currentTab == TabType.profile,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required TabType tab,
    required IconData icon,
    IconData? activeIcon,
    required String label,
    required bool isActive,
    bool isHot = false,
    int? badgeCount,
  }) {
    final state = context.read<AppState>();
    final isDark = state.isDark;

    final selectedColor = AppColors.primaryOrange;
    final unselectedColor = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    return InkWell(
      onTap: () => state.setTab(tab),
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isActive ? (activeIcon ?? icon) : icon,
                  size: 22,
                  color: isActive ? selectedColor : unselectedColor,
                ),
                if (isHot)
                  Positioned(
                    top: -6,
                    right: -10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                      decoration: BoxDecoration(
                        color: AppColors.flashRed,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        "HOT",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 7,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                if (badgeCount != null && badgeCount > 0)
                  Positioned(
                    top: -5,
                    right: -10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: AppColors.primaryOrange,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isDark ? AppColors.darkBg : Colors.white,
                          width: 1,
                        ),
                      ),
                      child: Text(
                        "$badgeCount",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w800 : FontWeight.w500,
                color: isActive ? selectedColor : unselectedColor,
              ),
            ),
            const SizedBox(height: 2),
            Container(
              width: 4,
              height: 4,
              decoration: BoxDecoration(
                color: isActive ? AppColors.primaryOrange : Colors.transparent,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
