export type SeatType = 'seater' | 'sleeper' | 'semi-sleeper';
export type SeatStatus = 'available' | 'selected' | 'booked' | 'female' | 'senior' | 'disabled';
export type BusType = 'AC Sleeper' | 'Non-AC Sleeper' | 'AC Seater' | 'AC Semi-Sleeper' | 'Volvo Multi-Axle AC Sleeper' | 'Bharat Benz AC' | string;

export interface Location {
  locationId: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  busStandName: string;
  popularBoardingPoints: string[];
}

export interface RouteStop {
  stopName: string;
  city: string;
  time: string;
  distanceKm: number;
  isBoarding: boolean;
  isDropping: boolean;
}

export interface Seat {
  seatNumber: string;
  row: number;
  col: number;
  deck: 'lower' | 'upper';
  type: SeatType;
  price: number;
  status: SeatStatus;
  genderReserved?: 'female' | 'male' | null;
}

export interface Bus {
  busId: string;
  operatorName: string;
  busNumber: string;
  busType: BusType;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice?: number;
  totalSeats: number;
  availableSeats: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  boardingPoints: { name: string; time: string; landmark: string }[];
  droppingPoints: { name: string; time: string; landmark: string }[];
  routeStops: RouteStop[];
  driverName?: string;
  driverPhone?: string;
  seats: Seat[];
  isActive: boolean;
}

export interface Passenger {
  seatNumber: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  busId: string;
  busNumber: string;
  operatorName: string;
  busType: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  boardingPoint: string;
  droppingPoint: string;
  seats: string[];
  passengers: Passenger[];
  baseAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  paymentStatus: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  qrData?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  savedLocations?: {
    name: string;
    address: string;
    city: string;
  }[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'payment' | 'reminder' | 'cancellation' | 'promo';
  bookingId?: string;
}

export interface SearchFilterParams {
  busType: string[];
  acType: 'all' | 'ac' | 'non-ac';
  seatCategory: 'all' | 'sleeper' | 'seater';
  timeSlot: string[]; // 'morning', 'afternoon', 'evening', 'night'
  priceRange: [number, number];
  minRating: number;
  operators: string[];
  sortBy: 'cheapest' | 'fastest' | 'earliest' | 'highest-rated';
}
