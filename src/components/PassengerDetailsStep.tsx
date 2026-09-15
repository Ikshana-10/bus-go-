import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Bus, Passenger } from '../types';
import { useApp } from '../context/AppContext';

interface PassengerDetailsStepProps {
  bus: Bus;
  onBack: () => void;
  onProceedToPayment: () => void;
}

export const PassengerDetailsStep: React.FC<PassengerDetailsStepProps> = ({
  bus,
  onBack,
  onProceedToPayment
}) => {
  const { 
    selectedSeats, 
    currentUser, 
    passengers, 
    setPassengers,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    selectedBoardingPoint,
    setSelectedBoardingPoint,
    selectedDroppingPoint,
    setSelectedDroppingPoint
  } = useApp();

  // Initialize or align passengers array with selected seats count
  useEffect(() => {
    // Pick first boarding/dropping point by default if not set
    if (!selectedBoardingPoint && bus.boardingPoints.length > 0) {
      setSelectedBoardingPoint(bus.boardingPoints[0].name);
    }
    if (!selectedDroppingPoint && bus.droppingPoints.length > 0) {
      setSelectedDroppingPoint(bus.droppingPoints[0].name);
    }

    // Set initial passenger templates
    const initialList: Passenger[] = selectedSeats.map((seatNum, idx) => {
      const existing = passengers.find(p => p.seatNumber === seatNum);
      if (existing) return existing;

      // Auto-fill primary passenger with logged-in user if available
      if (idx === 0 && currentUser) {
        return {
          seatNumber: seatNum,
          fullName: currentUser.displayName || '',
          age: 26,
          gender: 'male',
          phoneNumber: currentUser.phoneNumber || '+91 98765 43210',
          email: currentUser.email || ''
        };
      }

      return {
        seatNumber: seatNum,
        fullName: '',
        age: 25,
        gender: 'male',
        phoneNumber: currentUser?.phoneNumber || '+91 98765 43210',
        email: currentUser?.email || 'traveler@example.com'
      };
    });

    setPassengers(initialList);
  }, [selectedSeats, currentUser]);

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate pricing
  const baseTotal = selectedSeats.reduce((acc, seatNum) => {
    const seatObj = bus.seats.find(s => s.seatNumber === seatNum);
    return acc + (seatObj ? seatObj.price : bus.price);
  }, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, baseTotal - discountAmount);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput, baseTotal);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const validateAndProceed = () => {
    // Check if boarding & dropping points are chosen
    if (!selectedBoardingPoint || !selectedDroppingPoint) {
      setFormError('Please select both boarding point and destination dropping point.');
      return;
    }

    // Check all passenger fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        setFormError(`Please enter full name for passenger on Seat ${p.seatNumber}`);
        return;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        setFormError(`Please enter a valid age for passenger on Seat ${p.seatNumber}`);
        return;
      }
      if (!p.phoneNumber || p.phoneNumber.trim().length < 8) {
        setFormError(`Please enter a valid phone number for ticket SMS updates.`);
        return;
      }
    }

    setFormError(null);
    onProceedToPayment();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Back to Seat Layout"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Step 2 of 3 • Passenger & Boarding
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Enter Passenger Details
              </h3>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400">Selected Seats</span>
            <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
              {selectedSeats.join(', ')}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Boarding/Dropping & Passenger Inputs */}
          <div className="lg:col-span-8 space-y-6">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Boarding and Dropping Points Selectors */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Select Transit Stops
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Boarding Point */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Pickup / Boarding Point ({bus.source})
                  </label>
                  <select
                    value={selectedBoardingPoint}
                    onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {bus.boardingPoints.map((bp, i) => (
                      <option key={i} value={bp.name}>
                        {bp.name} ({bp.time}) - {bp.landmark}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropping Point */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Dropoff Location ({bus.destination})
                  </label>
                  <select
                    value={selectedDroppingPoint}
                    onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {bus.droppingPoints.map((dp, i) => (
                      <option key={i} value={dp.name}>
                        {dp.name} ({dp.time}) - {dp.landmark}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Passenger Information Cards */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Passenger Credentials
              </h4>

              {passengers.map((passenger, pIdx) => (
                <div
                  key={passenger.seatNumber}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                        {pIdx + 1}
                      </span>
                      Passenger {pIdx + 1}
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Seat: {passenger.seatNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Full Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Full Name (as on Govt ID) *
                      </label>
                      <input
                        type="text"
                        value={passenger.fullName}
                        onChange={(e) => handlePassengerChange(pIdx, 'fullName', e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Age */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(pIdx, 'age', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Gender
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(pIdx, 'gender', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Contact Details on First Passenger */}
                    {pIdx === 0 && (
                      <>
                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Phone (SMS & WhatsApp Ticket) *
                          </label>
                          <input
                            type="tel"
                            value={passenger.phoneNumber}
                            onChange={(e) => handlePassengerChange(pIdx, 'phoneNumber', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Email (e-Ticket PDF copy) *
                          </label>
                          <input
                            type="email"
                            value={passenger.email}
                            onChange={(e) => handlePassengerChange(pIdx, 'email', e.target.value)}
                            placeholder="rahul@example.com"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Promo Coupon & Pricing Breakdown */}
          <div className="lg:col-span-4 space-y-5">
            {/* Promo Code Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} applied (₹{appliedCoupon.discount} OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-500 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. BUSGOFIRST"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {couponMessage && (
                    <p className={`text-[11px] font-semibold ${couponMessage.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {couponMessage.text}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400">
                    Try: <span className="font-mono font-bold text-emerald-600 cursor-pointer" onClick={() => setCouponInput('BUSGOFIRST')}>BUSGOFIRST</span> (₹150 off)
                  </div>
                </form>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                Fare Summary
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Fare ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}):</span>
                  <span className="font-mono font-semibold">₹{baseTotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Convenience Fee:</span>
                  <span className="text-emerald-600 font-bold">₹0 (Waived)</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Travel Insurance:</span>
                  <span className="text-emerald-600 font-bold">FREE Complimentary</span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-black text-slate-900 dark:text-white">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{finalTotal}</span>
                </div>
              </div>

              {/* Proceed CTA */}
              <button
                type="button"
                id="proceed-to-payment-btn"
                onClick={validateAndProceed}
                className="w-full mt-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated secure SSL checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
