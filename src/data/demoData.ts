import { Location, Bus, Seat, User } from '../types';

export const DEMO_LOCATIONS: Location[] = [
  {
    locationId: 'LOC-CHN',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.067439,
    longitude: 80.237617,
    busStandName: 'Chennai CMBT (Koyambedu) / Kilambakkam KCBT',
    popularBoardingPoints: ['CMBT Koyambedu', 'Kilambakkam KCBT', 'Guindy Kathipara', 'Tambaram MEPZ', 'Ashok Pillar', 'Sriperumbudur']
  },
  {
    locationId: 'LOC-CBE',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    latitude: 11.016844,
    longitude: 76.955832,
    busStandName: 'Gandhipuram Central Bus Terminus / Omni Bus Stand',
    popularBoardingPoints: ['Gandhipuram Omni Bus Stand', 'KMCH Avinashi Road', 'Lakshmi Mills', 'Ukkadam', 'Hopes College', 'Singanallur']
  },
  {
    locationId: 'LOC-BLR',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.971599,
    longitude: 77.594563,
    busStandName: 'Kempegowda Bus Station (Majestic) / Shantinagar BMTC',
    popularBoardingPoints: ['Majestic Bus Stand', 'Madiwala St. Johns', 'Silk Board Junction', 'Electronic City Toll', 'Indiranagar', 'Bellandur']
  },
  {
    locationId: 'LOC-SLM',
    city: 'Salem',
    state: 'Tamil Nadu',
    latitude: 11.664325,
    longitude: 78.146011,
    busStandName: 'Salem New Bus Stand (MGR Terminus)',
    popularBoardingPoints: ['Salem New Bus Stand', 'AVR Circle', 'Kondalampatti Bypass', 'Seelanaickenpatti']
  },
  {
    locationId: 'LOC-MDU',
    city: 'Madurai',
    state: 'Tamil Nadu',
    latitude: 9.925201,
    longitude: 78.119775,
    busStandName: 'Mattuthavani Integrated Bus Terminus (MIBT)',
    popularBoardingPoints: ['Mattuthavani Bus Stand', 'Periyar Bus Stand', 'Arapalayam', 'Fathima College', 'Kappalur Toll']
  },
  {
    locationId: 'LOC-TRZ',
    city: 'Trichy',
    state: 'Tamil Nadu',
    latitude: 10.790483,
    longitude: 78.704673,
    busStandName: 'Trichy Central Bus Stand',
    popularBoardingPoints: ['Central Bus Stand', 'Chatram Bus Stand', 'TVS Tollgate', 'Palpannai Roundabout', 'Mannarpuram']
  },
  {
    locationId: 'LOC-HYD',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.385044,
    longitude: 78.486671,
    busStandName: 'Mahatma Gandhi Bus Station (MGBS) / Jubilee Bus Station',
    popularBoardingPoints: ['MGBS Imlibun', 'Ameerpet', 'Miyapur Metro', 'Gachibowli Outer Ring', 'Lakdikapul', 'Kukatpally']
  }
];

// Helper to generate a realistic 40-seat coach (2x2 layout, 10 rows)
function generateSeats(basePrice: number, busType: string): Seat[] {
  const seats: Seat[] = [];
  const rows = 10;
  const isSleeper = busType.toLowerCase().includes('sleeper');

  for (let r = 1; r <= rows; r++) {
    // Column A1, A2 (Left window, Left aisle)
    // Column B1, B2 (Right aisle, Right window)
    const colLabels = ['A1', 'A2', 'B1', 'B2'];
    colLabels.forEach((label, cIdx) => {
      const seatNum = `${label[0]}${r}${label[1] === '2' ? 'B' : 'A'}`;
      
      // Preset status for realism
      let status: Seat['status'] = 'available';
      let gender: Seat['genderReserved'] = null;

      if ((r === 1 && cIdx === 0) || (r === 3 && cIdx === 1) || (r === 5 && cIdx === 2) || (r === 7 && cIdx === 3)) {
        status = 'booked';
      } else if (r === 2 && (cIdx === 0 || cIdx === 1)) {
        status = 'female';
        gender = 'female';
      } else if (r === 8 && cIdx === 0) {
        status = 'senior';
      }

      const seatPrice = isSleeper ? basePrice + (cIdx === 0 || cIdx === 3 ? 100 : 50) : basePrice;

      seats.push({
        seatNumber: `${label[0]}${r}`,
        row: r,
        col: cIdx + 1,
        deck: 'lower',
        type: isSleeper ? 'sleeper' : 'seater',
        price: seatPrice,
        status,
        genderReserved: gender
      });
    });
  }
  return seats;
}

