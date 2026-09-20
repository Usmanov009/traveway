import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tripcraft_mobile/main.dart';
import 'package:tripcraft_mobile/state/app_state.dart';

void main() {
  testWidgets('TripCraft app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const TripCraftApp(),
      ),
    );

    expect(find.byType(TripCraftApp), findsOneWidget);
  });
}
