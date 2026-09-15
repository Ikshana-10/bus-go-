import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Bus as BusIcon, 
  RotateCcw, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { Bus, SearchFilterParams } from '../types';
import { useApp } from '../context/AppContext';
import { BusCard } from './BusCard';

interface BusListProps {
  onSelectBus: (bus: Bus) => void;
  onModifySearch: () => void;
}

export const BusList: React.FC<BusListProps> = ({ onSelectBus, onModifySearch }) => {
  const { buses, searchParams, locations } = useApp();

  const [filters, setFilters] = useState<SearchFilterParams>({
    busType: [],
    acType: 'all',
    seatCategory: 'all',
    timeSlot: [],
    priceRange: [400, 1500],
    minRating: 0,
    operators: [],
    sortBy: 'cheapest'
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available unique operators from fleet
  const allOperators = useMemo(() => {
    return Array.from(new Set(buses.map(b => b.operatorName)));
  }, [buses]);

  // Route matching logic: check if bus connects `searchParams.from` and `searchParams.to`
  // Either direct source-destination OR via route stops!
  const routeMatchedBuses = useMemo(() => {
    const fromCity = searchParams.from.trim().toLowerCase();
    const toCity = searchParams.to.trim().toLowerCase();

    return buses.filter(bus => {
      if (!bus.isActive) return false;

      // 1. Direct match
      const directMatch =
        bus.source.toLowerCase().includes(fromCity) &&
        bus.destination.toLowerCase().includes(toCity);

      if (directMatch) return true;

      // 2. Route stop match (origin before destination in stops array)
      const fromIdx = bus.routeStops.findIndex(s => s.city.toLowerCase().includes(fromCity));
      const toIdx = bus.routeStops.findIndex(s => s.city.toLowerCase().includes(toCity));

      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
  }, [buses, searchParams.from, searchParams.to]);

  // Apply User Filters (AC, Sleeper, Price, Rating, Time Slot, Operator)
  const filteredBuses = useMemo(() => {
    return routeMatchedBuses.filter(bus => {
      // AC / Non-AC filter
      const isAC = bus.busType.toLowerCase().includes('ac');
      if (filters.acType === 'ac' && !isAC) return false;
      if (filters.acType === 'non-ac' && isAC) return false;

      // Sleeper / Seater filter
      const isSleeper = bus.busType.toLowerCase().includes('sleeper');
      if (filters.seatCategory === 'sleeper' && !isSleeper) return false;
      if (filters.seatCategory === 'seater' && isSleeper) return false;

      // Price filter
      if (bus.price < filters.priceRange[0] || bus.price > filters.priceRange[1]) return false;

      // Rating filter
      if (bus.rating < filters.minRating) return false;

      // Operator filter
      if (filters.operators.length > 0 && !filters.operators.includes(bus.operatorName)) return false;

      // Departure Time Slot filter
      if (filters.timeSlot.length > 0) {
        const [hours] = bus.departureTime.split(':').map(Number);
        const matchesSlot = filters.timeSlot.some(slot => {
          if (slot === 'early-morning') return hours >= 0 && hours < 6;
          if (slot === 'morning') return hours >= 6 && hours < 12;
          if (slot === 'afternoon') return hours >= 12 && hours < 18;
          if (slot === 'night') return hours >= 18 && hours < 24;
          return false;
        });
        if (!matchesSlot) return false;
      }

      return true;
    });
  }, [routeMatchedBuses, filters]);

  // Apply Sorting
  const sortedBuses = useMemo(() => {
    const list = [...filteredBuses];
    switch (filters.sortBy) {
      case 'cheapest':
        return list.sort((a, b) => a.price - b.price);
      case 'highest-rated':
        return list.sort((a, b) => b.rating - a.rating);
      case 'earliest':
        return list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case 'fastest':
        return list.sort((a, b) => {
          const durA = parseInt(a.duration) || 0;
          const durB = parseInt(b.duration) || 0;
          return durA - durB;
        });
      default:
        return list;
    }
  }, [filteredBuses, filters.sortBy]);

  // Toggle helpers
  const toggleOperator = (op: string) => {
    setFilters(prev => ({
      ...prev,
      operators: prev.operators.includes(op)
        ? prev.operators.filter(o => o !== op)
        : [...prev.operators, op]
    }));
  };

  const toggleTimeSlot = (slot: string) => {
    setFilters(prev => ({
      ...prev,
      timeSlot: prev.timeSlot.includes(slot)
        ? prev.timeSlot.filter(s => s !== slot)
        : [...prev.timeSlot, slot]
    }));
  };

  const resetFilters = () => {
    setFilters({
      busType: [],
      acType: 'all',
      seatCategory: 'all',
      timeSlot: [],
      priceRange: [400, 1500],
      minRating: 0,
      operators: [],
      sortBy: 'cheapest'
    });
  };

  const activeFilterCount = 
    (filters.acType !== 'all' ? 1 : 0) +
    (filters.seatCategory !== 'all' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.timeSlot.length +
    filters.operators.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Intercity Route</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{searchParams.from}</span>
            <span className="text-emerald-500">→</span>
            <span>{searchParams.to}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Journey Date: <span className="font-semibold text-slate-800 dark:text-slate-200">{searchParams.date}</span> • {searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onModifySearch}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Modify Search
          </button>
          
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Bus Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* AC / Non-AC */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Bus AC Preference
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, acType: 'all' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.acType === 'all' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, acType: 'ac' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.acType === 'ac' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, acType: 'non-ac' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.acType === 'non-ac' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  Non-AC
                </button>
              </div>
            </div>

            {/* Seat Category (Sleeper / Seater) */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Seat Configuration
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, seatCategory: 'all' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.seatCategory === 'all' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, seatCategory: 'sleeper' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.seatCategory === 'sleeper' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  Sleeper
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, seatCategory: 'seater' }))}
                  className={`py-1.5 rounded-lg transition-all ${filters.seatCategory === 'seater' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  Seater
                </button>
              </div>
            </div>

            {/* Departure Time Slots */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Departure Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleTimeSlot('morning')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                    filters.timeSlot.includes('morning')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 mb-1 text-amber-500" />
                  <div className="text-[11px] leading-tight">Morning</div>
                  <div className="text-[9px] text-slate-400">6 AM - 12 PM</div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTimeSlot('afternoon')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                    filters.timeSlot.includes('afternoon')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5 mb-1 text-orange-500" />
                  <div className="text-[11px] leading-tight">Afternoon</div>
                  <div className="text-[9px] text-slate-400">12 PM - 6 PM</div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTimeSlot('night')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                    filters.timeSlot.includes('night')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 mb-1 text-indigo-500" />
                  <div className="text-[11px] leading-tight">Night (Sleeper)</div>
                  <div className="text-[9px] text-slate-400">6 PM - 12 AM</div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTimeSlot('early-morning')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                    filters.timeSlot.includes('early-morning')
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mb-1 text-teal-500" />
                  <div className="text-[11px] leading-tight">Early Hours</div>
                  <div className="text-[9px] text-slate-400">12 AM - 6 AM</div>
                </button>
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Max Ticket Fare
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Up to ₹{filters.priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1500"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹400</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 4.0, 4.5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, minRating: rating }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      filters.minRating === rating
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rating === 0 ? 'All' : `${rating} ★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Operators Filter */}
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                Bus Operators
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {allOperators.map(operator => (
                  <label
                    key={operator}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600"
                  >
                    <input
                      type="checkbox"
                      checked={filters.operators.includes(operator)}
                      onChange={() => toggleOperator(operator)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span className="truncate">{operator}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Bus Results Column */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Sorting Control Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
              <BusIcon className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className="text-slate-900 dark:text-white">{sortedBuses.length} Buses</strong> available on this route
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { key: 'cheapest', label: 'Cheapest' },
                  { key: 'fastest', label: 'Fastest' },
                  { key: 'earliest', label: 'Earliest' },
                  { key: 'highest-rated', label: 'Top Rated' }
                ].map(sortOption => (
                  <button
                    key={sortOption.key}
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, sortBy: sortOption.key as any }))}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      filters.sortBy === sortOption.key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bus Cards List */}
          {sortedBuses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No Buses Found for this Filter Criteria
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-6">
                No active coaches matched your price or time slot filters for {searchParams.from} → {searchParams.to}.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
                >
                  Clear Applied Filters
                </button>
                <button
                  onClick={onModifySearch}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Change Origin / Destination
                </button>
              </div>
            </div>
          ) : (
            sortedBuses.map(bus => (
              <BusCard
                key={bus.busId}
                bus={bus}
                onSelectBus={onSelectBus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
