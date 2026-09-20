import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../state/app_state.dart';
import '../../../theme/app_colors.dart';

class EditProfileSheet extends StatefulWidget {
  const EditProfileSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const EditProfileSheet(),
    );
  }

  @override
  State<EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends State<EditProfileSheet> {
  late final TextEditingController nameController;
  late final TextEditingController phoneController;
  late final TextEditingController telegramController;

  @override
  void initState() {
    super.initState();
    final user = context.read<AppState>().user;
    nameController = TextEditingController(text: user.name);
    phoneController = TextEditingController(text: user.phone);
    telegramController = TextEditingController(text: user.telegram);
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneController.dispose();
    telegramController.dispose();
    super.dispose();
  }

  void _save() {
    if (nameController.text.trim().isEmpty) return;

    context.read<AppState>().updateProfile(
      name: nameController.text.trim(),
      phone: phoneController.text.trim(),
      telegram: telegramController.text.trim(),
    );
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Profil ma'lumotlari yangilandi"),
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
                    state.t("editProfile"),
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

              _buildField(
                label: state.t("fullName"),
                controller: nameController,
                isDark: isDark,
              ),
              const SizedBox(height: 12),

              _buildField(
                label: state.t("phoneNumber"),
                controller: phoneController,
                keyboardType: TextInputType.phone,
                isDark: isDark,
              ),
              const SizedBox(height: 12),

              _buildField(
                label: state.t("telegramUsername"),
                controller: telegramController,
                isDark: isDark,
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryOrange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    state.t("save"),
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    TextInputType keyboardType = TextInputType.text,
    required bool isDark,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
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
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
