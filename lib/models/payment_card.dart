import 'app_enums.dart';

class PaymentCard {
  final String id;
  final CardType type;
  final String last4;
  final String bank;
  final bool isPrimary;
  final String expiry;

  PaymentCard({
    required this.id,
    required this.type,
    required this.last4,
    required this.bank,
    required this.isPrimary,
    required this.expiry,
  });

  String get typeName {
    switch (type) {
      case CardType.humo:
        return 'HUMO';
      case CardType.uzcard:
        return 'UZCARD';
      case CardType.visa:
        return 'VISA';
    }
  }

  PaymentCard copyWith({
    String? id,
    CardType? type,
    String? last4,
    String? bank,
    bool? isPrimary,
    String? expiry,
  }) {
    return PaymentCard(
      id: id ?? this.id,
      type: type ?? this.type,
      last4: last4 ?? this.last4,
      bank: bank ?? this.bank,
      isPrimary: isPrimary ?? this.isPrimary,
      expiry: expiry ?? this.expiry,
    );
  }
}
