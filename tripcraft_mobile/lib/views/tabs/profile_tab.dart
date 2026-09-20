import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/app_enums.dart';
import '../../models/payment_card.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../widgets/modals/edit_profile_sheet.dart';
import '../widgets/modals/add_card_sheet.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;
    final user = state.user;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        // 1. User Profile Header Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF1B2842), const Color(0xFF121C2E)]
                  : [Colors.white, const Color(0xFFF8FAFC)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 14,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                children: [
                  // Avatar with PRO Badge
                  Stack(
                    children: [
                      Container(
                        width: 58,
                        height: 58,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primaryOrange, AppColors.amberAccent],
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.all(2),
                        child: Container(
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkCard : Colors.white,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            user.initials,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: isDark ? Colors.white : AppColors.lightTextPrimary,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: -2,
                        right: -2,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.amberAccent,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isDark ? AppColors.darkBg : Colors.white,
                              width: 1.5,
                            ),
                          ),
                          child: const Text(
                            "PRO",
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 8,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 14),

                  // User Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      user.name,
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w900,
                                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Icon(Icons.verified, size: 16, color: AppColors.skyBlue),
                                ],
                              ),
                            ),
                            InkWell(
                              onTap: () => EditProfileSheet.show(context),
                              borderRadius: BorderRadius.circular(8),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryOrange.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: AppColors.primaryOrange.withOpacity(0.3),
                                  ),
                                ),
                                child: Text(
                                  state.t("update"),
                                  style: const TextStyle(
                                    color: AppColors.primaryOrange,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.skyBlue.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.send, size: 10, color: AppColors.skyBlue),
                                  const SizedBox(width: 4),
                                  Text(
                                    user.telegram,
                                    style: const TextStyle(
                                      color: AppColors.skyBlue,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text(
                              "Ulangan",
                              style: TextStyle(
                                color: AppColors.emerald,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              user.phone,
                              style: TextStyle(
                                fontSize: 10,
                                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                              ),
                            ),
                            Text(
                              "ID: ${user.id}",
                              style: const TextStyle(
                                fontSize: 10,
                                fontFamily: 'monospace',
                                color: Colors.grey,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // 3 Metric Boxes (Orders, Saved, Cashback)
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => state.setTab(TabType.trips),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              state.t("orders"),
                              style: const TextStyle(fontSize: 10, color: Colors.grey),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "${state.bookings.length}",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  Expanded(
                    child: InkWell(
                      onTap: () => state.setTab(TabType.trips),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              state.t("saved"),
                              style: const TextStyle(fontSize: 10, color: Colors.grey),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "${state.savedTours.length}",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            state.t("cashback"),
                            style: const TextStyle(fontSize: 10, color: Colors.grey),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "\$${user.cashback}",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: AppColors.emerald,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 2. Traveler Documents (Passport Zagran)
        _buildSectionCard(
          title: state.t("travelDocs"),
          icon: Icons.description_outlined,
          isDark: isDark,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.passport.type,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        user.passport.number,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primaryOrange,
                          fontFamily: 'monospace',
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "${state.t("validUntil")} ${user.passport.expiry}",
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Pasport ma'lumotlari tasdiqlangan va amalda"),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    visualDensity: VisualDensity.compact,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: Text(state.t("update"), style: const TextStyle(fontSize: 10)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),

        // 3. Payment Cards
        _buildSectionCard(
          title: state.t("myCards"),
          icon: Icons.credit_card,
          isDark: isDark,
          child: Column(
            children: [
              ...state.cards.map((card) => _buildCardItem(card, state, isDark)),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => AddCardSheet.show(context),
                  icon: const Icon(Icons.add, size: 16),
                  label: Text(
                    state.t("addCard"),
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primaryOrange,
                    side: const BorderSide(color: AppColors.primaryOrange),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 4. Language Selector
        _buildSectionCard(
          title: state.t("appLanguage"),
          icon: Icons.language,
          isDark: isDark,
          child: Row(
            children: [
              _buildLangChip(state, Language.uz, "O'zbekcha 🇺🇿", isDark),
              const SizedBox(width: 8),
              _buildLangChip(state, Language.ru, "Русский 🇷🇺", isDark),
              const SizedBox(width: 8),
              _buildLangChip(state, Language.en, "English 🇬🇧", isDark),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 5. Theme Mode
        _buildSectionCard(
          title: state.t("themeMode"),
          icon: Icons.brightness_4_outlined,
          isDark: isDark,
          child: Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () => state.setThemeMode(AppThemeMode.dark),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: isDark
                          ? AppColors.primaryOrange
                          : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.dark_mode, size: 16, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(
                          state.t("themeDark"),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              Expanded(
                child: InkWell(
                  onTap: () => state.setThemeMode(AppThemeMode.light),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: !isDark
                          ? AppColors.primaryOrange
                          : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.light_mode,
                          size: 16,
                          color: !isDark ? Colors.white : Colors.grey,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          state.t("themeLight"),
                          style: TextStyle(
                            color: !isDark ? Colors.white : Colors.grey,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 6. Security & Support
        _buildSectionCard(
          title: state.t("securitySupport"),
          icon: Icons.security,
          isDark: isDark,
          child: Column(
            children: [
              // Bot notifications toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        state.t("botNotifs"),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                        ),
                      ),
                      Text(
                        state.t("botNotifsSub"),
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                  Switch(
                    value: state.notificationsEnabled,
                    activeColor: AppColors.primaryOrange,
                    onChanged: (v) => state.toggleNotifications(),
                  ),
                ],
              ),
              Divider(height: 16, color: isDark ? AppColors.darkBorder : AppColors.lightBorder),

              // Support 24/7
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Telegram orqali @TripCraftSupport operatoriga ulanish..."),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(
                      children: [
                        const Icon(Icons.headset_mic_outlined, color: AppColors.primaryOrange, size: 22),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                state.t("support247"),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                state.t("supportSub"),
                                style: const TextStyle(fontSize: 10, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right, size: 16, color: Colors.grey),
                      ],
                    ),
                  ),
                ),
              ),
              Divider(height: 16, color: isDark ? AppColors.darkBorder : AppColors.lightBorder),

              // Version & Logout
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      state.t("appVersion"),
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: TextButton(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              backgroundColor: state.isDark ? AppColors.darkCard : AppColors.lightCard,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              title: Text(
                                state.language == Language.uz
                                    ? "Akkauntdan chiqish"
                                    : (state.language == Language.ru ? "Выход из аккаунта" : "Log out"),
                                style: TextStyle(
                                  color: state.isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              content: Text(
                                state.language == Language.uz
                                    ? "Rostdan ham akkauntdan chiqmoqchimisiz?"
                                    : (state.language == Language.ru ? "Вы уверены, что хотите выйти?" : "Are you sure you want to log out?"),
                                style: TextStyle(
                                  color: state.isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                                  fontSize: 13,
                                ),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx),
                                  child: Text(
                                    state.language == Language.uz ? "Bekor qilish" : (state.language == Language.ru ? "Отмена" : "Cancel"),
                                    style: TextStyle(color: state.isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    Navigator.pop(ctx);
                                    state.logout();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          state.language == Language.uz
                                              ? "Akkauntdan chiqildi"
                                              : (state.language == Language.ru ? "Вы вышли из аккаунта" : "Logged out"),
                                        ),
                                        behavior: SnackBarBehavior.floating,
                                        backgroundColor: AppColors.darkCard,
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.flashRed,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: Text(
                                    state.language == Language.uz ? "Chiqish" : (state.language == Language.ru ? "Выйти" : "Log out"),
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.flashRed,
                          visualDensity: VisualDensity.compact,
                        ),
                        child: Text(
                          state.t("logout"),
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required bool isDark,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: AppColors.primaryOrange),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildCardItem(PaymentCard card, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: card.isPrimary ? AppColors.primaryOrange : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: card.type == CardType.humo
                        ? const Color(0xFFEAB308)
                        : (card.type == CardType.visa ? const Color(0xFF2563EB) : const Color(0xFF059669)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    card.typeName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "•••• ${card.last4}",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                          fontFamily: 'monospace',
                        ),
                      ),
                      Text(
                        "${card.bank} • ${card.expiry}",
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (card.isPrimary)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primaryOrange.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    state.t("primary"),
                    style: const TextStyle(
                      color: AppColors.primaryOrange,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              else
                TextButton(
                  onPressed: () => state.setPrimaryCard(card.id),
                  style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
                  child: Text(
                    state.t("primary"),
                    style: const TextStyle(fontSize: 10, color: Colors.grey),
                  ),
                ),
              IconButton(
                onPressed: () => state.deleteCard(card.id),
                icon: const Icon(Icons.delete_outline, size: 16, color: Colors.grey),
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLangChip(AppState state, Language lang, String label, bool isDark) {
    final isSelected = state.language == lang;
    return Expanded(
      child: InkWell(
        onTap: () => state.setLanguage(lang),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primaryOrange
                : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.primaryOrange : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: isSelected
                  ? Colors.white
                  : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
            ),
          ),
        ),
      ),
    );
  }
}
