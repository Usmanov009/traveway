class PassportInfo {
  final String type;
  final String number;
  final String expiry;

  PassportInfo({
    required this.type,
    required this.number,
    required this.expiry,
  });

  PassportInfo copyWith({
    String? type,
    String? number,
    String? expiry,
  }) {
    return PassportInfo(
      type: type ?? this.type,
      number: number ?? this.number,
      expiry: expiry ?? this.expiry,
    );
  }
}

class UserProfile {
  final String name;
  final String phone;
  final String telegram;
  final String id;
  final int cashback;
  final PassportInfo passport;

  UserProfile({
    required this.name,
    required this.phone,
    required this.telegram,
    required this.id,
    required this.cashback,
    required this.passport,
  });

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    }
    return 'JR';
  }

  UserProfile copyWith({
    String? name,
    String? phone,
    String? telegram,
    String? id,
    int? cashback,
    PassportInfo? passport,
  }) {
    return UserProfile(
      name: name ?? this.name,
      phone: phone ?? this.phone,
      telegram: telegram ?? this.telegram,
      id: id ?? this.id,
      cashback: cashback ?? this.cashback,
      passport: passport ?? this.passport,
    );
  }
}
