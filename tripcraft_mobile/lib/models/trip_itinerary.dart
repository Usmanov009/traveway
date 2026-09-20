class Activity {
  final String id;
  final String time;
  final String duration;
  final String type;
  final String title;
  final String desc;
  final String transit;
  final String price;
  final String location;
  final String rating;

  Activity({
    required this.id,
    required this.time,
    required this.duration,
    required this.type,
    required this.title,
    required this.desc,
    required this.transit,
    required this.price,
    required this.location,
    required this.rating,
  });

  Activity copyWith({
    String? id,
    String? time,
    String? duration,
    String? type,
    String? title,
    String? desc,
    String? transit,
    String? price,
    String? location,
    String? rating,
  }) {
    return Activity(
      id: id ?? this.id,
      time: time ?? this.time,
      duration: duration ?? this.duration,
      type: type ?? this.type,
      title: title ?? this.title,
      desc: desc ?? this.desc,
      transit: transit ?? this.transit,
      price: price ?? this.price,
      location: location ?? this.location,
      rating: rating ?? this.rating,
    );
  }
}

class DayPlan {
  final String label;
  final String subtitle;
  final List<Activity> activities;

  DayPlan({
    required this.label,
    required this.subtitle,
    required this.activities,
  });

  DayPlan copyWith({
    String? label,
    String? subtitle,
    List<Activity>? activities,
  }) {
    return DayPlan(
      label: label ?? this.label,
      subtitle: subtitle ?? this.subtitle,
      activities: activities ?? this.activities,
    );
  }
}

class TripItinerary {
  final String destination;
  final String dates;
  final String style;
  final int travelers;
  final Map<int, DayPlan> days;

  TripItinerary({
    required this.destination,
    required this.dates,
    required this.style,
    required this.travelers,
    required this.days,
  });

  TripItinerary copyWith({
    String? destination,
    String? dates,
    String? style,
    int? travelers,
    Map<int, DayPlan>? days,
  }) {
    return TripItinerary(
      destination: destination ?? this.destination,
      dates: dates ?? this.dates,
      style: style ?? this.style,
      travelers: travelers ?? this.travelers,
      days: days ?? this.days,
    );
  }
}
