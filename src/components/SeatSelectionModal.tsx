import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Bus, Seat, SeatStatus } from '../types';
import { useApp } from '../context/AppContext';

interface SeatSelectionModalProps {
  bus: Bus;
  onClose: () => void;
  onProceedToPassengers: () => void;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  bus,
  onClose,
  onProceedToPassengers
}) => {
  const { selectedSeats, toggleSeat, clearSelectedSeats, searchParams } = useApp();
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const isSleeper = bus.busType.toLowerCase().includes('sleeper');

  // Filter seats by deck
  const deckSeats = bus.seats.filter(s => {
    if (!isSleeper) return true;
    return s.deck === activeDeck;
  });

  // Split deck seats into Rows
  const rowGroups: { [row: number]: Seat[] } = {};
  deckSeats.forEach(seat => {
    if (!rowGroups[seat.row]) rowGroups[seat.row] = [];
    rowGroups[seat.row].push(seat);
  });

  // Calculate total price of selected seats
  const totalPrice = selectedSeats.reduce((acc, seatNum) => {
    const seatObj = bus.seats.find(s => s.seatNumber === seatNum);
    return acc + (seatObj ? seatObj.price : bus.price);
  }, 0);

  // Helper for seat visual styles
  const getSeatStyle = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);

    if (isSelected) {
      return 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400';
    }

    switch (seat.status) {
      case 'booked':
        return 'bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed opacity-60';
      case 'female':
        return 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800 hover:border-pink-500';
      case 'disabled':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-300 border-slate-200 dark:border-slate-700 cursor-not-allowed';
      case 'available':
      default:
        return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:shadow-sm';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'disabled') return;
    toggleSeat(seat.seatNumber);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Seat Layout Selection
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {bus.busType}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {bus.operatorName} • {bus.source} → {bus.destination}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Deck & Coach Canvas */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Deck Switcher (Lower / Upper) for Sleeper buses */}
            {isSleeper && (
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => setActiveDeck('lower')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeDeck === 'lower'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Lower Berth Deck
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('upper')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeDeck === 'upper'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Upper Berth Deck
                </button>
              </div>
            )}

            {/* Bus Coach Shell */}
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/40 rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-5 shadow-inner relative">
              {/* Front Cabin & Steering Wheel */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    FRONT / CABIN
                  </span>
                </div>
                {/* Steering Wheel Icon Representation */}
                <div className="w-8 h-8 rounded-full border-2 border-slate-500 dark:border-slate-400 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm" title="Driver's Cabin">
                  <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                </div>
              </div>

              {/* Seat Matrix Grid */}
              <div className="space-y-3">
                {Object.keys(rowGroups).map(rowKey => {
                  const rowNum = Number(rowKey);
                  const seatsInRow = rowGroups[rowNum];
                  // Left side vs Right side of aisle
                  const leftSeats = seatsInRow.filter(s => s.col <= 1);
                  const rightSeats = seatsInRow.filter(s => s.col > 1);

                  return (
                    <div key={rowNum} className="flex items-center justify-between gap-3">
                      {/* Left Column Seats */}
                      <div className="flex gap-2">
                        {leftSeats.map(seat => (
                          <button
                            key={seat.seatNumber}
                            type="button"
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked' || seat.status === 'disabled'}
                            className={`relative rounded-xl font-bold transition-all flex flex-col items-center justify-center border ${
                              isSleeper ? 'w-14 h-20 sm:w-16 sm:h-22' : 'w-11 h-12 sm:w-12 sm:h-14'
                            } ${getSeatStyle(seat)}`}
                            title={`Seat ${seat.seatNumber} - ₹${seat.price}`}
                          >
                            <span className="text-xs font-mono">{seat.seatNumber}</span>
                            <span className="text-[9px] opacity-75 mt-0.5">₹{seat.price}</span>
                            {seat.status === 'female' && (
                              <span className="absolute -top-1.5 -right-1 px-1 rounded-full text-[8px] font-extrabold bg-pink-500 text-white">
                                ♀
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Walking Aisle */}
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-[9px] font-mono tracking-widest text-slate-300 dark:text-slate-600 uppercase">
                          AISLE
                        </span>
                      </div>

                      {/* Right Column Seats */}
                      <div className="flex gap-2">
                        {rightSeats.map(seat => (
                          <button
                            key={seat.seatNumber}
                            type="button"
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked' || seat.status === 'disabled'}
                            className={`relative rounded-xl font-bold transition-all flex flex-col items-center justify-center border ${
                              isSleeper ? 'w-14 h-20 sm:w-16 sm:h-22' : 'w-11 h-12 sm:w-12 sm:h-14'
                            } ${getSeatStyle(seat)}`}
                            title={`Seat ${seat.seatNumber} - ₹${seat.price}`}
                          >
                            <span className="text-xs font-mono">{seat.seatNumber}</span>
                            <span className="text-[9px] opacity-75 mt-0.5">₹{seat.price}</span>
                            {seat.status === 'female' && (
                              <span className="absolute -top-1.5 -right-1 px-1 rounded-full text-[8px] font-extrabold bg-pink-500 text-white">
                                ♀
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear Indicator */}
              <div className="pt-4 mt-4 border-t border-dashed border-slate-300 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  REAR OF COACH
                </span>
              </div>
            </div>

            {/* Seat Type Legends */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md border border-slate-300 bg-white dark:bg-slate-800" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-emerald-600 border border-emerald-700" />
                <span className="font-semibold text-emerald-600">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-slate-300 dark:bg-slate-700 border border-slate-400" />
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-pink-100 dark:bg-pink-950 border border-pink-400" />
                <span className="text-pink-600">Ladies Reserved</span>
              </div>
            </div>
          </div>

          {/* Right Column: Selection Summary & Pricing */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                Booking Summary
              </h4>

              {/* Bus Details */}
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bus.source} → {bus.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Departure:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bus.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Passengers:</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-500" /> {searchParams.passengers}
                  </span>
                </div>
              </div>

              {/* Selected Seats Chips */}
              <div className="py-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Selected Seats ({selectedSeats.length})
                  </span>
                  {selectedSeats.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelectedSeats}
                      className="text-[11px] text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                {selectedSeats.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    Click on available seats on the coach layout to pick.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map(seatNum => (
                      <span
                        key={seatNum}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold font-mono border border-emerald-300 dark:border-emerald-800"
                      >
                        {seatNum}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Fare Breakdown */}
              <div className="py-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Seat Fare:</span>
                  <span className="font-mono">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST & Fleet Surcharge:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE (Waived)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                id="proceed-to-passengers-btn"
                onClick={onProceedToPassengers}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                  selectedSeats.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Continue to Passenger Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-2">
                Seats will be temporarily held during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
