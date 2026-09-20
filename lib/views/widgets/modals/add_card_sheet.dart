import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/app_enums.dart';
import '../../../models/payment_card.dart';
import '../../../state/app_state.dart';
import '../../../theme/app_colors.dart';

class AddCardSheet extends StatefulWidget {
  const AddCardSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const AddCardSheet(),
    );
  }

  @override
  State<AddCardSheet> createState() => _AddCardSheetState();
}

class _AddCardSheetState extends State<AddCardSheet> {
  CardType cardType = CardType.humo;
  final TextEditingController numberController = TextEditingController();
  final TextEditingController expiryController = TextEditingController();
  final TextEditingController bankController = TextEditingController();

  @override
  void dispose() {
    numberController.dispose();
    expiryController.dispose();
    bankController.dispose();
    super.dispose();
  }

  void _submit() {
    final rawNum = numberController.text.replaceAll(' ', '').trim();
    if (rawNum.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Karta raqamini to'liq kiriting")),
      );
      return;
    }

    final last4 = rawNum.substring(rawNum.length - 4);
    final bankName = bankController.text.trim().isNotEmpty
        ? bankController.text.trim()
        : (cardType == CardType.humo
            ? "O'zbekiston banki (UZS)"
            : (cardType == CardType.visa ? "Xalqaro bank (USD)" : "Milliy bank (UZS)"));

    final newCard = PaymentCard(
      id: 'c-${DateTime.now().millisecondsSinceEpoch}',
      type: cardType,
      last4: last4,
      bank: bankName,
      isPrimary: false,
      expiry: expiryController.text.trim().isNotEmpty ? expiryController.text.trim() : '12/28',
    );

    context.read<AppState>().addCard(newCard);
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Yangi to'lov kartasi muvaffaqiyatli qo'shildi"),
        backgroundColor: AppColors.emerald,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
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
              // Drag handle
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
                  Row(
                    children: [
                      const Icon(Icons.credit_card, color: AppColors.primaryOrange, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        state.t("addNewCard"),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                        ),
                      ),
                    ],
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

              // Card Type Selection
              Text(
                state.t("cardSystem"),
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _buildTypeOption("HUMO", CardType.humo, isDark),
                  const SizedBox(width: 8),
                  _buildTypeOption("UZCARD", CardType.uzcard, isDark),
                  const SizedBox(width: 8),
                  _buildTypeOption("VISA", CardType.visa, isDark),
                ],
              ),
              const SizedBox(height: 14),

              // Card number
              Text(
                state.t("cardNumber"),
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: numberController,
                keyboardType: TextInputType.number,
                maxLength: 19,
                decoration: InputDecoration(
                  counterText: "",
                  hintText: cardType == CardType.visa
                      ? "4000 1234 5678 9010"
                      : (cardType == CardType.humo ? "9860 1234 5678 4892" : "8600 1234 5678 1234"),
                  filled: true,
                  fillColor: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(
                      color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(
                      color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.primaryOrange),
                  ),
                ),
                style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
              const SizedBox(height: 14),

              // Expiry and Bank
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          state.t("expiryDate"),
                          style: TextStyle(
                            fontSize: 11,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        TextField(
                          controller: expiryController,
                          keyboardType: TextInputType.datetime,
                          maxLength: 5,
                          decoration: InputDecoration(
                            counterText: "",
                            hintText: "12/28",
                            filled: true,
                            fillColor: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: BorderSide(
                                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: BorderSide(
                                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          state.t("bankName"),
                          style: TextStyle(
                            fontSize: 11,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        TextField(
                          controller: bankController,
                          decoration: InputDecoration(
                            hintText: "Kapital, Ipak Yo'li...",
                            filled: true,
                            fillColor: isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: BorderSide(
                                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: BorderSide(
                                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _submit,
                  icon: const Icon(Icons.shield_outlined, size: 18),
                  label: Text(
                    state.t("linkCardSecurely"),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.emerald,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypeOption(String label, CardType type, bool isDark) {
    final isSelected = cardType == type;

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => cardType = type),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primaryOrange.withOpacity(0.15)
                : (isDark ? AppColors.darkCardSecondary : AppColors.lightCardSecondary),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.primaryOrange : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: isSelected
                  ? AppColors.primaryOrange
                  : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
            ),
          ),
        ),
      ),
    );
  }
}
