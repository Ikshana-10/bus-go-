import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  XCircle, 
  ChevronRight, 
  Printer, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';

interface MyBookingsPageProps {
  onViewTicket: (booking: Booking) => void;
  onTrackBus: (busId: string) => void;
  onBookNewTrip: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onViewTicket,
  onTrackBus,
  onBookNewTrip
}) => {
  const { bookings, cancelBooking } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'confirmed' && b.bookingStatus !== 'CONFIRMED') return false;
    if (activeFilter === 'cancelled' && b.bookingStatus !== 'CANCELLED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingId.toLowerCase().includes(q) ||
        b.source.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.operatorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancellingBookingId) {
      cancelBooking(cancellingBookingId);
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Ticket className="w-3.5 h-3.5" />
            <span>Passenger Reservations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            My Bookings & Digital Tickets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your intercity reservations, download digital passes, track coaches & request refunds.
          </p>
        </div>

        <button
          onClick={onBookNewTrip}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Book New Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeFilter === 'confirmed'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Confirmed ({bookings.filter(b => b.bookingStatus === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setActiveFilter('cancelled')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeFilter === 'cancelled'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cancelled ({bookings.filter(b => b.bookingStatus === 'CANCELLED').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No Bookings Found
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2 mb-6">
            You don't have any reservations matching the selected filter. Plan your next weekend getaway today!
          </p>
          <button
            onClick={onBookNewTrip}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
          >
            Search Available Buses
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const isConfirmed = booking.bookingStatus === 'CONFIRMED';

            return (
              <div
                key={booking.bookingId}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  {/* Left: ID & Route */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {booking.bookingId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{booking.source}</span>
                      <span className="text-emerald-500">→</span>
                      <span>{booking.destination}</span>
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {booking.operatorName} • {booking.busType} ({booking.busNumber})
                    </p>
                  </div>

                  {/* Middle: Schedule & Boarding */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Date & Time</span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        {booking.journeyDate}
                      </span>
                      <span className="text-slate-500 mt-0.5 block">{booking.departureTime}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Seats</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {booking.seats.join(', ')}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Total Paid</span>
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                        ₹{booking.totalAmount}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{booking.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onViewTicket(booking)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => onTrackBus(booking.busId)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Track Bus</span>
                        </button>

                        <button
                          onClick={() => setCancellingBookingId(booking.bookingId)}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Boarding Info */}
                <div className="mt-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Boarding: <strong className="text-slate-700 dark:text-slate-300">{booking.boardingPoint}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-500" />
                    <span>Dropping: <strong className="text-slate-700 dark:text-slate-300">{booking.droppingPoint}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Cancel Reservation {cancellingBookingId}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                As per BusGo policy, 90% of your ticket fare will be refunded back to your original payment method within 2-4 business days. The seats will be released.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