export const INITIAL_BUSES: Bus[] = [
  {
    busId: 'BUS001',
    operatorName: 'ABC Travels',
    busNumber: 'TN-38-AB-1234',
    busType: 'AC Sleeper',
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '22:00',
    arrivalTime: '05:30',
    duration: '7h 30m',
    price: 750,
    originalPrice: 950,
    totalSeats: 40,
    availableSeats: 26,
    rating: 4.8,
    reviewCount: 342,
    amenities: ['Charging Point', 'Blankets', 'Pillow', 'Water Bottle', 'WiFi', 'Reading Light', 'Emergency Exit', 'GPS Live Tracking'],
    boardingPoints: [
      { name: 'Chennai CMBT Koyambedu', time: '22:00', landmark: 'Platform 7, Near Clock Tower' },
      { name: 'Guindy Kathipara', time: '22:30', landmark: 'Under Flyover Bus Stop' },
      { name: 'Tambaram MEPZ', time: '23:00', landmark: 'Opposite Railway Overbridge' }
    ],
    droppingPoints: [
      { name: 'KMCH Avinashi Road', time: '05:00', landmark: 'Near Hospital Main Gate' },
      { name: 'Hopes College', time: '05:15', landmark: 'Bus Shelter' },
      { name: 'Gandhipuram Omni Bus Stand', time: '05:30', landmark: 'Bay 3' }
    ],
    routeStops: [
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '22:00', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Tambaram', city: 'Chennai', time: '23:00', distanceKm: 28, isBoarding: true, isDropping: false },
      { stopName: 'Villupuram Toll', city: 'Villupuram', time: '01:15', distanceKm: 160, isBoarding: false, isDropping: false },
      { stopName: 'Salem Bypass (AVR Roundabout)', city: 'Salem', time: '03:45', distanceKm: 345, isBoarding: false, isDropping: true },
      { stopName: 'Avinashi Bypass', city: 'Avinashi', time: '04:50', distanceKm: 460, isBoarding: false, isDropping: true },
      { stopName: 'Gandhipuram Omni Stand', city: 'Coimbatore', time: '05:30', distanceKm: 505, isBoarding: false, isDropping: true }
    ],
    driverName: 'Murugan S.',
    driverPhone: '+91 98421 54321',
    seats: generateSeats(750, 'AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS002',
    operatorName: 'SRM Transports',
    busNumber: 'TN-01-SR-8899',
    busType: 'Volvo Multi-Axle AC Sleeper',
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '21:15',
    arrivalTime: '04:45',
    duration: '7h 30m',
    price: 920,
    originalPrice: 1100,
    totalSeats: 40,
    availableSeats: 18,
    rating: 4.9,
    reviewCount: 512,
    amenities: ['Individual TV Screen', 'Air Suspension', 'WiFi', 'Blankets', 'Snacks', 'Water Bottle', 'Charging Point', 'GPS Live Tracking'],
    boardingPoints: [
      { name: 'Chennai CMBT Koyambedu', time: '21:15', landmark: 'Near Entrance Gate 1' },
      { name: 'Ashok Pillar', time: '21:40', landmark: 'Police Station Bus Shelter' },
      { name: 'Kilambakkam KCBT', time: '22:30', landmark: 'Long Distance Bay 12' }
    ],
    droppingPoints: [
      { name: 'Lakshmi Mills', time: '04:30', landmark: 'Junction Bus Stand' },
      { name: 'Gandhipuram Omni Bus Stand', time: '04:45', landmark: 'SRM Office' }
    ],
    routeStops: [
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '21:15', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Kilambakkam KCBT', city: 'Chennai', time: '22:30', distanceKm: 35, isBoarding: true, isDropping: false },
      { stopName: 'Ulundurpet Toll', city: 'Ulundurpet', time: '00:50', distanceKm: 195, isBoarding: false, isDropping: false },
      { stopName: 'Salem MGR Terminus', city: 'Salem', time: '03:10', distanceKm: 345, isBoarding: false, isDropping: true },
      { stopName: 'Gandhipuram Terminus', city: 'Coimbatore', time: '04:45', distanceKm: 505, isBoarding: false, isDropping: true }
    ],
    driverName: 'Dhandapani K.',
    driverPhone: '+91 94432 87654',
    seats: generateSeats(920, 'Volvo Multi-Axle AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS003',
    operatorName: 'Greenline Express',
    busNumber: 'TN-37-GL-5566',
    busType: 'AC Seater',
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    price: 550,
    originalPrice: 650,
    totalSeats: 40,
    availableSeats: 31,
    rating: 4.4,
    reviewCount: 198,
    amenities: ['Reclining Seats', 'Charging Point', 'Water Bottle', 'Music System', 'Emergency Hammer'],
    boardingPoints: [
      { name: 'Chennai CMBT Koyambedu', time: '06:00', landmark: 'Bus Bay 14' },
      { name: 'Guindy Kathipara', time: '06:25', landmark: 'Near Metro Pillar 84' }
    ],
    droppingPoints: [
      { name: 'Singanallur Bus Stand', time: '13:40', landmark: 'Main Gate' },
      { name: 'Gandhipuram Omni Bus Stand', time: '14:00', landmark: 'Greenline Counter' }
    ],
    routeStops: [
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '06:00', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Vellore Bypass', city: 'Vellore', time: '08:30', distanceKm: 140, isBoarding: false, isDropping: false },
      { stopName: 'Dharmapuri Highway', city: 'Dharmapuri', time: '11:00', distanceKm: 290, isBoarding: false, isDropping: false },
      { stopName: 'Salem New Bus Stand', city: 'Salem', time: '12:00', distanceKm: 345, isBoarding: false, isDropping: true },
      { stopName: 'Gandhipuram Omni', city: 'Coimbatore', time: '14:00', distanceKm: 505, isBoarding: false, isDropping: true }
    ],
    driverName: 'Senthil Nathan',
    driverPhone: '+91 97890 12345',
    seats: generateSeats(550, 'AC Seater'),
    isActive: true
  },
  {
    busId: 'BUS004',
    operatorName: 'IntrCity SmartBus',
    busNumber: 'KA-01-IC-3030',
    busType: 'Bharat Benz AC',
    source: 'Bengaluru',
    destination: 'Chennai',
    departureTime: '23:00',
    arrivalTime: '05:15',
    duration: '6h 15m',
    price: 680,
    originalPrice: 850,
    totalSeats: 40,
    availableSeats: 22,
    rating: 4.7,
    reviewCount: 420,
    amenities: ['SmartBus Lounge Access', 'WiFi', 'CCTV', 'Blanket', 'Water Bottle', 'Charging Point', 'Sanitized Washroom Onboard'],
    boardingPoints: [
      { name: 'Majestic Bus Stand', time: '23:00', landmark: 'Near Terminal 3' },
      { name: 'Madiwala St. Johns', time: '23:30', landmark: 'Water Tank Bus Stop' },
      { name: 'Electronic City Toll', time: '23:55', landmark: 'Elevated Highway Toll Gate' }
    ],
    droppingPoints: [
      { name: 'Sriperumbudur Toll', time: '04:30', landmark: 'Highway Plaza' },
      { name: 'Poonamallee Bypass', time: '04:55', landmark: 'Signal Junction' },
      { name: 'Chennai CMBT Koyambedu', time: '05:15', landmark: 'SmartBus Hub' }
    ],
    routeStops: [
      { stopName: 'Majestic', city: 'Bengaluru', time: '23:00', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Hosur Bus Stand', city: 'Hosur', time: '00:30', distanceKm: 42, isBoarding: false, isDropping: false },
      { stopName: 'Krishnagiri Toll', city: 'Krishnagiri', time: '01:30', distanceKm: 95, isBoarding: false, isDropping: false },
      { stopName: 'Vellore Bypass', city: 'Vellore', time: '03:15', distanceKm: 215, isBoarding: false, isDropping: true },
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '05:15', distanceKm: 345, isBoarding: false, isDropping: true }
    ],
    driverName: 'Ramesh Gowda',
    driverPhone: '+91 99001 88224',
    seats: generateSeats(680, 'Bharat Benz AC'),
    isActive: true
  },
  {
    busId: 'BUS005',
    operatorName: 'KPN Travels',
    busNumber: 'TN-30-KP-4422',
    busType: 'AC Sleeper',
    source: 'Chennai',
    destination: 'Madurai',
    departureTime: '21:30',
    arrivalTime: '05:00',
    duration: '7h 30m',
    price: 720,
    originalPrice: 890,
    totalSeats: 40,
    availableSeats: 19,
    rating: 4.6,
    reviewCount: 280,
    amenities: ['AC', 'Charging Port', 'Reading Light', 'Blanket', 'Water Bottle', 'Emergency Exit'],
    boardingPoints: [
      { name: 'Chennai CMBT Koyambedu', time: '21:30', landmark: 'KPN Office Bay 1' },
      { name: 'Tambaram MEPZ', time: '22:15', landmark: 'Main Gate' }
    ],
    droppingPoints: [
      { name: 'Mattuthavani Bus Stand', time: '04:45', landmark: 'KPN Booking Counter' },
      { name: 'Periyar Bus Stand', time: '05:00', landmark: 'Opposite Railway Station' }
    ],
    routeStops: [
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '21:30', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Villupuram', city: 'Villupuram', time: '00:30', distanceKm: 160, isBoarding: false, isDropping: false },
      { stopName: 'Trichy Tollgate', city: 'Trichy', time: '02:45', distanceKm: 325, isBoarding: false, isDropping: true },
      { stopName: 'Mattuthavani MIBT', city: 'Madurai', time: '05:00', distanceKm: 460, isBoarding: false, isDropping: true }
    ],
    driverName: 'Karuppasamy P.',
    driverPhone: '+91 94441 22334',
    seats: generateSeats(720, 'AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS006',
    operatorName: 'Zingbus Plus',
    busNumber: 'KA-05-ZB-7711',
    busType: 'Volvo Multi-Axle AC Sleeper',
    source: 'Hyderabad',
    destination: 'Bengaluru',
    departureTime: '22:30',
    arrivalTime: '06:15',
    duration: '7h 45m',
    price: 899,
    originalPrice: 1199,
    totalSeats: 40,
    availableSeats: 15,
    rating: 4.8,
    reviewCount: 388,
    amenities: ['Air Purifier', 'Hot Beverage', 'Water Bottle', 'Charging Point', 'WiFi', 'Emergency Alarm', 'Luggage Tag'],
    boardingPoints: [
      { name: 'Miyapur Metro', time: '22:30', landmark: 'Pillar 142' },
      { name: 'Ameerpet', time: '23:00', landmark: 'Metro Station Gate 3' },
      { name: 'MGBS Imlibun', time: '23:30', landmark: 'Zingbus Lounge' }
    ],
    droppingPoints: [
      { name: 'Hebbal Flyover', time: '05:30', landmark: 'Esteem Mall' },
      { name: 'Madiwala St. Johns', time: '06:00', landmark: 'Zingbus Hub' },
      { name: 'Silk Board Junction', time: '06:15', landmark: 'Under Flyover' }
    ],
    routeStops: [
      { stopName: 'Miyapur', city: 'Hyderabad', time: '22:30', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Jadcherla Toll', city: 'Jadcherla', time: '01:00', distanceKm: 90, isBoarding: false, isDropping: false },
      { stopName: 'Kurnool Bypass', city: 'Kurnool', time: '02:30', distanceKm: 215, isBoarding: false, isDropping: false },
      { stopName: 'Anantapur Toll', city: 'Anantapur', time: '04:15', distanceKm: 360, isBoarding: false, isDropping: false },
      { stopName: 'Silk Board', city: 'Bengaluru', time: '06:15', distanceKm: 570, isBoarding: false, isDropping: true }
    ],
    driverName: 'Venkatesh Rao',
    driverPhone: '+91 98860 33441',
    seats: generateSeats(899, 'Volvo Multi-Axle AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS007',
    operatorName: 'City Express',
    busNumber: 'TN-45-CE-1980',
    busType: 'Non-AC Sleeper',
    source: 'Chennai',
    destination: 'Trichy',
    departureTime: '23:15',
    arrivalTime: '05:00',
    duration: '5h 45m',
    price: 480,
    originalPrice: 580,
    totalSeats: 40,
    availableSeats: 27,
    rating: 4.3,
    reviewCount: 145,
    amenities: ['Charging Point', 'Fan', 'Reading Light', 'First Aid Kit'],
    boardingPoints: [
      { name: 'Chennai CMBT Koyambedu', time: '23:15', landmark: 'Platform 11' },
      { name: 'Tambaram MEPZ', time: '23:50', landmark: 'Near Bus Shelter' }
    ],
    droppingPoints: [
      { name: 'TVS Tollgate', time: '04:45', landmark: 'Overbridge' },
      { name: 'Central Bus Stand', time: '05:00', landmark: 'Bay 5' }
    ],
    routeStops: [
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '23:15', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Tindivanam Bypass', city: 'Tindivanam', time: '01:00', distanceKm: 120, isBoarding: false, isDropping: false },
      { stopName: 'Trichy Central', city: 'Trichy', time: '05:00', distanceKm: 325, isBoarding: false, isDropping: true }
    ],
    driverName: 'Palanisamy T.',
    driverPhone: '+91 94421 98765',
    seats: generateSeats(480, 'Non-AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS008',
    operatorName: 'Royal Travels Luxury',
    busNumber: 'TN-38-RT-9000',
    busType: 'Volvo Multi-Axle AC Sleeper',
    source: 'Coimbatore',
    destination: 'Bengaluru',
    departureTime: '22:45',
    arrivalTime: '05:30',
    duration: '6h 45m',
    price: 840,
    originalPrice: 1050,
    totalSeats: 40,
    availableSeats: 20,
    rating: 4.9,
    reviewCount: 460,
    amenities: ['WiFi', 'Individual Screen', 'Blanket', 'Water Bottle', 'Sanitizer', 'Charging Point', 'GPS Live Tracking'],
    boardingPoints: [
      { name: 'Gandhipuram Omni Bus Stand', time: '22:45', landmark: 'Royal Travels Office' },
      { name: 'KMCH Avinashi Road', time: '23:10', landmark: 'Near Flyover' }
    ],
    droppingPoints: [
      { name: 'Electronic City Toll', time: '04:45', landmark: 'Below Flyover' },
      { name: 'Silk Board Junction', time: '05:10', landmark: 'Bus Stop' },
      { name: 'Madiwala St. Johns', time: '05:30', landmark: 'Opposite Hospital Gate' }
    ],
    routeStops: [
      { stopName: 'Gandhipuram', city: 'Coimbatore', time: '22:45', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Tiruppur Bypass', city: 'Tiruppur', time: '23:40', distanceKm: 55, isBoarding: false, isDropping: false },
      { stopName: 'Salem AVR Circle', city: 'Salem', time: '01:30', distanceKm: 165, isBoarding: false, isDropping: false },
      { stopName: 'Hosur Bus Stand', city: 'Hosur', time: '04:15', distanceKm: 315, isBoarding: false, isDropping: true },
      { stopName: 'Madiwala', city: 'Bengaluru', time: '05:30', distanceKm: 365, isBoarding: false, isDropping: true }
    ],
    driverName: 'Chandran B.',
    driverPhone: '+91 97881 44556',
    seats: generateSeats(840, 'Volvo Multi-Axle AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS009',
    operatorName: 'Orange Tours & Travels',
    busNumber: 'TS-09-OT-6677',
    busType: 'AC Sleeper',
    source: 'Hyderabad',
    destination: 'Chennai',
    departureTime: '20:30',
    arrivalTime: '07:15',
    duration: '10h 45m',
    price: 1150,
    originalPrice: 1350,
    totalSeats: 40,
    availableSeats: 16,
    rating: 4.7,
    reviewCount: 310,
    amenities: ['Individual USB Chargers', 'Air Conditioning', 'Clean Bedding', 'Water Bottle', 'Emergency Exit'],
    boardingPoints: [
      { name: 'Ameerpet', time: '20:30', landmark: 'Orange Office' },
      { name: 'Lakdikapul', time: '21:00', landmark: 'Beside Petrol Pump' },
      { name: 'MGBS Imlibun', time: '21:30', landmark: 'Bay 8' }
    ],
    droppingPoints: [
      { name: 'Koyambedu CMBT', time: '06:45', landmark: 'Omni Terminal' },
      { name: 'Guindy Kathipara', time: '07:15', landmark: 'Bus Station' }
    ],
    routeStops: [
      { stopName: 'Hyderabad MGBS', city: 'Hyderabad', time: '21:30', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Miryalaguda Bypass', city: 'Miryalaguda', time: '00:15', distanceKm: 145, isBoarding: false, isDropping: false },
      { stopName: 'Ongole Highway', city: 'Ongole', time: '03:30', distanceKm: 340, isBoarding: false, isDropping: false },
      { stopName: 'Nellore Mini Bypass', city: 'Nellore', time: '05:15', distanceKm: 465, isBoarding: false, isDropping: true },
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '07:15', distanceKm: 630, isBoarding: false, isDropping: true }
    ],
    driverName: 'Srinivasa Reddy',
    driverPhone: '+91 99490 11223',
    seats: generateSeats(1150, 'AC Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS010',
    operatorName: 'SRS Travels',
    busNumber: 'KA-01-SR-1122',
    busType: 'AC Semi-Sleeper',
    source: 'Bengaluru',
    destination: 'Salem',
    departureTime: '18:30',
    arrivalTime: '22:45',
    duration: '4h 15m',
    price: 490,
    originalPrice: 600,
    totalSeats: 40,
    availableSeats: 29,
    rating: 4.5,
    reviewCount: 220,
    amenities: ['Reclining Seat', 'Charging Point', 'Music', 'Air Conditioned', 'Water Bottle'],
    boardingPoints: [
      { name: 'Madiwala St. Johns', time: '18:30', landmark: 'Opposite Police Station' },
      { name: 'Silk Board Junction', time: '18:50', landmark: 'Near Tea Stall' }
    ],
    droppingPoints: [
      { name: 'Salem New Bus Stand', time: '22:45', landmark: 'SRS Counter' }
    ],
    routeStops: [
      { stopName: 'Madiwala', city: 'Bengaluru', time: '18:30', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Hosur Toll', city: 'Hosur', time: '19:30', distanceKm: 42, isBoarding: false, isDropping: false },
      { stopName: 'Dharmapuri Bypass', city: 'Dharmapuri', time: '21:15', distanceKm: 135, isBoarding: false, isDropping: false },
      { stopName: 'Salem New Bus Stand', city: 'Salem', time: '22:45', distanceKm: 205, isBoarding: false, isDropping: true }
    ],
    driverName: 'Manjunath Swamy',
    driverPhone: '+91 98450 77889',
    seats: generateSeats(490, 'AC Semi-Sleeper'),
    isActive: true
  },
  {
    busId: 'BUS011',
    operatorName: 'City Rider Travels',
    busNumber: 'TN-38-CR-4040',
    busType: 'AC Sleeper',
    source: 'Coimbatore',
    destination: 'Chennai',
    departureTime: '22:30',
    arrivalTime: '06:00',
    duration: '7h 30m',
    price: 780,
    originalPrice: 990,
    totalSeats: 40,
    availableSeats: 23,
    rating: 4.7,
    reviewCount: 289,
    amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'GPS Live Tracking'],
    boardingPoints: [
      { name: 'Gandhipuram Omni Bus Stand', time: '22:30', landmark: 'Omni Terminal Gate 2' },
      { name: 'KMCH Avinashi Road', time: '23:00', landmark: 'Opposite Main Entrance' }
    ],
    droppingPoints: [
      { name: 'Tambaram MEPZ', time: '05:15', landmark: 'Flyover Bus Shelter' },
      { name: 'Chennai CMBT Koyambedu', time: '06:00', landmark: 'Terminal 5' }
    ],
    routeStops: [
      { stopName: 'Gandhipuram', city: 'Coimbatore', time: '22:30', distanceKm: 0, isBoarding: true, isDropping: false },
      { stopName: 'Salem Bypass', city: 'Salem', time: '01:15', distanceKm: 165, isBoarding: false, isDropping: false },
      { stopName: 'Tambaram', city: 'Chennai', time: '05:15', distanceKm: 475, isBoarding: false, isDropping: true },
      { stopName: 'Chennai CMBT', city: 'Chennai', time: '06:00', distanceKm: 505, isBoarding: false, isDropping: true }
    ],
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98422 99881',
    seats: generateSeats(780, 'AC Sleeper'),
    isActive: true
  }
];

export const DEMO_USERS: User[] = [
  {
    uid: 'USR-RAHUL-001',
    email: 'rahul.kumar@example.com',
    displayName: 'Rahul Kumar',
    phoneNumber: '+91 98765 43210',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    savedLocations: [
      { name: 'Home', address: '12th Main Road, Anna Nagar', city: 'Chennai' },
      { name: 'Office', address: 'Tech Park, Gandhipuram', city: 'Coimbatore' }
    ]
  },
  {
    uid: 'USR-ADMIN-001',
    email: 'admin@busgo.travel',
    displayName: 'BusGo Fleet Admin',
    phoneNumber: '+91 99999 88888',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    savedLocations: [
      { name: 'Headquarters', address: 'CMBT Commercial Complex', city: 'Chennai' }
    ]
  }
];

export const POPULAR_ROUTES = [
  { from: 'Chennai', to: 'Coimbatore', buses: 4, startingPrice: 550, time: '7h 30m', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80' },
  { from: 'Bengaluru', to: 'Chennai', buses: 3, startingPrice: 680, time: '6h 15m', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80' },
  { from: 'Chennai', to: 'Madurai', buses: 2, startingPrice: 720, time: '7h 30m', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=600&auto=format&fit=crop&q=80' },
  { from: 'Hyderabad', to: 'Bengaluru', buses: 2, startingPrice: 899, time: '7h 45m', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&auto=format&fit=crop&q=80' },
  { from: 'Coimbatore', to: 'Bengaluru', buses: 3, startingPrice: 840, time: '6h 45m', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80' },
  { from: 'Chennai', to: 'Trichy', buses: 2, startingPrice: 480, time: '5h 45m', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80' }
];

export const PROMO_OFFERS = [
  {
    code: 'BUSGOFIRST',
    discount: 150,
    minAmount: 500,
    title: 'Flat ₹150 OFF on First Booking',
    description: 'Valid for new users on all AC & Sleeper buses.',
    badge: 'NEW USER'
  },
  {
    code: 'FESTIVE200',
    discount: 200,
    minAmount: 800,
    title: 'Festival Express: ₹200 Savings',
    description: 'Applicable on multi-passenger bookings.',
    badge: 'FESTIVAL SPECIAL'
  },
  {
    code: 'SMART50',
    discount: 50,
    minAmount: 400,
    title: 'Instant ₹50 Instant Cashback',
    description: 'Instant discount with UPI or Net Banking.',
    badge: 'ALL USERS'
  }
];
