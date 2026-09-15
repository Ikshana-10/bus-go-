import React, { useState } from 'react';
import { 
  Star, 
  Wifi, 
  Zap, 
  Tv, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Phone, 
  User as UserIcon,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Bus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BusCardProps {
  bus: Bus;
  onSelectBus: (bus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onSelectBus }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Helper for amenities icons
  const renderAmenityIcon = (amenity: string) => {
    const text = amenity.toLowerCase();
    if (text.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
    if (text.includes('charg') || text.includes('usb')) return <Zap className="w-3.5 h-3.5" />;
    if (text.includes('tv') || text.includes('screen')) return <Tv className="w-3.5 h-3.5" />;
    if (text.includes('gps') || text.includes('track')) return <MapPin className="w-3.5 h-3.5" />;
    return <ShieldCheck className="w-3.5 h-3.5" />;
  };

  const isAC = bus.busType.toLowerCase().includes('ac');
  const isSleeper = bus.busType.toLowerCase().includes('sleeper');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Operator & Bus Type Column */}
          <div className="lg:w-1/3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {bus.operatorName}
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {bus.rating.toFixed(1)}
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {bus.busType} • <span className="font-mono text-slate-700 dark:text-slate-300">{bus.busNumber}</span>
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isAC ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {isAC ? 'A/C' : 'Non-A/C'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {isSleeper ? 'Sleeper (2+1)' : 'Seater (2+2)'}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {bus.reviewCount} Ratings
              </span>
            </div>
          </div>

          {/* Timings & Duration Column */}
          <div className="lg:w-1/3 flex items-center justify-between sm:justify-around text-center">
            {/* Departure */}
            <div className="text-left sm:text-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {bus.departureTime}
              </span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                {bus.source}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {bus.boardingPoints[0]?.name || 'Main Bus Stand'}
              </p>
            </div>

            {/* Duration Graphic */}
            <div className="flex flex-col items-center px-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {bus.duration}
              </span>
              <div className="w-20 sm:w-28 h-0.5 bg-slate-200 dark:bg-slate-700 my-1.5 relative flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-emerald-500 -ml-1" />
                <div className="w-2 h-2 rounded-full bg-teal-500 -mr-1" />
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Direct Route
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right sm:text-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {bus.arrivalTime}
              </span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                {bus.destination}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {bus.droppingPoints[0]?.name || 'City Center'}
              </p>
            </div>
          </div>

          {/* Pricing & CTA Column */}
          <div className="lg:w-1/3 flex items-center justify-between lg:justify-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="text-left lg:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{bus.price}
                </span>
                {bus.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{bus.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {bus.availableSeats} seats left
              </p>
            </div>

            <button
              onClick={() => onSelectBus(bus)}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>View Seats</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Amenity Badges Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            {bus.amenities.slice(0, 5).map((amenity, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-[11px]">
                {renderAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showDetails ? 'Hide Route Details' : 'View Route & Boarding Points'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Route Visualization & Bus Journey */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-6 py-5 transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Route Visualization */}
              <div className="md:col-span-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Route Itinerary & Live Stops
                </h4>

                {/* Animated Route Line */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
                  {bus.routeStops.map((stop, sIdx) => (
                    <div key={sIdx} className="relative flex items-start justify-between text-xs">
                      {/* Stop Node */}
                      <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ${
                        sIdx === 0
                          ? 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950'
                          : sIdx === bus.routeStops.length - 1
                          ? 'bg-teal-500 ring-teal-100 dark:ring-teal-950'
                          : 'bg-slate-400 ring-slate-100 dark:ring-slate-800'
                      }`} />

                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {stop.stopName}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {stop.city} • {stop.distanceKm} km
                        </p>
                      </div>

                      <div className="text-right font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {stop.time}
                        {stop.isBoarding && (
                          <span className="ml-1 text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Boarding
                          </span>
                        )}
                        {stop.isDropping && (
                          <span className="ml-1 text-[9px] px-1 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                            Drop
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Boarding Contacts */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Primary Boarding Points
                  </h4>
                  <div className="space-y-1.5">
                    {bus.boardingPoints.map((bp, bIdx) => (
                      <div key={bIdx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{bp.name}</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{bp.time}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{bp.landmark}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {bus.driverName && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                      Assigned Pilot: {bus.driverName}
                    </div>
                    {bus.driverPhone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {bus.driverPhone} (Available 1 hr before departure)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
