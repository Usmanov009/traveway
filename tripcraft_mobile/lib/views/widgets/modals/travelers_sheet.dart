import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../state/app_state.dart';
import '../../../models/app_enums.dart';
import '../../../theme/app_colors.dart';

class TravelersSheet extends StatefulWidget {
  const TravelersSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const TravelersSheet(),
    );
  }

  @override
  State<TravelersSheet> createState() => _TravelersSheetState();
}

class _TravelersSheetState extends State<TravelersSheet> {
  late int count;
  late String style;

  @override
  void initState() {
    super.initState();
    final state = context.read<AppState>();
    count = state.travelersCount;
    style = state.travelStyle;
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    final vibes = [
      {'key': 'Culture', 'uz': 'Madaniyat & Tarix', 'ru': 'Культура и Музеи', 'en': 'Culture & Heritage'},
      {'key': 'Relaxing', 'uz': 'Hordiq & Plyaj', 'ru': 'Релакс и Пляж', 'en': 'Relaxing & Beach'},
      {'key': 'Adventure', 'uz': 'Sarguzasht', 'ru': 'Приключения', 'en': 'Adventure'},
      {'key': 'Party', 'uz': 'Tungi hayot', 'ru': 'Ночная жизнь', 'en': 'Nightlife & Party'},
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  state.t("travelersAndStyle"),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                  visualDensity: VisualDensity.compact,
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Stepper card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        state.t("guestCount"),
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        state.t("guestsDesc"),
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      _buildStepperButton(
                        icon: Icons.remove,
                        onTap: () {
                          if (count > 1) setState(() => count--);
                        },
                        isDark: isDark,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Text(
                          "$count",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryOrange,
                          ),
                        ),
                      ),
                      _buildStepperButton(
                        icon: Icons.add,
                        onTap: () {
                          if (count < 8) setState(() => count++);
                        },
                        isDark: isDark,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Vibe selection
            Text(
              state.t("tripVibe"),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
              ),
            ),
            const SizedBox(height: 10),

            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 2.8,
              ),
              itemCount: vibes.length,
              itemBuilder: (context, index) {
                final v = vibes[index];
                final isSelected = style == v['key'];
                final label = state.language == Language.uz
                    ? v['uz']!
                    : (state.language == Language.ru ? v['ru']! : v['en']!);

                return InkWell(
                  onTap: () => setState(() => style = v['key']!),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryOrange.withOpacity(0.15)
                          : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? AppColors.primaryOrange : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            label,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              color: isSelected
                                  ? AppColors.primaryOrange
                                  : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (isSelected)
                          const Icon(Icons.check, size: 16, color: AppColors.primaryOrange),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  state.setTravelers(count, style);
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryOrange,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: Text(
                  state.t("done"),
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepperButton({
    required IconData icon,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCard : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          ),
        ),
        child: Icon(
          icon,
          size: 16,
          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
        ),
      ),
    );
  }
}
