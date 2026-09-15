import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bus as BusIcon, 
  TrendingUp, 
  Users, 
  Ticket, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle,
  Search,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Bus, Seat, SeatStatus } from '../types';
import { useApp } from '../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    buses, 
    bookings, 
    adminAddBus, 
    adminUpdateBus, 
    adminDeleteBus, 
    adminToggleSeat,
    cancelBooking 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'seats' | 'bookings'>('overview');

  // Add Bus Modal State
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newBusForm, setNewBusForm] = useState({
    operatorName: 'Express Line Superfast',
    busNumber: 'TN-45-XY-9900',
    busType: 'AC Sleeper 2+1' as const,
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '21:30',
    arrivalTime: '05:15',
    duration: '7h 45m',
    price: 780,
    totalSeats: 30,
    driverName: 'Murugan P.',
    driverPhone: '+91 94432 11223'
  });

  // Seat matrix inspector for a selected bus
  const [inspectBusId, setInspectBusId] = useState<string>(buses[0]?.busId || '');
  const targetBus = buses.find(b => b.busId === inspectBusId) || buses[0];

  // Overview metrics calculations
  const totalFleetCount = buses.length;
  const activeFleetCount = buses.filter(b => b.isActive).length;
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.bookingStatus === 'CONFIRMED')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  // Approximate occupancy rate across fleet
  const totalSeats = buses.reduce((acc, b) => acc + b.totalSeats, 0);
  const availableSeats = buses.reduce((acc, b) => acc + b.availableSeats, 0);
  const occupancyPercentage = totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0;

  const handleAddBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate seats for new bus
    const generatedSeats: Seat[] = [];
    const rows = Math.ceil(newBusForm.totalSeats / 3);
    let count = 1;

    for (let r = 1; r <= rows; r++) {
      ['A', 'B', 'C'].forEach((colLetter, cIdx) => {
        if (count <= newBusForm.totalSeats) {
          generatedSeats.push({
            seatNumber: `${colLetter}${r}`,
            row: r,
            col: cIdx,
            deck: 'lower',
            type: newBusForm.busType.includes('Sleeper') ? 'sleeper' : 'seater',
            status: 'available',
            price: newBusForm.price
          });
          count++;
        }
      });
    }

    adminAddBus({
      operatorName: newBusForm.operatorName,
      busNumber: newBusForm.busNumber,
      busType: newBusForm.busType,
      source: newBusForm.source,
      destination: newBusForm.destination,
      departureTime: newBusForm.departureTime,
      arrivalTime: newBusForm.arrivalTime,
      duration: newBusForm.duration,
      price: Number(newBusForm.price),
      totalSeats: Number(newBusForm.totalSeats),
      availableSeats: Number(newBusForm.totalSeats),
      rating: 4.8,
      reviewCount: 14,
      amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket', 'Reading Light', 'Live GPS'],
      boardingPoints: [
        { name: `${newBusForm.source} Central Terminus`, time: newBusForm.departureTime, landmark: 'Main Gate' }
      ],
      droppingPoints: [
        { name: `${newBusForm.destination} Central Bus Stand`, time: newBusForm.arrivalTime, landmark: 'Platform 1' }
      ],
      routeStops: [
        { stopName: `${newBusForm.source} Terminus`, city: newBusForm.source, time: newBusForm.departureTime, distanceKm: 0, isBoarding: true },
        { stopName: `${newBusForm.destination} Stand`, city: newBusForm.destination, time: newBusForm.arrivalTime, distanceKm: 490, isDropping: true }
      ],
      seats: generatedSeats,
      driverName: newBusForm.driverName,
      driverPhone: newBusForm.driverPhone
    });

    setShowAddBusModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>BusGo Fleet Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Admin Master Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time fleet operations, inventory control, manual seat reservations & revenue analytics.
          </p>
        </div>

        <button
          onClick={() => setShowAddBusModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bus to Fleet</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Operations & Analytics' },
          { id: 'fleet', label: `Fleet Catalog (${buses.length})` },
          { id: 'seats', label: 'Seat Blocking Matrix' },
          { id: 'bookings', label: `All Reservations (${bookings.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 Big KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total Fleet Buses</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalFleetCount}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                {activeFleetCount} active in service
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total Bookings</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalBookingsCount}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                98% completion rate
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total Revenue</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Verified digital payments
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Fleet Occupancy</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {occupancyPercentage}%
              </p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                Healthy route demand
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Registered Users</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                1,420
              </p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                +42 this week
              </span>
            </div>
          </div>

          {/* Graphical Representation: Route Performance & Daily Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Daily Booking Activity Chart (SVG bars) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Daily Booking Volume (Past 7 Days)
                  </h3>
                  <p className="text-xs text-slate-500">Number of confirmed reservations per day</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">+18% vs Last Week</span>
              </div>

              {/* Bar Chart Container */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800">
                {[
                  { day: 'Mon', count: 18, height: '40%' },
                  { day: 'Tue', count: 24, height: '52%' },
                  { day: 'Wed', count: 30, height: '65%' },
                  { day: 'Thu', count: 35, height: '75%' },
                  { day: 'Fri', count: 48, height: '95%' },
                  { day: 'Sat', count: 52, height: '100%' },
                  { day: 'Sun', count: 42, height: '85%' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {bar.count}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-36 flex items-end overflow-hidden p-1">
                      <div
                        className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-lg transition-all duration-500 shadow-sm"
                        style={{ height: bar.height }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Routes Ranking Table */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                High-Volume Route Corridors
              </h3>

              <div className="space-y-3">
                {[
                  { route: 'Chennai ↔ Coimbatore', volume: '1,280 seats', revenue: '₹9,60,000', badge: 'High Demand' },
                  { route: 'Bengaluru ↔ Chennai', volume: '940 seats', revenue: '₹6,39,200', badge: 'Fastest' },
                  { route: 'Hyderabad ↔ Bengaluru', volume: '720 seats', revenue: '₹6,47,280', badge: 'Night Sleeper' },
                  { route: 'Chennai ↔ Madurai', volume: '650 seats', revenue: '₹4,68,000', badge: 'Tourist' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{item.route}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.volume} booked this month</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.revenue}</span>
                      <span className="block text-[9px] font-semibold text-slate-400 uppercase">{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fleet Catalog & Bus Management */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Configured Buses in Database ({buses.length})
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Bus / Operator</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Timings</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {buses.map(bus => (
                    <tr key={bus.busId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {bus.operatorName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {bus.busNumber} • {bus.busType}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {bus.source} → {bus.destination}
                        </span>
                        <span className="block text-[10px] text-slate-400">{bus.duration}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {bus.departureTime}
                        </span>
                        <span className="text-slate-400 text-[11px]"> to {bus.arrivalTime}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 text-sm">
                        ₹{bus.price}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {bus.availableSeats} / {bus.totalSeats}
                        </span>
                        <span className="block text-[10px] text-slate-400">Available</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bus.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {bus.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => adminDeleteBus(bus.busId)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Bus from Fleet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Seat Blocking Matrix */}
      {activeTab === 'seats' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Coach Seat Blocking & VIP Hold
              </h3>
              <p className="text-xs text-slate-500">
                Click any seat to toggle status: Available ↔ Booked ↔ Disabled (VIP/Maintenance)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Select Bus:</span>
              <select
                value={inspectBusId}
                onChange={(e) => setInspectBusId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                {buses.map(b => (
                  <option key={b.busId} value={b.busId}>
                    {b.operatorName} ({b.busNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="max-w-md mx-auto p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
              Driver's Cockpit (Front)
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {targetBus?.seats.map(seat => {
                let badgeColor = 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200';
                if (seat.status === 'booked') badgeColor = 'bg-slate-300 dark:bg-slate-700 text-slate-500 border-slate-400';
                if (seat.status === 'disabled') badgeColor = 'bg-rose-100 dark:bg-rose-950 text-rose-700 border-rose-400';

                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => {
                      const nextStatus: SeatStatus =
                        seat.status === 'available' ? 'disabled' : seat.status === 'disabled' ? 'booked' : 'available';
                      adminToggleSeat(targetBus.busId, seat.seatNumber, nextStatus);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all hover:scale-105 ${badgeColor}`}
                    title={`Seat ${seat.seatNumber} (${seat.status}) - Click to toggle status`}
                  >
                    <span>{seat.seatNumber}</span>
                    <span className="text-[9px] uppercase font-sans mt-0.5 opacity-75">
                      {seat.status}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 flex justify-around text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white dark:bg-slate-800 border" /> Available</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700 border" /> Booked</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-200 dark:bg-rose-900 border" /> Blocked</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: All Bookings Manifest */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Route & Date</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Refund / Cancel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {bookings.map(b => (
                  <tr key={b.bookingId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {b.bookingId}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {b.passengers[0]?.fullName || 'Guest Passenger'}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {b.passengers[0]?.phoneNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {b.source} → {b.destination}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {b.journeyDate} ({b.departureTime})
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-600">
                      {b.seats.join(', ')}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{b.totalAmount}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.bookingStatus === 'CONFIRMED' && (
                        <button
                          onClick={() => cancelBooking(b.bookingId)}
                          className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold"
                        >
                          Cancel / Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Bus to Fleet
              </h3>
              <button onClick={() => setShowAddBusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Operator Name</label>
                  <input
                    type="text"
                    value={newBusForm.operatorName}
                    onChange={(e) => setNewBusForm({ ...newBusForm, operatorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bus Number Plate</label>
                  <input
                    type="text"
                    value={newBusForm.busNumber}
                    onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Origin City</label>
                  <input
                    type="text"
                    value={newBusForm.source}
                    onChange={(e) => setNewBusForm({ ...newBusForm, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination City</label>
                  <input
                    type="text"
                    value={newBusForm.destination}
                    onChange={(e) => setNewBusForm({ ...newBusForm, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Departure</label>
                  <input
                    type="time"
                    value={newBusForm.departureTime}
                    onChange={(e) => setNewBusForm({ ...newBusForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Arrival</label>
                  <input
                    type="time"
                    value={newBusForm.arrivalTime}
                    onChange={(e) => setNewBusForm({ ...newBusForm, arrivalTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fare (₹)</label>
                  <input
                    type="number"
                    value={newBusForm.price}
                    onChange={(e) => setNewBusForm({ ...newBusForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save & Deploy Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
