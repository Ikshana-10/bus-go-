import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Phone, 
  AlertCircle, 
  Gauge, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight, 
  Bus,
  Radio,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BusTrackingPage: React.FC = () => {
  const { buses, trackingBusId, setTrackingBusId } = useApp();

  // Find active tracked bus
  const activeBus = buses.find(b => b.busId === trackingBusId) || buses[0];

  // Simulation state
  const [currentProgress, setCurrentProgress] = useState(48); // % of route covered
  const [speed, setSpeed] = useState(65); // km/h
  const [isLive, setIsLive] = useState(true);
  const [lastPing, setLastPing] = useState('Just now');

  // Periodic simulated telemetry fluctuation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSpeed(prev => Math.min(85, Math.max(45, prev + Math.floor(Math.random() * 7) - 3)));
      setCurrentProgress(prev => (prev >= 98 ? 15 : prev + 0.3));
      setLastPing('10 seconds ago');
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleRefresh = () => {
    setLastPing('Just now');
    setSpeed(72);
  };

  const stops = activeBus?.routeStops || [];
  // Calculate which stop the bus is currently near based on progress
  const currentStopIndex = Math.min(
    stops.length - 1,
    Math.floor((currentProgress / 100) * stops.length)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Live Satellite Bus Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Real-Time Bus Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track coach position, ETA, speed, and route milestones along national highways.
          </p>
        </div>

        {/* Bus Selector dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Switch Coach:
          </label>
          <select
            value={activeBus?.busId}
            onChange={(e) => setTrackingBusId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {buses.map(b => (
              <option key={b.busId} value={b.busId}>
                {b.operatorName} ({b.source} → {b.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Telemetry Banner & Route Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Radar Card & Map Simulation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status & Telemetry HUD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Bus className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeBus?.operatorName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {activeBus?.busNumber} • {activeBus?.busType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  On-Time (Punctual)
                </span>

                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  title="Ping GPS Receiver"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Progress Bar Highway */}
            <div className="my-6">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>{activeBus?.source} ({activeBus?.departureTime})</span>
                <span className="text-emerald-600 font-mono">{Math.round(currentProgress)}% Completed</span>
                <span>{activeBus?.destination} ({activeBus?.arrivalTime})</span>
              </div>

              {/* Highway Graphic Bar */}
              <div className="relative h-6 bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden p-1 shadow-inner border border-slate-700 flex items-center">
                {/* Road dashed center line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-b border-dashed border-amber-400/70" />

                {/* Road Progress Overlay */}
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600/50 to-teal-500/80 rounded-lg transition-all duration-700"
                  style={{ width: `${currentProgress}%` }}
                />

                {/* Animated Bus Marker on Highway */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 flex items-center"
                  style={{ left: `calc(${currentProgress}% - 14px)` }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-300 dark:ring-emerald-900/60 animate-bounce">
                    <Bus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-500" /> Cruising Speed
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                  {speed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500" /> Est. Destination
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {activeBus?.arrivalTime}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" /> Next Milestone
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                  {stops[currentStopIndex + 1]?.stopName || 'Terminal'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500" /> GPS Last Sync
                </span>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  {lastPing}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Route Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Live Route Milestone Progress
            </h3>

            <div className="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {stops.map((stop, sIdx) => {
                const isPassed = sIdx < currentStopIndex;
                const isCurrent = sIdx === currentStopIndex;
                const isUpcoming = sIdx > currentStopIndex;

                return (
                  <div key={sIdx} className="relative flex items-center justify-between text-xs">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ring-4 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950 text-white'
                          : isCurrent
                          ? 'bg-amber-500 ring-amber-200 dark:ring-amber-950 text-white scale-125 animate-pulse'
                          : 'bg-slate-300 dark:bg-slate-700 ring-slate-100 dark:ring-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3" />}
                      {isCurrent && <Bus className="w-2.5 h-2.5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${
                          isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {stop.stopName}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                            BUS IS HERE
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {stop.city} • {stop.distanceKm} km from origin
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
                        {stop.time}
                      </span>
                      <span className={`block text-[10px] font-semibold ${
                        isPassed ? 'text-emerald-600' : isCurrent ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        {isPassed ? 'Departed' : isCurrent ? 'Approaching' : 'Expected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Driver & Safety Contacts */}
        <div className="lg:col-span-4 space-y-5">
          {/* Driver Contact Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Coach Crew & Support
            </h3>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-base">
                {activeBus?.driverName?.charAt(0) || 'P'}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeBus?.driverName || 'Verified Pilot'}
                </h4>
                <p className="text-[11px] text-slate-500">Lead Senior Captain (12+ Yrs Exp)</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> Driver Mobile:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {activeBus?.driverPhone || '+91 98401 22334'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 24x7 SOS Helpline:
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  1800-425-9000
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Comfort Amenities */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Onboard Equipment Telemetry
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Air Conditioning</span>
                <span className="text-emerald-600 font-bold">22°C (Optimal)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Air Suspension System</span>
                <span className="text-emerald-600 font-bold">Active (Smooth Ride)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Fastag & Toll Status</span>
                <span className="text-emerald-600 font-bold">Cleared (Electronic)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Emergency Exit Door</span>
                <span className="text-emerald-600 font-bold">Locked & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
