import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bus, Location, Booking, User, InAppNotification, Passenger, SeatStatus } from '../types';
import { DEMO_LOCATIONS, INITIAL_BUSES, DEMO_USERS, PROMO_OFFERS } from '../data/demoData';

interface SearchState {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth & Profile
  currentUser: User | null;
  login: (email: string, role?: 'user' | 'admin') => boolean;
  googleSignIn: () => void;
  signUp: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchToRole: (role: 'user' | 'admin') => void;

  // Search & Navigation
  searchParams: SearchState;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchState>>;
  recentSearches: { from: string; to: string; date: string }[];
  activeTab: 'home' | 'search' | 'details' | 'my-tickets' | 'track' | 'admin';
  setActiveTab: (tab: 'home' | 'search' | 'details' | 'my-tickets' | 'track' | 'admin') => void;

  // Fleet & Locations
  locations: Location[];
  buses: Bus[];
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus | null) => void;

  // Booking Flow
  selectedSeats: string[];
  toggleSeat: (seatNumber: string) => void;
  clearSelectedSeats: () => void;
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  appliedCoupon: { code: string; discount: number } | null;
  applyCouponCode: (code: string, currentTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedBoardingPoint: string;
  setSelectedBoardingPoint: (point: string) => void;
  selectedDroppingPoint: string;
  setSelectedDroppingPoint: (point: string) => void;

  // Checkout & Bookings
  createBooking: (paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking') => Promise<Booking>;
  bookings: Booking[];
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
  cancelBooking: (bookingId: string) => void;

  // Tracking
  trackingBusId: string | null;
  setTrackingBusId: (busId: string | null) => void;

  // Notifications
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;

  // Admin Fleet Controls
  adminAddBus: (newBus: Omit<Bus, 'busId'>) => void;
  adminUpdateBus: (busId: string, updates: Partial<Bus>) => void;
  adminDeleteBus: (busId: string) => void;
  adminToggleSeat: (busId: string, seatNumber: string, status: SeatStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'busgo_theme',
  USER: 'busgo_user',
  BOOKINGS: 'busgo_bookings',
  BUSES: 'busgo_buses',
  NOTIFICATIONS: 'busgo_notifications',
  RECENTS: 'busgo_recents'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default passenger demo user for instant interactive testing
    return DEMO_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Create new demo user on login
    const newUser: User = {
      uid: `USR-${Date.now().toString(36).toUpperCase()}`,
      email,
      displayName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role,
      savedLocations: [
        { name: 'Home', address: 'Residential Hub', city: 'Chennai' }
      ]
    };
    setCurrentUser(newUser);
    return true;
  };

  const googleSignIn = () => {
    const googleUser: User = {
      uid: `USR-GGL-${Date.now()}`,
      email: 'alex.passenger@gmail.com',
      displayName: 'Alex Johnson',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phoneNumber: '+91 98400 12345',
      role: 'user',
      savedLocations: [
        { name: 'Home', address: 'OMR IT Corridor', city: 'Chennai' },
        { name: 'University', address: 'Peelamedu Campus', city: 'Coimbatore' }
      ]
    };
    setCurrentUser(googleUser);
    addNotification({
      title: 'Welcome to BusGo!',
      message: `Signed in as ${googleUser.displayName}. Ready to book smarter travels!`,
      type: 'promo'
    });
  };

  const signUp = (name: string, email: string, phone: string) => {
    const newUser: User = {
      uid: `USR-${Date.now()}`,
      displayName: name,
      email,
      phoneNumber: phone,
      role: 'user',
      savedLocations: []
    };
    setCurrentUser(newUser);
    addNotification({
      title: 'Account Created',
      message: 'Welcome to BusGo! Enjoy ₹150 discount with code BUSGOFIRST.',
      type: 'promo'
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const switchToRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(DEMO_USERS[1]);
    } else {
      setCurrentUser(DEMO_USERS[0]);
    }
  };

  // 3. Navigation & Search State
  // Tomorrow's date formatted as YYYY-MM-DD
  const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState<SearchState>({
    from: 'Chennai',
    to: 'Coimbatore',
    date: defaultDate,
    passengers: 1
  });

  const [recentSearches, setRecentSearches] = useState<{ from: string; to: string; date: string }[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { from: 'Chennai', to: 'Coimbatore', date: defaultDate },
      { from: 'Bengaluru', to: 'Chennai', date: defaultDate },
      { from: 'Hyderabad', to: 'Bengaluru', date: defaultDate }
    ];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'details' | 'my-tickets' | 'track' | 'admin'>('home');

  // 4. Data State (Locations, Buses)
  const [locations] = useState<Location[]>(DEMO_LOCATIONS);
  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BUSES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
  }, [buses]);

  // Active bus & seats
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');

  // 5. Bookings History
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default demo booking so "My Tickets" has real, rich data on launch!
    const sampleBooking: Booking = {
      bookingId: 'BUSGO-2026-8F42K',
      userId: 'USR-RAHUL-001',
      busId: 'BUS001',
      busNumber: 'TN-38-AB-1234',
      operatorName: 'ABC Travels',
      busType: 'AC Sleeper',
      source: 'Chennai',
      destination: 'Coimbatore',
      journeyDate: defaultDate,
      departureTime: '22:00',
      arrivalTime: '05:30',
      boardingPoint: 'Chennai CMBT Koyambedu (Platform 7)',
      droppingPoint: 'Gandhipuram Omni Bus Stand (Bay 3)',
      seats: ['A3', 'A4'],
      passengers: [
        { seatNumber: 'A3', fullName: 'Rahul Kumar', age: 26, gender: 'male', phoneNumber: '+91 98765 43210', email: 'rahul.kumar@example.com' },
        { seatNumber: 'A4', fullName: 'Priya Sharma', age: 24, gender: 'female', phoneNumber: '+91 98765 43210', email: 'priya.sharma@example.com' }
      ],
      baseAmount: 1500,
      discountAmount: 150,
      totalAmount: 1350,
      paymentMethod: 'UPI',
      paymentStatus: 'SUCCESS',
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      qrData: 'BUSGO-2026-8F42K|Chennai-Coimbatore|A3,A4|₹1350'
    };
    return [sampleBooking];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // 6. Bus Tracking State
  const [trackingBusId, setTrackingBusId] = useState<string | null>('BUS001');

  // 7. Notifications State
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'NOTIF-01',
        title: 'Booking Confirmed!',
        message: 'Your ticket BUSGO-2026-8F42K for Chennai → Coimbatore has been confirmed.',
        timestamp: '10 mins ago',
        read: false,
        type: 'booking',
        bookingId: 'BUSGO-2026-8F42K'
      },
      {
        id: 'NOTIF-02',
        title: 'Special Offer Available',
        message: 'Get flat ₹150 OFF with promo code BUSGOFIRST on all AC Sleeper coaches.',
        timestamp: '1 hour ago',
        read: false,
        type: 'promo'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: InAppNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Seat toggle logic
  const toggleSeat = (seatNumber: string) => {
    if (!selectedBus) return;

    // Check if seat is already booked or disabled
    const targetSeat = selectedBus.seats.find(s => s.seatNumber === seatNumber);
    if (!targetSeat || targetSeat.status === 'booked' || targetSeat.status === 'disabled') {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  // Coupon Logic
  const applyCouponCode = (code: string, currentTotal: number) => {
    const coupon = PROMO_OFFERS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (currentTotal < coupon.minAmount) {
      return { success: false, message: `Coupon requires minimum booking of ₹${coupon.minAmount}.` };
    }
    setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
    return { success: true, message: `Awesome! Coupon applied. You saved ₹${coupon.discount}.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Create Booking
  const createBooking = async (paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'): Promise<Booking> => {
    if (!selectedBus) throw new Error('No bus selected');

    // Generate random readable booking ID like BUSGO-2026-8F42K
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingId = `BUSGO-2026-${randomHex}`;

    const baseAmount = selectedSeats.reduce((acc, seatNum) => {
      const s = selectedBus.seats.find(st => st.seatNumber === seatNum);
      return acc + (s ? s.price : selectedBus.price);
    }, 0);

    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const totalAmount = Math.max(0, baseAmount - discountAmount);

    const newBooking: Booking = {
      bookingId,
      userId: currentUser ? currentUser.uid : 'GUEST-USER',
      busId: selectedBus.busId,
      busNumber: selectedBus.busNumber,
      operatorName: selectedBus.operatorName,
      busType: selectedBus.busType,
      source: selectedBus.source,
      destination: selectedBus.destination,
      journeyDate: searchParams.date,
      departureTime: selectedBus.departureTime,
      arrivalTime: selectedBus.arrivalTime,
      boardingPoint: selectedBoardingPoint || selectedBus.boardingPoints[0]?.name || 'Main Terminus',
      droppingPoint: selectedDroppingPoint || selectedBus.droppingPoints[0]?.name || 'City Center',
      seats: [...selectedSeats],
      passengers: [...passengers],
      baseAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: 'SUCCESS',
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      qrData: `${bookingId}|${selectedBus.source}-${selectedBus.destination}|${selectedSeats.join(',')}|₹${totalAmount}`
    };

    // Update the bus seat status to 'booked' in the fleet state!
    setBuses(prevBuses => {
      return prevBuses.map(b => {
        if (b.busId === selectedBus.busId) {
          const updatedSeats = b.seats.map(s => {
            if (selectedSeats.includes(s.seatNumber)) {
              return { ...s, status: 'booked' as SeatStatus };
            }
            return s;
          });
          return {
            ...b,
            availableSeats: Math.max(0, b.availableSeats - selectedSeats.length),
            seats: updatedSeats
          };
        }
        return b;
      });
    });

    // Save to bookings
    setBookings(prev => [newBooking, ...prev]);
    setCurrentBooking(newBooking);

    // Add recent search
    setRecentSearches(prev => {
      const filtered = prev.filter(r => !(r.from === selectedBus.source && r.to === selectedBus.destination));
      return [{ from: selectedBus.source, to: selectedBus.destination, date: searchParams.date }, ...filtered].slice(0, 5);
    });

    // Add confirmation notification
    addNotification({
      title: 'Booking Confirmed!',
      message: `Reservation ${bookingId} for ${selectedBus.source} → ${selectedBus.destination} is confirmed. View your digital ticket!`,
      type: 'booking',
      bookingId
    });

    addNotification({
      title: 'Payment Successful',
      message: `Received payment of ₹${totalAmount} via ${paymentMethod}.`,
      type: 'payment',
      bookingId
    });

    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    // Refund logic & status update
    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) {
        return {
          ...b,
          bookingStatus: 'CANCELLED',
          paymentStatus: 'REFUNDED'
        };
      }
      return b;
    }));

    // Release seats back to available in the bus!
    setBuses(prevBuses => {
      return prevBuses.map(b => {
        if (b.busId === booking.busId) {
          const updatedSeats = b.seats.map(s => {
            if (booking.seats.includes(s.seatNumber)) {
              return { ...s, status: 'available' as SeatStatus };
            }
            return s;
          });
          return {
            ...b,
            availableSeats: b.availableSeats + booking.seats.length,
            seats: updatedSeats
          };
        }
        return b;
      });
    });

    addNotification({
      title: 'Booking Cancelled',
      message: `Booking ${bookingId} cancelled. Refund of ₹${Math.round(booking.totalAmount * 0.9)} initiated to your source account.`,
      type: 'cancellation',
      bookingId
    });
  };

  // Admin Fleet Controls
  const adminAddBus = (newBusData: Omit<Bus, 'busId'>) => {
    const newBusId = `BUS${(buses.length + 1).toString().padStart(3, '0')}`;
    const newBus: Bus = {
      ...newBusData,
      busId: newBusId,
      isActive: true
    };
    setBuses(prev => [newBus, ...prev]);
    addNotification({
      title: 'Fleet Updated',
      message: `New bus ${newBus.operatorName} (${newBus.busNumber}) added to ${newBus.source} - ${newBus.destination} route.`,
      type: 'promo'
    });
  };

  const adminUpdateBus = (busId: string, updates: Partial<Bus>) => {
    setBuses(prev => prev.map(b => b.busId === busId ? { ...b, ...updates } : b));
  };

  const adminDeleteBus = (busId: string) => {
    setBuses(prev => prev.filter(b => b.busId !== busId));
  };

  const adminToggleSeat = (busId: string, seatNumber: string, status: SeatStatus) => {
    setBuses(prev => prev.map(b => {
      if (b.busId === busId) {
        const updatedSeats = b.seats.map(s => s.seatNumber === seatNumber ? { ...s, status } : s);
        const avail = updatedSeats.filter(s => s.status === 'available').length;
        return { ...b, seats: updatedSeats, availableSeats: avail };
      }
      return b;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        login,
        googleSignIn,
        signUp,
        logout,
        updateProfile,
        switchToRole,
        searchParams,
        setSearchParams,
        recentSearches,
        activeTab,
        setActiveTab,
        locations,
        buses,
        selectedBus,
        setSelectedBus,
        selectedSeats,
        toggleSeat,
        clearSelectedSeats,
        passengers,
        setPassengers,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        selectedBoardingPoint,
        setSelectedBoardingPoint,
        selectedDroppingPoint,
        setSelectedDroppingPoint,
        createBooking,
        bookings,
        currentBooking,
        setCurrentBooking,
        cancelBooking,
        trackingBusId,
        setTrackingBusId,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        unreadCount,
        adminAddBus,
        adminUpdateBus,
        adminDeleteBus,
        adminToggleSeat
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
