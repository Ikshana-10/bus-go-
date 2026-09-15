import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Download, 
  Navigation, 
  Bus, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';

interface DigitalTicketModalProps {
  booking: Booking;
  onClose: () => void;
  onTrackBus: (busId: string) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  booking,
  onClose,
  onTrackBus
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code for ticket verification
    const textToEncode = booking.qrData || `BUSGO:${booking.bookingId}|${booking.busNumber}|${booking.seats.join(',')}|${booking.totalAmount}`;
    QRCode.toDataURL(textToEncode, {
      width: 240,
      margin: 2,
      color: {
        dark: '#064e3b', // Deep emerald
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [booking]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `BusGo Boarding Pass - ${booking.bookingId}`,
        text: `My bus ticket from ${booking.source} to ${booking.destination} on ${booking.journeyDate}. Seat: ${booking.seats.join(', ')}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`BusGo Ticket: ${booking.bookingId} (${booking.source} to ${booking.destination})`);
      alert('Ticket summary copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Non-printed) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Verified Digital Boarding Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Share Ticket"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id="print-ticket-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Boarding Pass Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8" id="printable-ticket-content">
          <div className="bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 rounded-3xl border-2 border-emerald-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Watermark / Brand Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-dashed border-slate-200 dark:border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Bus className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Bus<span className="text-emerald-500">Go</span> Express
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official e-Ticket & Boarding Authority
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1 border border-emerald-300 dark:border-emerald-800">
                  CONFIRMED & PAID
                </span>
                <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  PNR: <span className="text-slate-900 dark:text-white font-extrabold">{booking.bookingId}</span>
                </p>
              </div>
            </div>

            {/* Route & Timing Banner */}
            <div className="my-6 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">From</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{booking.source}</h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{booking.departureTime}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{booking.boardingPoint}</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  DIRECT INTERCITY
                </span>
                <div className="w-full max-w-[120px] h-0.5 bg-emerald-500 my-2 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {booking.journeyDate}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase">To Destination</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{booking.destination}</h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{booking.arrivalTime}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{booking.droppingPoint}</p>
              </div>
            </div>

            {/* Coach & Passenger Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              {/* Bus Details & Passengers */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400">Operator:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{booking.operatorName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bus Number:</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{booking.busNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Coach Class:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{booking.busType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Seats:</span>
                    <p className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                      {booking.seats.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment:</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{booking.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Fare:</span>
                    <p className="font-mono font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                      ₹{booking.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Passenger Manifest */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Passenger Manifest
                  </h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 text-xs">
                    {booking.passengers.map((p, pIdx) => (
                      <div key={pIdx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{p.fullName}</span>
                          <span className="text-slate-400 ml-2">
                            ({p.age} yrs, {p.gender})
                          </span>
                        </div>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Seat {p.seatNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code & Barcode */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Digital Boarding QR Code"
                    className="w-36 h-36 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-xl" />
                )}

                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2">
                  SCAN FOR BOARDING
                </span>

                {/* Simulated Barcode Lines */}
                <div className="w-full h-7 flex items-center justify-center gap-0.5 mt-3 opacity-75">
                  {[2, 4, 1, 3, 2, 5, 2, 1, 4, 3, 2, 4, 1, 3, 2, 5, 1, 4].map((w, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-slate-900 dark:bg-white"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Guidelines */}
            <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Please arrive at {booking.boardingPoint} at least 15 minutes before scheduled departure.</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Generated: {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 print:hidden">
          <button
            onClick={() => onTrackBus(booking.busId)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-300 dark:border-emerald-800"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>Track This Bus Live (GPS)</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
