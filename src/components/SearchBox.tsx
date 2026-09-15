import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Calendar, 
  MapPin, 
  Search, 
  Users, 
  History, 
  Building2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POPULAR_ROUTES } from '../data/demoData';

interface SearchBoxProps {
  onSearchSubmit: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearchSubmit }) => {
  const { 
    searchParams, 
    setSearchParams, 
    locations, 
    recentSearches, 
    setActiveTab 
  } = useApp();

  const [fromQuery, setFromQuery] = useState(searchParams.from);
  const [toQuery, setToQuery] = useState(searchParams.to);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Filter available cities based on search inputs
  const filteredFromLocations = locations.filter(loc => 
    loc.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
    loc.busStandName.toLowerCase().includes(fromQuery.toLowerCase()) ||
    loc.popularBoardingPoints.some(bp => bp.toLowerCase().includes(fromQuery.toLowerCase()))
  );

  const filteredToLocations = locations.filter(loc => 
    loc.city.toLowerCase().includes(toQuery.toLowerCase()) ||
    loc.busStandName.toLowerCase().includes(toQuery.toLowerCase()) ||
    loc.popularBoardingPoints.some(bp => bp.toLowerCase().includes(toQuery.toLowerCase()))
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    const tempFrom = fromQuery;
    const tempTo = toQuery;
    setFromQuery(tempTo);
    setToQuery(tempFrom);
    setSearchParams(prev => ({
      ...prev,
      from: tempTo,
      to: tempFrom
    }));
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSelectFrom = (city: string) => {
    setFromQuery(city);
    setSearchParams(prev => ({ ...prev, from: city }));
    setShowFromDropdown(false);
  };

  const handleSelectTo = (city: string) => {
    setToQuery(city);
    setSearchParams(prev => ({ ...prev, to: city }));
    setShowToDropdown(false);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
    setSearchParams(prev => ({ ...prev, from, to }));
    setActiveTab('search');
    onSearchSubmit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromQuery.trim() || !toQuery.trim()) {
      alert('Please specify both departure and destination cities.');
      return;
    }
    if (fromQuery.trim().toLowerCase() === toQuery.trim().toLowerCase()) {
      alert('Departure and Destination cannot be the same city.');
      return;
    }
    setSearchParams(prev => ({
      ...prev,
      from: fromQuery,
      to: toQuery
    }));
    setActiveTab('search');
    onSearchSubmit();
  };

  // Quick date shortcuts (Today, Tomorrow, Day After)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const selectedFromObj = locations.find(l => l.city.toLowerCase() === fromQuery.toLowerCase());
  const selectedToObj = locations.find(l => l.city.toLowerCase() === toQuery.toLowerCase());

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 -mt-12 md:-mt-16 relative z-30">
      {/* Main Search Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-5 sm:p-7 md:p-8 transition-colors">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
            {/* FROM Location Input */}
            <div ref={fromRef} className="relative md:col-span-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                From City / Terminal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  id="from-city-input"
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                  placeholder="Enter Departure City"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* From Dropdown Autocomplete & Nearby Hubs */}
              {showFromDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Available Transit Hubs
                  </div>
                  {filteredFromLocations.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400">
                      No matching cities found in South India fleet.
                    </div>
                  ) : (
                    filteredFromLocations.map(loc => (
                      <div
                        key={loc.locationId}
                        onClick={() => handleSelectFrom(loc.city)}
                        className="px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{loc.city}</span>
                          <span className="text-[11px] text-slate-400">{loc.state}</span>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                          {loc.busStandName}
                        </p>
                        {/* Nearby Boarding Points */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {loc.popularBoardingPoints.slice(0, 3).map((bp, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {bp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                id="swap-route-btn"
                onClick={handleSwap}
                className={`p-3 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform ${
                  isSwapping ? 'rotate-180 scale-110 text-emerald-600' : ''
                }`}
                title="Swap Origin and Destination"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO Location Input */}
            <div ref={toRef} className="relative md:col-span-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                To Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  id="to-city-input"
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setShowToDropdown(true);
                  }}
                  onFocus={() => setShowToDropdown(true)}
                  placeholder="Enter Arrival City"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* To Dropdown Autocomplete */}
              {showToDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Destination City
                  </div>
                  {filteredToLocations.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400">
                      No matching cities found in South India fleet.
                    </div>
                  ) : (
                    filteredToLocations.map(loc => (
                      <div
                        key={loc.locationId}
                        onClick={() => handleSelectTo(loc.city)}
                        className="px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{loc.city}</span>
                          <span className="text-[11px] text-slate-400">{loc.state}</span>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                          {loc.busStandName}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {loc.popularBoardingPoints.slice(0, 3).map((bp, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {bp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Date & Passengers Input */}
            <div className="grid grid-cols-2 gap-2 md:col-span-3">
              {/* Journey Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Journey Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="journey-date-input"
                    type="date"
                    min={todayStr}
                    value={searchParams.date}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full pl-9 pr-2 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Passengers Count */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Passengers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <select
                    id="passenger-count-select"
                    value={searchParams.passengers}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: Number(e.target.value) }))}
                    className="w-full pl-9 pr-3 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Seat' : 'Seats'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Date Shortcuts & Action Button Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Date Pill Shortcuts */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Quick Date:</span>
              <button
                type="button"
                onClick={() => setSearchParams(prev => ({ ...prev, date: todayStr }))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  searchParams.date === todayStr
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSearchParams(prev => ({ ...prev, date: tomorrowStr }))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  searchParams.date === tomorrowStr
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setSearchParams(prev => ({ ...prev, date: dayAfterStr }))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  searchParams.date === dayAfterStr
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Day After
              </button>
            </div>

            {/* Main Submit CTA */}
            <button
              type="submit"
              id="search-buses-submit-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Search Available Buses</span>
            </button>
          </div>
        </form>

        {/* Selected Hub Nearby Boarding Points Hint */}
        {selectedFromObj && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">Boarding points in {selectedFromObj.city}: </span>
              {selectedFromObj.popularBoardingPoints.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Recent Searches Pills */}
      {recentSearches.length > 0 && (
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> Recent Searches:
          </span>
          {recentSearches.map((rec, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickRoute(rec.from, rec.to)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>{rec.from} → {rec.to}</span>
              <span className="text-[10px] text-slate-400">({rec.date})</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Routes Cards */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Popular Bus Routes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Direct non-stop & express coaches with highest daily frequency</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Real-time fares
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route, i) => (
            <div
              key={i}
              onClick={() => handleQuickRoute(route.from, route.to)}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex"
            >
              <div className="w-24 sm:w-28 relative overflow-hidden shrink-0">
                <img 
                  src={route.image} 
                  alt={`${route.from} to ${route.to}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white uppercase">
                  {route.time}
                </span>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <span>{route.from}</span>
                    <span className="text-emerald-500">→</span>
                    <span>{route.to}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {route.buses} daily scheduled buses
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">From</span>
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{route.startingPrice}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 flex items-center gap-1">
                    Book <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
