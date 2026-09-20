import 'app_enums.dart';

class Booking {
  final String id;
  final String tourTitle;
  final String dest;
  final String dates;
  final String status;
  final String voucherId;
  final String price;
  final String travelers;
  final BookingType type;
  final String createdAt;

  Booking({
    required this.id,
    required this.tourTitle,
    required this.dest,
    required this.dates,
    required this.status,
    required this.voucherId,
    required this.price,
    required this.travelers,
    required this.type,
    required this.createdAt,
  });

  Booking copyWith({
    String? id,
    String? tourTitle,
    String? dest,
    String? dates,
    String? status,
    String? voucherId,
    String? price,
    String? travelers,
    BookingType? type,
    String? createdAt,
  }) {
    return Booking(
      id: id ?? this.id,
      tourTitle: tourTitle ?? this.tourTitle,
      dest: dest ?? this.dest,
      dates: dates ?? this.dates,
      status: status ?? this.status,
      voucherId: voucherId ?? this.voucherId,
      price: price ?? this.price,
      travelers: travelers ?? this.travelers,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
