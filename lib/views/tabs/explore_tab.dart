import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../data/mock_data.dart';
import '../../models/app_enums.dart';
import '../../models/explore_vibe.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';

class ExploreTab extends StatefulWidget {
  const ExploreTab({super.key});

  @override
  State<ExploreTab> createState() => _ExploreTabState();
}

class _ExploreTabState extends State<ExploreTab> {
  String selectedVibe = 'all';

  final List<Map<String, String>> vibesFilter = [
    {'key': 'all', 'uz': '✨ Hammasi', 'ru': '✨ Все', 'en': '✨ All'},
    {'key': 'beach', 'uz': '🏖 Plyaj & Dengiz', 'ru': '🏖 Пляж и Море', 'en': '🏖 Beach & Sea'},
    {'key': 'culture', 'uz': '🏛 Madaniyat & Tarix', 'ru': '🏛 Культура', 'en': '🏛 Culture & History'},
    {'key': 'mountain', 'uz': "⛰ Tog' & Tabiat", 'ru': '⛰ Горы', 'en': '⛰ Mountains & Nature'},
    {'key': 'luxury', 'uz': '💎 Hashamat & Relaks', 'ru': '💎 Люкс', 'en': '💎 Luxury & Spa'},
  ];

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    final filteredList = selectedVibe == 'all'
        ? MockData.initialExploreVibes
        : MockData.initialExploreVibes.where((v) => v.vibe == selectedVibe).toList();

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        // Hero Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF172554), const Color(0xFF1E1B4B)]
                  : [const Color(0xFFDBEAFE), const Color(0xFFE0E7FF)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isDark ? const Color(0xFF3B82F6).withOpacity(0.3) : const Color(0xFFBFDBFE),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      "TRIPCRAFT VIBES",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    state.t("vibeCurated"),
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? const Color(0xFFBFDBFE) : const Color(0xFF1E40AF),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                state.t("exploreTitle"),
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                state.t("exploreSub"),
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Vibe Filter Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: vibesFilter.map((v) {
              final isSelected = selectedVibe == v['key'];
              final label = state.language == Language.uz
                  ? v['uz']!
                  : (state.language == Language.ru ? v['ru']! : v['en']!);

              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: InkWell(
                  onTap: () => setState(() => selectedVibe = v['key']!),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryOrange
                          : (isDark ? AppColors.darkCard : AppColors.lightCard),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primaryOrange
                            : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: AppColors.primaryOrange.withOpacity(0.3),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : null,
                    ),
                    child: Text(
                      label,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected
                            ? Colors.white
                            : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 14),

        // Destination Cards List
        ...filteredList.map((item) => _buildVibeCard(item, state, isDark)),

        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildVibeCard(ExploreVibe item, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () {
          state.setDestination(item.destKey);
          state.setTab(TabType.search);
        },
        borderRadius: BorderRadius.circular(22),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(22),
          child: Stack(
            children: [
              Image.network(
                item.img,
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 160,
                  color: isDark ? AppColors.darkCardSecondary : Colors.grey[300],
                  child: const Center(child: Icon(Icons.image, size: 40, color: Colors.grey)),
                ),
              ),
              Container(
                height: 160,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.transparent, Colors.black87],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
              Positioned(
                top: 10,
                left: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF2563EB).withOpacity(0.9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    item.badge,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 12,
                left: 14,
                right: 14,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            item.count,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.65),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            state.t("startingFrom"),
                            style: const TextStyle(color: Colors.white70, fontSize: 9),
                          ),
                          Text(
                            item.priceFrom,
                            style: const TextStyle(
                              color: AppColors.primaryOrange,
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
