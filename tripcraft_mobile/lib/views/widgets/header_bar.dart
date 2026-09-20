import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../state/app_state.dart';
import '../../models/app_enums.dart';
import '../../theme/app_colors.dart';
import 'modals/qr_code_dialog.dart';

class HeaderBar extends StatelessWidget {
  const HeaderBar({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    String title;
    String subtitle;
    bool canBack = state.currentTab != TabType.search;

    switch (state.currentTab) {
      case TabType.search:
        title = state.t("searchTitle");
        subtitle = state.t("searchSub");
        break;
      case TabType.explore:
        title = state.language == Language.uz
            ? "Kashf etish & Vibes"
            : (state.language == Language.ru ? "Исследовать & Тренды" : "Explore & Vibes");
        subtitle = state.language == Language.uz
            ? "Sayohat g'oyalari va arzon yo'nalishlar"
            : (state.language == Language.ru ? "Идеи для поездок и курорты" : "Travel ideas and top resorts");
        break;
      case TabType.hot:
        title = state.language == Language.uz
            ? "Qaynoq Takliflar 🔥"
            : (state.language == Language.ru ? "Горящие туры 🔥" : "Hot Tour Deals 🔥");
        subtitle = state.language == Language.uz
            ? "Katta chegirmali flash turpaketlar"
            : (state.language == Language.ru ? "Flash-скидки до 50%" : "Flash discounts up to 50%");
        break;
      case TabType.trips:
        title = state.language == Language.uz
            ? "Mening Turlarim"
            : (state.language == Language.ru ? "Мои Туры" : "My Trips");
        subtitle = state.language == Language.uz
            ? "Buyurtmalar, vaucherlar va saqlanganlar"
            : (state.language == Language.ru ? "Заказы, ваучеры и билеты" : "Bookings, vouchers and passes");
        break;
      case TabType.profile:
        title = state.t("myProfile");
        subtitle = state.t("settingsAndCabinet");
        break;
    }

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkBg : AppColors.lightSurface,
        border: Border(
          bottom: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // TMA Status Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.emerald,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            state.t("appTitle"),
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: isDark
                              ? AppColors.primaryOrange.withOpacity(0.15)
                              : AppColors.primaryOrange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: AppColors.primaryOrange.withOpacity(0.3),
                          ),
                        ),
                        child: Text(
                          state.t("vipUser"),
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryOrange,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      InkWell(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                state.language == Language.uz
                                    ? "Telegram Mini App rejimi faol"
                                    : "Telegram Mini App активен",
                              ),
                              duration: const Duration(seconds: 1),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          width: 26,
                          height: 26,
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurface : AppColors.lightBorder,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.close,
                            size: 14,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Divider(
              height: 1,
              color: isDark ? AppColors.darkBorder.withOpacity(0.5) : AppColors.lightBorder,
            ),

            // Page Navigation Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  InkWell(
                    onTap: canBack ? () => state.setTab(TabType.search) : null,
                    borderRadius: BorderRadius.circular(20),
                    child: Opacity(
                      opacity: canBack ? 1.0 : 0.35,
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkSurface : AppColors.lightCardSecondary,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                          ),
                        ),
                        child: Icon(
                          Icons.arrow_back,
                          size: 18,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                            height: 1.1,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          subtitle,
                          style: TextStyle(
                            fontSize: 11,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      // QR Code Pass Button
                      InkWell(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (context) => const QrCodeDialog(),
                          );
                        },
                        borderRadius: BorderRadius.circular(18),
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurface : AppColors.lightCardSecondary,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                            ),
                          ),
                          child: Icon(
                            Icons.qr_code_2,
                            size: 20,
                            color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Notifications Button with badge
                      InkWell(
                        onTap: () {
                          state.clearUnreadNotifs();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                state.language == Language.uz
                                    ? "Bildirishnomalar: Hozircha yangi xabarlar yo'q"
                                    : "Уведомления: Нет новых сообщений",
                              ),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(18),
                        child: Stack(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.darkSurface : AppColors.lightCardSecondary,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                                ),
                              ),
                              child: Icon(
                                Icons.notifications_none_rounded,
                                size: 20,
                                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                              ),
                            ),
                            if (state.hasUnreadNotifs)
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryOrange,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isDark ? AppColors.darkBg : Colors.white,
                                      width: 1.5,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
