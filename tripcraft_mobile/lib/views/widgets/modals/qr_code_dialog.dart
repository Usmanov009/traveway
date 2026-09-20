import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../state/app_state.dart';
import '../../../theme/app_colors.dart';

class QrCodeDialog extends StatelessWidget {
  const QrCodeDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;
    final user = state.user;

    return Dialog(
      backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: BorderSide(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.qr_code, color: AppColors.primaryOrange, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      state.t("qrTitle"),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryOrange,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, size: 18),
                  visualDensity: VisualDensity.compact,
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ],
            ),
            const SizedBox(height: 8),

            Text(
              state.t("qrUser"),
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              state.t("qrSub"),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
              ),
            ),
            const SizedBox(height: 20),

            // QR Box Graphic
            Container(
              width: 180,
              height: 180,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey[300]!),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: CustomPaint(
                painter: _QrSimulationPainter(),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              "${user.id} • ${user.name}",
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryOrange,
                fontFamily: 'monospace',
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isDark ? AppColors.darkCardSecondary : Colors.grey[200],
                  foregroundColor: isDark ? Colors.white : Colors.black87,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  elevation: 0,
                ),
                child: Text(
                  state.t("close"),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QrSimulationPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF0F172A)
      ..style = PaintingStyle.fill;

    // Corner 1
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width * 0.3, size.height * 0.3), paint);
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.05, size.height * 0.05, size.width * 0.2, size.height * 0.2),
      Paint()..color = Colors.white,
    );
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.09, size.height * 0.09, size.width * 0.12, size.height * 0.12),
      paint,
    );

    // Corner 2
    canvas.drawRect(Rect.fromLTWH(size.width * 0.7, 0, size.width * 0.3, size.height * 0.3), paint);
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.75, size.height * 0.05, size.width * 0.2, size.height * 0.2),
      Paint()..color = Colors.white,
    );
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.79, size.height * 0.09, size.width * 0.12, size.height * 0.12),
      paint,
    );

    // Corner 3
    canvas.drawRect(Rect.fromLTWH(0, size.height * 0.7, size.width * 0.3, size.height * 0.3), paint);
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.05, size.height * 0.75, size.width * 0.2, size.height * 0.2),
      Paint()..color = Colors.white,
    );
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.09, size.height * 0.79, size.width * 0.12, size.height * 0.12),
      paint,
    );

    // Random pattern dots & stripes in the center
    canvas.drawRect(Rect.fromLTWH(size.width * 0.45, 0, size.width * 0.1, size.height * 0.4), paint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.38, size.height * 0.45, size.width * 0.24, size.height * 0.1), paint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.7, size.height * 0.45, size.width * 0.25, size.height * 0.18), paint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.4, size.height * 0.65, size.width * 0.15, size.height * 0.3), paint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.65, size.height * 0.75, size.width * 0.25, size.height * 0.15), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
