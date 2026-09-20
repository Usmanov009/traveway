class HotDeal {
  final String id;
  final String title;
  final String discount;
  final String oldPrice;
  final String price;
  final String timeLeft;
  final String flight;
  final String freeSeats;
  final String img;
  final String location;
  final String? operator;
  final String? operatorUrl;
  final String? nights;

  HotDeal({
    required this.id,
    required this.title,
    required this.discount,
    required this.oldPrice,
    required this.price,
    required this.timeLeft,
    required this.flight,
    required this.freeSeats,
    required this.img,
    required this.location,
    this.operator,
    this.operatorUrl,
    this.nights,
  });
}
