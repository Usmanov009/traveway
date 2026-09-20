import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../models/app_enums.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  int _authMethod = 0; // 0 = Phone, 1 = Telegram
  bool _isOtpStep = false;
  bool _isLoading = false;
  String _phoneError = '';
  
  final TextEditingController _phoneController = TextEditingController();
  final List<TextEditingController> _otpControllers = List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _otpFocusNodes = List.generate(4, (_) => FocusNode());

  Timer? _timer;
  int _resendCountdown = 60;

  @override
  void dispose() {
    _timer?.cancel();
    _phoneController.dispose();
    for (var c in _otpControllers) {
      c.dispose();
    }
    for (var f in _otpFocusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() {
      _resendCountdown = 60;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendCountdown > 0) {
        setState(() {
          _resendCountdown--;
        });
      } else {
        _timer?.cancel();
      }
    });
  }

  void _onSendOtp() {
    final rawDigits = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    if (rawDigits.length < 9) {
      setState(() {
        _phoneError = context.read<AppState>().t("invalidPhone");
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _phoneError = '';
    });

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _isOtpStep = true;
      });
      for (var c in _otpControllers) {
        c.clear();
      }
      _startTimer();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            context.read<AppState>().language == Language.uz
                ? "SMS kod yuborildi (sinov uchun: 1234)"
                : (context.read<AppState>().language == Language.ru
                    ? "SMS код отправлен (для теста: 1234)"
                    : "SMS code sent (test: 1234)"),
          ),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.darkCard,
        ),
      );
      _otpFocusNodes[0].requestFocus();
    });
  }

  void _onVerifyOtp() {
    final code = _otpControllers.map((c) => c.text).join();
    if (code.length < 4) return;

    setState(() {
      _isLoading = true;
    });

    Future.delayed(const Duration(milliseconds: 700), () {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
      final state = context.read<AppState>();
      final formatted = "+998 ${_formatPhone(_phoneController.text)}";
      state.login(
        phone: formatted,
        name: state.language == Language.uz ? "Sayohatchi" : (state.language == Language.ru ? "Путешественник" : "Traveler"),
        telegram: "@user_${_phoneController.text.replaceAll(RegExp(r'\D'), '').substring(5)}",
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(state.t("loginSuccess")),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.primaryOrange,
        ),
      );
    });
  }

  void _onTelegramLogin() {
    setState(() {
      _isLoading = true;
    });
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
      final state = context.read<AppState>();
      state.login(
        name: "Jasur Rahimov",
        phone: "+998 90 123 45 67",
        telegram: "@jasur_traveler",
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(state.t("loginSuccess")),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.primaryOrange,
        ),
      );
    });
  }

  void _onDemoLogin() {
    final state = context.read<AppState>();
    state.login(
      name: "Jasur Rahimov",
      phone: "+998 90 123 45 67",
      telegram: "@jasur_traveler",
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(state.t("loginSuccess")),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.primaryOrange,
      ),
    );
  }

  void _onGuestLogin() {
    final state = context.read<AppState>();
    state.continueAsGuest();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(state.t("guestSuccess")),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.darkCard,
      ),
    );
  }

  String _formatPhone(String raw) {
    String digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.startsWith('998')) digits = digits.substring(3);
    if (digits.length > 9) digits = digits.substring(0, 9);

    String res = '';
    if (digits.isNotEmpty) res += digits.substring(0, digits.length >= 2 ? 2 : digits.length);
    if (digits.length >= 3) res += ' ${digits.substring(2, digits.length >= 5 ? 5 : digits.length)}';
    if (digits.length >= 6) res += ' ${digits.substring(5, digits.length >= 7 ? 7 : digits.length)}';
    if (digits.length >= 8) res += ' ${digits.substring(7, 9)}';
    return res;
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = state.isDark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Top Settings Bar (Brand, Language, Theme)
                  _buildTopBar(state, isDark),
                  const SizedBox(height: 24),

                  // Main Card Container
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: isDark ? Colors.black38 : Colors.black.withOpacity(0.06),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Card Header
                        Container(
                          width: 58,
                          height: 58,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppColors.primaryOrange, AppColors.amberAccent],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primaryOrange.withOpacity(0.35),
                                blurRadius: 14,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.flight_takeoff_rounded,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          state.t("loginTitle"),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 19,
                            fontWeight: FontWeight.w900,
                            color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          state.t("loginSub"),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Tab Switcher (Phone vs Telegram)
                        _buildAuthTabSelector(state, isDark),
                        const SizedBox(height: 20),

                        // Auth Form
                        if (_authMethod == 0)
                          _buildPhoneForm(state, isDark)
                        else
                          _buildTelegramForm(state, isDark),

                        const SizedBox(height: 20),
                        Divider(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        const SizedBox(height: 12),

                        // Quick Demo Login
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _onDemoLogin,
                            icon: const Icon(Icons.auto_awesome, color: AppColors.amberAccent, size: 16),
                            label: Text(
                              state.t("demoLoginBtn"),
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: isDark ? AppColors.amberAccent : Colors.orange.shade800,
                              side: BorderSide(color: AppColors.amberAccent.withOpacity(0.4)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Continue as Guest
                        TextButton.icon(
                          onPressed: _onGuestLogin,
                          icon: Icon(Icons.person_outline_rounded, size: 16, color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                          label: Text(
                            state.t("guestBtn"),
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                            ),
                          ),
                        ),
                        Text(
                          state.t("guestNote"),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 10,
                            color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                  Text(
                    "TripCraft TMA • Aviasales Experience v2.4",
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar(AppState state, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primaryOrange, AppColors.primaryOrangeDark],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.flight, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      "TripCraft",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: AppColors.primaryOrange.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        "TMA",
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryOrange,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  "AVIASALES PRECISION",
                  style: TextStyle(
                    fontSize: 8,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                  ),
                ),
              ],
            ),
          ],
        ),

        // Language and Theme buttons
        Row(
          children: [
            // Language selector
            Container(
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCard : AppColors.lightSurface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
              ),
              child: Row(
                children: [
                  _langButton(state, Language.uz, "UZ"),
                  _langButton(state, Language.ru, "RU"),
                  _langButton(state, Language.en, "EN"),
                ],
              ),
            ),
            const SizedBox(width: 6),
            // Theme toggle
            IconButton(
              onPressed: () => state.toggleTheme(),
              icon: Icon(
                isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                color: isDark ? AppColors.amberAccent : AppColors.darkBg,
                size: 20,
              ),
              style: IconButton.styleFrom(
                backgroundColor: isDark ? AppColors.darkCard : AppColors.lightSurface,
                side: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _langButton(AppState state, Language lang, String text) {
    final isSelected = state.language == lang;
    return GestureDetector(
      onTap: () => state.setLanguage(lang),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryOrange : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : (state.isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
          ),
        ),
      ),
    );
  }

  Widget _buildAuthTabSelector(AppState state, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkBg : AppColors.lightBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _authMethod = 0;
                  _isOtpStep = false;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _authMethod == 0 ? AppColors.primaryOrange : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: _authMethod == 0
                      ? [
                          BoxShadow(
                            color: AppColors.primaryOrange.withOpacity(0.3),
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
                      Icons.phone_iphone_rounded,
                      size: 15,
                      color: _authMethod == 0 ? Colors.white : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      state.t("phoneTab"),
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: _authMethod == 0 ? Colors.white : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _authMethod = 1;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _authMethod == 1 ? const Color(0xFF0088CC) : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: _authMethod == 1
                      ? [
                          BoxShadow(
                            color: const Color(0xFF0088CC).withOpacity(0.3),
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
                      Icons.send_rounded,
                      size: 14,
                      color: _authMethod == 1 ? Colors.white : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      state.t("telegramTab"),
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: _authMethod == 1 ? Colors.white : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
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

  Widget _buildPhoneForm(AppState state, bool isDark) {
    if (!_isOtpStep) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            state.t("phoneNumber"),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 8),

          // Phone Input Container
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkBg : AppColors.lightBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _phoneError.isNotEmpty ? AppColors.flashRed : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
              ),
            ),
            child: Row(
              children: [
                const Text("🇺🇿", style: TextStyle(fontSize: 18)),
                const SizedBox(width: 8),
                Text(
                  "+998",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                  ),
                ),
                Container(
                  width: 1,
                  height: 20,
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                ),
                Expanded(
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(9),
                    ],
                    onChanged: (_) {
                      if (_phoneError.isNotEmpty) {
                        setState(() => _phoneError = '');
                      }
                    },
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1,
                      color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                    ),
                    decoration: InputDecoration(
                      hintText: "90 123 45 67",
                      hintStyle: TextStyle(
                        color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
              ],
            ),
          ),

          if (_phoneError.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              _phoneError,
              style: const TextStyle(color: AppColors.flashRed, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],

          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                state.t("enterPhoneDesc"),
                style: TextStyle(
                  fontSize: 10,
                  color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
                ),
              ),
              GestureDetector(
                onTap: () {
                  _phoneController.text = "901234567";
                  setState(() => _phoneError = '');
                },
                child: const Text(
                  "Demo: 90 123 45 67",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryOrange,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // Send Code Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _onSendOtp,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
                shadowColor: AppColors.primaryOrange.withOpacity(0.4),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.flash_on_rounded, size: 18, color: Colors.amberAccent),
                        const SizedBox(width: 8),
                        Text(
                          state.t("btnSendCode"),
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      );
    } else {
      // OTP Verification Step
      return Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () => setState(() => _isOtpStep = false),
                icon: const Icon(Icons.arrow_back, size: 14),
                label: Text(
                  state.t("changePhone"),
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                ),
                style: TextButton.styleFrom(
                  foregroundColor: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                  padding: EdgeInsets.zero,
                  visualDensity: VisualDensity.compact,
                ),
              ),
              Text(
                "+998 ${_formatPhone(_phoneController.text)}",
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primaryOrange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            state.t("otpTitle"),
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w900,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "${state.t("otpSubtitle")}: +998 ${_formatPhone(_phoneController.text)}",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 16),

          // 4 OTP Boxes
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(4, (index) {
              return Container(
                width: 50,
                height: 54,
                margin: const EdgeInsets.symmetric(horizontal: 5),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkBg : AppColors.lightBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _otpControllers[index].text.isNotEmpty
                        ? AppColors.primaryOrange
                        : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                    width: _otpControllers[index].text.isNotEmpty ? 2 : 1,
                  ),
                ),
                child: Center(
                  child: TextField(
                    controller: _otpControllers[index],
                    focusNode: _otpFocusNodes[index],
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: AppColors.primaryOrange,
                    ),
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(1),
                    ],
                    onChanged: (val) {
                      if (val.isNotEmpty && index < 3) {
                        _otpFocusNodes[index + 1].requestFocus();
                      }
                      if (val.isEmpty && index > 0) {
                        _otpFocusNodes[index - 1].requestFocus();
                      }
                      setState(() {});
                      if (index == 3 && _otpControllers.every((c) => c.text.isNotEmpty)) {
                        _onVerifyOtp();
                      }
                    },
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      counterText: '',
                    ),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 14),

          // Resend Timer
          if (_resendCountdown > 0)
            Text(
              "${state.t("resendIn")} 00:${_resendCountdown.toString().padLeft(2, '0')}",
              style: TextStyle(
                fontSize: 11,
                color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
              ),
            )
          else
            TextButton.icon(
              onPressed: () {
                _startTimer();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      state.language == Language.uz ? "SMS kod qayta yuborildi" : "Код отправлен повторно",
                    ),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              icon: const Icon(Icons.refresh_rounded, size: 14, color: AppColors.primaryOrange),
              label: Text(
                state.t("resendCode"),
                style: const TextStyle(
                  color: AppColors.primaryOrange,
                  fontWeight: FontWeight.w800,
                  fontSize: 11,
                ),
              ),
            ),

          const SizedBox(height: 16),

          // Confirm Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isLoading || _otpControllers.any((c) => c.text.isEmpty) ? null : _onVerifyOtp,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryOrange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.check_circle_outline, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          state.t("btnVerify"),
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      );
    }
  }

  Widget _buildTelegramForm(AppState state, bool isDark) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF0088CC).withOpacity(0.08),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFF0088CC).withOpacity(0.25)),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: const Color(0xFF0088CC),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Telegram Mini App Auth",
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      state.t("telegramLoginDesc"),
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _isLoading ? null : _onTelegramLogin,
            icon: const Icon(Icons.send_rounded, size: 16),
            label: Text(
              state.t("telegramLoginBtn"),
              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0088CC),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 4,
              shadowColor: const Color(0xFF0088CC).withOpacity(0.4),
            ),
          ),
        ),
      ],
    );
  }
}
