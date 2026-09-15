import React, { useState } from 'react';
import { 
  Bus, 
  Ticket, 
  Navigation, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Bell, 
  Bot, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Check, 
  Clock, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAI: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenAI, onOpenProfile }) => {
  const { 
    theme, 
    toggleTheme, 
    currentUser, 
    logout, 
    activeTab, 
    setActiveTab, 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    clearAllNotifications,
    switchToRole,
    bookings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const upcomingBookingsCount = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="header-logo"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 animate-bus-bounce" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
                Bus<span className="text-emerald-500">Go</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Live
                </span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Intercity Bus Booking & Tracking
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bus className="w-4 h-4" />
              Home
            </button>

            <button
              id="nav-search"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Search Buses
            </button>

            <button
              id="nav-my-tickets"
              onClick={() => setActiveTab('my-tickets')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 relative ${
                activeTab === 'my-tickets'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Tickets
              {upcomingBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  {upcomingBookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-track"
              onClick={() => setActiveTab('track')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Track Bus
            </button>

            {/* AI Assistant Button */}
            <button
              id="nav-ai-assistant"
              onClick={onOpenAI}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-all"
            >
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>BusGo AI</span>
              <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-1 rounded font-bold">
                Smart
              </span>
            </button>

            {/* Admin Dashboard */}
            <button
              id="nav-admin"
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Admin
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left ${
                            notif.read ? 'opacity-70' : 'bg-emerald-50/50 dark:bg-emerald-950/20'
                          } hover:bg-slate-50 dark:hover:bg-slate-700/50`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/50"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {currentUser.displayName.split(' ')[0]}
                    </p>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => { onOpenProfile(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Saved Places
                      </button>

                      <button
                        onClick={() => { setActiveTab('my-tickets'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2"
                      >
                        <Ticket className="w-3.5 h-3.5 text-slate-400" />
                        My Bookings ({bookings.length})
                      </button>

                      {/* Quick demo role switchers */}
                      <div className="my-1 border-t border-slate-100 dark:border-slate-700 pt-1">
                        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Demo Role Quick-Switch
                        </span>
                        <button
                          onClick={() => { switchToRole('user'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                        >
                          <span>Passenger (Rahul)</span>
                          {currentUser.role === 'user' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                        <button
                          onClick={() => { switchToRole('admin'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                        >
                          <span>Fleet Admin</span>
                          {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-signup-btn"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Login / Signup
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Bus className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'search' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              Search Buses
            </button>
            <button
              onClick={() => { setActiveTab('my-tickets'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                activeTab === 'my-tickets' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2"><Ticket className="w-4 h-4" /> My Tickets</span>
              {upcomingBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  {upcomingBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('track'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'track' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Navigation className="w-4 h-4" /> Track Bus (Live)
            </button>
            <button
              onClick={() => { onOpenAI(); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-600" /> BusGo Assistant (Gemini AI)
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'admin' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
