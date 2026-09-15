import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchBox } from './components/SearchBox';
import { OffersSection } from './components/OffersSection';
import { BusList } from './components/BusList';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { PassengerDetailsStep } from './components/PassengerDetailsStep';
import { PaymentModal } from './components/PaymentModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { MyBookingsPage } from './components/MyBookingsPage';
import { BusTrackingPage } from './components/BusTrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import { Bus, Booking } from './types';
import { Bot, Sparkles } from 'lucide-react';

function AppContent() {
  const { 
    activeTab, 
    setActiveTab, 
    buses, 
    setTrackingBusId,
    setSearchParams,
    resetBookingFlow
  } = useApp();

  // Booking Flow Steps State
  const [activeBusForBooking, setActiveBusForBooking] = useState<Bus | null>(null);
  const [bookingStep, setBookingStep] = useState<'none' | 'seats' | 'passengers' | 'payment'>('none');

  // Ticket Modal State
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  // General Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Handlers for booking workflow
  const handleSelectBus = (bus: Bus) => {
    setActiveBusForBooking(bus);
    setBookingStep('seats');
  };

  const handleSeatsConfirmed = () => {
    setBookingStep('passengers');
  };

  const handlePassengersConfirmed = () => {
    setBookingStep('payment');
  };

  const handlePaymentSuccess = (confirmedBooking: Booking) => {
    // Close payment modal and show digital ticket
    setBookingStep('none');
    setActiveBusForBooking(null);
    resetBookingFlow();
    setActiveTicket(confirmedBooking);
  };

  const handleTrackBus = (busId: string) => {
    setTrackingBusId(busId);
    setActiveTicket(null);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyRoute = (from: string, to: string) => {
    setSearchParams(prev => ({ ...prev, from, to }));
    setIsAssistantOpen(false);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Primary Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Dynamic Content */}
      <main className="flex-1">
        {/* Tab 1: Home View */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-10">
            <HeroSection />
            <SearchBox />
            <OffersSection />
          </div>
        )}

        {/* Tab 2: Bus Search Results View */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="pt-6">
              <SearchBox />
            </div>
            <BusList onSelectBus={handleSelectBus} />
          </div>
        )}

        {/* Tab 3: My Bookings & Passes */}
        {activeTab === 'bookings' && (
          <MyBookingsPage
            onViewTicket={(booking) => setActiveTicket(booking)}
            onTrackBus={handleTrackBus}
            onBookNewTrip={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 4: Live Satellite Bus Tracking */}
        {activeTab === 'tracking' && (
          <BusTrackingPage />
        )}

        {/* Tab 5: Admin Management Dashboard */}
        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Floating Gemini AI Concierge Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsAssistantOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-400/30"
          title="Ask BusGo AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline">BusGo AI Assistant</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono uppercase tracking-wider">
            Gemini
          </span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Booking Step 1: Seat Selection Modal */}
      {bookingStep === 'seats' && activeBusForBooking && (
        <SeatSelectionModal
          bus={activeBusForBooking}
          onClose={() => {
            setBookingStep('none');
            setActiveBusForBooking(null);
          }}
          onProceed={handleSeatsConfirmed}
        />
      )}

      {/* Booking Step 2: Passenger Details Step Modal */}
      {bookingStep === 'passengers' && activeBusForBooking && (
        <PassengerDetailsStep
          bus={activeBusForBooking}
          onBack={() => setBookingStep('seats')}
          onProceed={handlePassengersConfirmed}
          onClose={() => {
            setBookingStep('none');
            setActiveBusForBooking(null);
          }}
        />
      )}

      {/* Booking Step 3: Simulated Payment Gateway Modal */}
      {bookingStep === 'payment' && activeBusForBooking && (
        <PaymentModal
          bus={activeBusForBooking}
          onBack={() => setBookingStep('passengers')}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setBookingStep('none');
            setActiveBusForBooking(null);
          }}
        />
      )}

      {/* Digital e-Ticket Modal with QR Code */}
      {activeTicket && (
        <DigitalTicketModal
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
          onTrackBus={handleTrackBus}
        />
      )}

      {/* Auth Modal (Sign In / Register / Quick Demo Accounts) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Gemini AI Assistant Modal */}
      {isAssistantOpen && (
        <AIAssistantModal
          onClose={() => setIsAssistantOpen(false)}
          onApplyRoute={handleApplyRoute}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

