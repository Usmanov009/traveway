import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/app_enums.dart';
import '../../models/tour_package.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../widgets/modals/tour_details_sheet.dart';
import '../widgets/modals/travelers_sheet.dart';

class SearchTab extends StatefulWidget {
  const SearchTab({super.key});

  @override
  State<SearchTab> createState() => _SearchTabState();
}

class _SearchTabState extends State<SearchTab> {
  bool isSearching = false;
  late TextEditingController _originController;
  late TextEditingController _destinationController;

  @override
  void initState() {
    super.initState();
    final state = context.read<AppState>();
    _originController = TextEditingController(text: state.origin);
    _destinationController = TextEditingController(text: state.destination);
  }

  @override
  void dispose() {
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  void _handleSwap() {
    final state = context.read<AppState>();
    state.swapLocations();
    _originController.text = state.origin;
    _destinationController.text = state.destination;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          state.language == Language.uz
              ? "Yo'nalish almashtirildi ⇅"
              : (state.language == Language.ru ? "Направление изменено ⇅" : "Locations swapped ⇅"),
        ),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  final destinationsList = const [
    'Antalya, Turkiya',
    'Dubay, BAA',
    'Sharm ash-Shayx, Misr',
    'Istanbul, Turkiya',
    'Phuket, Tailand',
    'Male, Maldiv orollari',
  ];

  void _triggerSearch() {
    setState(() => isSearching = true);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() => isSearching = false);
      final state = context.read<AppState>();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            state.language == Language.uz
                ? "${state.destination} bo'yicha eng arzon turpaketlar yangilandi!"
                : "${state.destination}: актуальные туры обновлены!",
          ),
          backgroundColor: AppColors.emerald,
          behavior: SnackBarBehavior.floating,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        // Mode Switcher Toggle
        _buildModeSwitcher(state, isDark),
        const SizedBox(height: 14),

