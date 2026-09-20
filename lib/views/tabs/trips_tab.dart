import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/app_enums.dart';
import '../../models/booking.dart';
import '../../models/tour_package.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../widgets/modals/tour_details_sheet.dart';
import '../widgets/modals/qr_code_dialog.dart';

class TripsTab extends StatefulWidget {
  const TripsTab({super.key});

  @override
  State<TripsTab> createState() => _TripsTabState();
}

class _TripsTabState extends State<TripsTab> {
  String subTab = 'active'; // 'active' or 'saved'

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        // Sub Tabs Switcher
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCardSecondary : AppColors.lightBorder,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorderLight,
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () => setState(() => subTab = 'active'),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 9),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: subTab == 'active' ? AppColors.primaryOrange : Colors.transparent,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(
                      "${state.t("activeOrders")} (${state.bookings.length})",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: subTab == 'active'
                            ? Colors.white
                            : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () => setState(() => subTab = 'saved'),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 9),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: subTab == 'saved' ? AppColors.primaryOrange : Colors.transparent,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(
                      "${state.t("savedTours")} (${state.savedTours.length})",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: subTab == 'saved'
                            ? Colors.white
                            : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        if (subTab == 'active') ...[
          // ACTIVE BOOKINGS LIST
          if (state.bookings.isEmpty)
            _buildEmptyBookings(state, isDark)
          else
            ...state.bookings.map((b) => _buildBookingCard(b, state, isDark)),
        ] else ...[
          // SAVED TOURS LIST
          if (state.savedTours.isEmpty)
            _buildEmptySaved(state, isDark)
          else
            ...state.savedTours.map((t) => _buildSavedTourCard(t, state, isDark)),
        ],

        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildEmptyBookings(AppState state, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.primaryOrange.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.confirmation_number_outlined, size: 28, color: AppColors.primaryOrange),
          ),
          const SizedBox(height: 14),
          Text(
            state.t("noActiveBookings"),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            state.t("noActiveBookingsSub"),
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => state.setTab(TabType.search),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryOrange,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: Text(
              state.t("btnSearchTours"),
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptySaved(AppState state, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        children: [
          const Icon(Icons.favorite_border, size: 40, color: Colors.grey),
          const SizedBox(height: 12),
          Text(
            state.t("noSavedTours"),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingCard(Booking b, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(20),
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
                      "ID: ${b.voucherId}",
                      style: const TextStyle(
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      b.tourTitle,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.emerald.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.emerald.withOpacity(0.3)),
                ),
                child: Text(
                  "✓ ${b.status}",
                  style: const TextStyle(
                    color: AppColors.emerald,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Yo'nalish:", style: TextStyle(fontSize: 9, color: Colors.grey)),
                    Text(
                      "📍 ${b.dest}",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Sanalar:", style: TextStyle(fontSize: 9, color: Colors.grey)),
                    Text(
                      "📅 ${b.dates}",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          Divider(height: 1, color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
          const SizedBox(height: 8),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                b.price,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primaryOrange,
                ),
              ),
              Row(
                children: [
                  ElevatedButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const QrCodeDialog(),
                      );
                    },
                    icon: const Icon(Icons.qr_code, size: 13),
                    label: Text(state.t("voucher"), style: const TextStyle(fontSize: 10)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.darkCardSecondary : Colors.grey[200],
                      foregroundColor: isDark ? Colors.white : Colors.black87,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      visualDensity: VisualDensity.compact,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(width: 6),
                  TextButton(
                    onPressed: () {
                      state.cancelBooking(b.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Buyurtma bekor qilindi"),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.flashRed,
                      visualDensity: VisualDensity.compact,
                    ),
                    child: Text(state.t("cancelBooking"), style: const TextStyle(fontSize: 10)),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSavedTourCard(TourPackage tour, AppState state, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Image.network(
              tour.img,
              width: 68,
              height: 68,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 68,
                height: 68,
                color: Colors.grey[300],
                child: const Icon(Icons.apartment, color: Colors.grey),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tour.title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  "📍 ${tour.location}",
                  style: TextStyle(
                    fontSize: 10,
                    color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  "\$${tour.price} / ${state.t("perPerson")}",
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryOrange,
                  ),
                ),
              ],
            ),
          ),
          Column(
            children: [
              ElevatedButton(
                onPressed: () => TourDetailsSheet.show(context, tour),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryOrange,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  visualDensity: VisualDensity.compact,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: Text(
                  state.t("btnDetails"),
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
              TextButton(
                onPressed: () => state.toggleSaveTour(tour.id),
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.flashRed,
                  visualDensity: VisualDensity.compact,
                ),
                child: Text(state.t("delete"), style: const TextStyle(fontSize: 10)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
