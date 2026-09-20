import 'app_enums.dart';

class TourPackage {
  final String id;
  final String title;
  final String location;
  final String country;
  final String tag;
  final BadgeType badgeType;
  final bool is5Star;
  final double rating;
  final String nights;
  final String flight;
  final int price;
  final int? oldPrice;
  final String img;
  bool saved;
  final String airline;
  final String insurance;
  final bool transferIncluded;
  final String description;
  final String? operator;
  final String? operatorUrl;
  final String? flightBlock;
  final String? mealPlan;
  final String? roomType;

  TourPackage({
    required this.id,
    required this.title,
    required this.location,
    required this.country,
    required this.tag,
    required this.badgeType,
    required this.is5Star,
    required this.rating,
    required this.nights,
    required this.flight,
    required this.price,
    this.oldPrice,
    required this.img,
    this.saved = false,
    required this.airline,
    required this.insurance,
    required this.transferIncluded,
    required this.description,
    this.operator,
    this.operatorUrl,
    this.flightBlock,
    this.mealPlan,
    this.roomType,
  });

  TourPackage copyWith({
    String? id,
    String? title,
    String? location,
    String? country,
    String? tag,
    BadgeType? badgeType,
    bool? is5Star,
    double? rating,
    String? nights,
    String? flight,
    int? price,
    int? oldPrice,
    String? img,
    bool? saved,
    String? airline,
    String? insurance,
    bool? transferIncluded,
    String? description,
    String? operator,
    String? operatorUrl,
    String? flightBlock,
    String? mealPlan,
    String? roomType,
  }) {
    return TourPackage(
      id: id ?? this.id,
      title: title ?? this.title,
      location: location ?? this.location,
      country: country ?? this.country,
      tag: tag ?? this.tag,
      badgeType: badgeType ?? this.badgeType,
      is5Star: is5Star ?? this.is5Star,
      rating: rating ?? this.rating,
      nights: nights ?? this.nights,
      flight: flight ?? this.flight,
      price: price ?? this.price,
      oldPrice: oldPrice ?? this.oldPrice,
      img: img ?? this.img,
      saved: saved ?? this.saved,
      airline: airline ?? this.airline,
      insurance: insurance ?? this.insurance,
      transferIncluded: transferIncluded ?? this.transferIncluded,
      description: description ?? this.description,
      operator: operator ?? this.operator,
      operatorUrl: operatorUrl ?? this.operatorUrl,
      flightBlock: flightBlock ?? this.flightBlock,
      mealPlan: mealPlan ?? this.mealPlan,
      roomType: roomType ?? this.roomType,
    );
  }
}
