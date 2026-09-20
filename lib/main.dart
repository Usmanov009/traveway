import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'models/app_enums.dart';
import 'state/app_state.dart';
import 'theme/app_theme.dart';
import 'views/main_scaffold.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const TripCraftApp(),
    ),
  );
}

class TripCraftApp extends StatelessWidget {
  const TripCraftApp({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return MaterialApp(
      title: 'TripCraft — Aviasales TMA',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: state.themeMode == AppThemeMode.dark ? ThemeMode.dark : ThemeMode.light,
      home: const MainScaffold(),
    );
  }
}
