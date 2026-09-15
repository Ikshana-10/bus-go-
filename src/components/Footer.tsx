import React from 'react';
import { Bus, ShieldCheck, Heart, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSearchParams } = useApp();

  const handleRouteClick = (from: string, to: string) => {
    setSearchParams(prev => ({ ...prev, from, to }));
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Bus className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Bus<span className="text-emerald-500">Go</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              India's premier intercity online bus reservation and live GPS tracking platform. Connecting travelers to over 500+ premium coaches across Chennai, Coimbatore, Bengaluru, Madurai, Salem, and Hyderabad.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Secure Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-500" /> Best Travel App 2026
              </span>
            </div>
          </div>

          {/* Quick Route Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Bus Routes
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleRouteClick('Chennai', 'Coimbatore')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Chennai to Coimbatore Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Bengaluru', 'Chennai')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Bengaluru to Chennai Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Hyderabad', 'Bengaluru')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Hyderabad to Bengaluru Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Chennai', 'Madurai')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Chennai to Madurai Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Coimbatore', 'Bengaluru')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Coimbatore to Bengaluru Bus
                </button>
              </li>
            </ul>
          </div>

          {/* Bus Operators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Bus Partners
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-emerald-400 cursor-pointer">SRM Transports</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">ABC Travels Luxury</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">IntrCity SmartBus</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">KPN Speed Travels</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Zingbus Electric</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Greenline Express</span></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              24x7 Help & Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1800-425-9000 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@busgo.travel</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Live Passenger Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BusGo Technologies Pvt Ltd. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Simulated Secure Payment: UPI • RuPay • Visa • MasterCard • NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