        if (state.searchMode == SearchMode.packages) ...[
          // MODE 1: TOUR PACKAGES
          _buildPackageSearchCard(state, isDark),
          const SizedBox(height: 14),

          if (isSearching) _buildSearchLoader(state, isDark),

          // Filters row
          _buildFilterChips(state, isDark),
          const SizedBox(height: 14),

          // Package Cards List
          ...state.filteredPackages.map((pkg) => _buildPackageCard(pkg, state, isDark)),
        ] else ...[
          // MODE 2: AI ITINERARY (SMART ROUTE)
          _buildItineraryView(state, isDark),
        ],

        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildModeSwitcher(AppState state, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardSecondary : AppColors.lightBorder,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorderLight,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () => state.setSearchMode(SearchMode.packages),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: state.searchMode == SearchMode.packages
                      ? AppColors.primaryOrange
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: state.searchMode == SearchMode.packages
                      ? [
                          BoxShadow(
                            color: AppColors.primaryOrange.withOpacity(0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.flight,
                      size: 16,
                      color: state.searchMode == SearchMode.packages
                          ? Colors.white
                          : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        state.t("tourPackagesMode"),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: state.searchMode == SearchMode.packages
                              ? Colors.white
                              : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: InkWell(
              onTap: () => state.setSearchMode(SearchMode.itinerary),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: state.searchMode == SearchMode.itinerary
                      ? AppColors.primaryOrange
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: state.searchMode == SearchMode.itinerary
                      ? [
                          BoxShadow(
                            color: AppColors.primaryOrange.withOpacity(0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.auto_awesome,
                      size: 16,
                      color: state.searchMode == SearchMode.itinerary
                          ? Colors.white
                          : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        state.t("aiItineraryMode"),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: state.searchMode == SearchMode.itinerary
                              ? Colors.white
                              : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPackageSearchCard(AppState state, bool isDark) {
    final quickDestinations = [
      {'label': state.t("quickDubai"), 'val': 'Dubay, BAA'},
      {'label': state.t("quickAntalya"), 'val': 'Antaliya, Turkiya'},
      {'label': state.t("quickSharm"), 'val': 'Sharm ash-Shayx, Misr'},
      {'label': 'Maldiv', 'val': 'Male, Maldiv'},
      {'label': 'Pxuket', 'val': 'Pxuket, Tailand'},
      {'label': 'Nha Trang', 'val': 'Nha Trang, Vyetnam'},
      {'label': 'Xaynan', 'val': 'Sanya, Xitoy'},
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            state.t("searchTourPackage"),
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.amber.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              "KOMPAS TOUR",
                              style: TextStyle(
                                color: Colors.amber,
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "online.uz.kompastour.com • Jonli narxlar",
                        style: TextStyle(
                          fontSize: 9,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              InkWell(
                onTap: _triggerSearch,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryOrange.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AppColors.primaryOrange.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.sync, size: 12, color: AppColors.primaryOrange),
                      const SizedBox(width: 4),
                      Text(
                        state.language == Language.uz ? "Yangilash" : "Обновить",
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryOrange,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Origin and Destination with Swap button
          Stack(
            children: [
              Column(
                children: [
                  // From
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: AppColors.skyBlue.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.flight_takeoff, size: 16, color: AppColors.skyBlue),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                state.t("from"),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                                ),
                              ),
                              TextField(
                                controller: _originController,
                                onChanged: (val) => state.setOrigin(val),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                                ),
                                decoration: InputDecoration(
                                  isDense: true,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 2),
                                  border: InputBorder.none,
                                  hintText: "Toshkent (TAS)",
                                  hintStyle: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),

                  // To
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: AppColors.primaryOrange.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.location_on, size: 16, color: AppColors.primaryOrange),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                state.t("to"),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                                ),
                              ),
                              TextField(
                                controller: _destinationController,
                                onChanged: (val) => state.setDestination(val),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                                ),
                                decoration: InputDecoration(
                                  isDense: true,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 2),
                                  border: InputBorder.none,
                                  hintText: state.language == Language.uz
                                      ? "Antalya, Dubay, Sharm..."
                                      : (state.language == Language.ru ? "Анталья, Дубай, Шарм..." : "Antalya, Dubai, Sharm..."),
                                  hintStyle: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                                  ),
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

              // Swap Button
              Positioned(
                right: 14,
                top: 36,
                child: InkWell(
                  onTap: _handleSwap,
                  borderRadius: BorderRadius.circular(18),
                  child: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.primaryOrange,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryOrange.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.swap_vert, color: Colors.white, size: 18),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Date & Travelers Row
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: state.flyDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) state.setFlyDate(picked);
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          state.t("departureDate"),
                          style: TextStyle(
                            fontSize: 10,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          DateFormat('dd.MM.yyyy').format(state.flyDate),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
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
                  onTap: () => TravelersSheet.show(context),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          state.t("travelers"),
                          style: TextStyle(
                            fontSize: 10,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "${state.travelersCount} kishi, 1 xona",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Icon(
                              Icons.chevron_right,
                              size: 16,
                              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Quick destination filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: quickDestinations.map((q) {
                final isSelected = state.destination == q['val'];
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: InkWell(
                    onTap: () {
                      state.setDestination(q['val']!);
                      _destinationController.text = q['val']!;
                      _triggerSearch();
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primaryOrange
                            : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primaryOrange
                              : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        ),
                      ),
                      child: Text(
                        q['label']!,
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
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),

          // Big Orange CTA Search Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _triggerSearch,
              icon: const Icon(Icons.search, size: 18),
              label: Text(
                state.t("btnSearchTours"),
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                ),
                elevation: 4,
                shadowColor: AppColors.primaryOrange.withOpacity(0.4),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchLoader(AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: AppColors.primaryOrange.withOpacity(0.4),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(
            width: 32,
            height: 32,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              color: AppColors.primaryOrange,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            state.language == Language.uz
                ? "Turpaketlar qidirilmoqda..."
                : "Поиск лучших турпакетов...",
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "14 ta turoperator va arzon charter reyslar solishtirilmoqda.",
            style: TextStyle(
              fontSize: 11,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips(AppState state, bool isDark) {
    final filters = [
      {'key': 'all', 'label': state.t("filterAll")},
      {'key': '5star', 'label': state.t("filter5Star")},
      {'key': 'ultra', 'label': state.t("filterUltra")},
      {'key': 'cheap', 'label': state.t("filterCheap")},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((f) {
          final isSelected = state.filterType == f['key'];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => state.setFilterType(f['key']!),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryOrange
                      : (isDark ? AppColors.darkCard : AppColors.lightCard),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primaryOrange
                        : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                ),
                child: Text(
                  f['label']!,
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
    );
  }

  Widget _buildPackageCard(TourPackage pkg, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Cover Image with badges and save button
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            child: Stack(
              children: [
                Image.network(
                  pkg.img,
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 150,
                    color: isDark ? AppColors.darkCardSecondary : Colors.grey[300],
                    child: const Center(child: Icon(Icons.apartment, size: 40, color: Colors.grey)),
                  ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.primaryOrange,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          pkg.tag,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.65),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.amber.withOpacity(0.35)),
                        ),
                        child: const Text(
                          "Kompas Tour",
                          style: TextStyle(
                            color: Colors.amber,
                            fontSize: 8.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: InkWell(
                    onTap: () {
                      state.toggleSaveTour(pkg.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            pkg.saved
                                ? "Saqlanganlardan olib tashlandi"
                                : "Turpaket saqlanganlarga qo'shildi ❤️",
                          ),
                          behavior: SnackBarBehavior.floating,
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        pkg.saved ? Icons.favorite : Icons.favorite_border,
                        color: pkg.saved ? AppColors.flashRed : Colors.white,
                        size: 18,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.star, size: 12, color: AppColors.gold),
                        const SizedBox(width: 4),
                        Text(
                          "${pkg.rating}",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (pkg.is5Star) ...[
                          const SizedBox(width: 6),
                          const Text(
                            "⭐ 5★",
                            style: TextStyle(color: AppColors.gold, fontSize: 10),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Details & Booking
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pkg.title,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: 12,
                                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                pkg.location,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        if (pkg.oldPrice != null)
                          Text(
                            "\$${pkg.oldPrice}",
                            style: const TextStyle(
                              fontSize: 11,
                              color: Colors.grey,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        Text(
                          "\$${pkg.price}",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryOrange,
                          ),
                        ),
                        Text(
                          state.t("perPerson"),
                          style: TextStyle(
                            fontSize: 9,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Flight & Nights info badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.flight, size: 14, color: AppColors.skyBlue),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          "${pkg.flightBlock ?? pkg.flight} • ${pkg.nights}",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (pkg.transferIncluded)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.emerald.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            state.t("transferIncluded"),
                            style: const TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: AppColors.emerald,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Action buttons: Details & Instant Book
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => TourDetailsSheet.show(context, pkg),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          side: BorderSide(
                            color: isDark ? AppColors.darkBorder : AppColors.lightBorderLight,
                          ),
                        ),
                        child: Text(
                          state.t("btnDetails"),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          state.bookTour(pkg);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(state.t("bookedSuccess")),
                              backgroundColor: AppColors.emerald,
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryOrange,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: Text(
                          state.t("btnBook"),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItineraryView(AppState state, bool isDark) {
    final itinerary = state.itinerary;
    final currentDayPlan = itinerary.days[state.activeDay];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // AI Itinerary Header Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E1B4B), Color(0xFF312E81)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: Colors.indigo.withOpacity(0.4),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.auto_awesome, size: 14, color: AppColors.gold),
                        SizedBox(width: 4),
                        Text(
                          "TripCraft Smart AI Route",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    itinerary.dates,
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                itinerary.destination,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                "${itinerary.style} • ${itinerary.travelers} Travelers",
                style: const TextStyle(color: Colors.white70, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Day Selector Tabs
        Row(
          children: [1, 2, 3].map((day) {
            final isSelected = state.activeDay == day;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(right: day < 3 ? 8 : 0),
                child: InkWell(
                  onTap: () => state.setActiveDay(day),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryOrange
                          : (isDark ? AppColors.darkCard : AppColors.lightCard),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primaryOrange
                            : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                      ),
                    ),
                    child: Text(
                      "${state.t("day")} $day",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected
                            ? Colors.white
                            : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 14),

        // Day summary card
        if (currentDayPlan != null) ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
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
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      currentDayPlan.subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "${currentDayPlan.activities.length} ${state.t("stops")} • ${state.t("budgetEst")}: \$95",
                      style: TextStyle(
                        fontSize: 10,
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Marshrut havolasi nusxalandi!"),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.share, size: 16, color: AppColors.skyBlue),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Activities list
          ...currentDayPlan.activities.map((act) => _buildActivityCard(act, state, isDark)),
        ],
      ],
    );
  }

  Widget _buildActivityCard(dynamic act, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primaryOrange.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      act.time,
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: AppColors.primaryOrange,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    act.duration,
                    style: TextStyle(
                      fontSize: 10,
                      color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  act.type,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          Text(
            act.title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w900,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            act.desc,
            style: TextStyle(
              fontSize: 11,
              height: 1.4,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 10),

          // Transit info row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.directions_subway, size: 13, color: AppColors.skyBlue),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    act.transit,
                    style: TextStyle(
                      fontSize: 10,
                      color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  act.price,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.emerald,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Actions: Swap & Delete
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () {
                  state.swapActivity(act.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        state.language == Language.uz
                            ? "AI yangi faoliyat bilan almashtirdi!"
                            : "AI заменил активность!",
                      ),
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
                icon: const Icon(Icons.refresh, size: 14, color: AppColors.primaryOrange),
                label: Text(
                  state.t("swap"),
                  style: const TextStyle(fontSize: 11, color: AppColors.primaryOrange, fontWeight: FontWeight.bold),
                ),
                style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () {
                  state.deleteActivity(act.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        state.language == Language.uz
                            ? "Faoliyat o'chirildi"
                            : "Активность удалена",
                      ),
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
                icon: const Icon(Icons.delete_outline, size: 14, color: AppColors.flashRed),
                label: Text(
                  state.t("delete"),
                  style: const TextStyle(fontSize: 11, color: AppColors.flashRed, fontWeight: FontWeight.bold),
                ),
                style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
