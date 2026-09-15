import React from 'react';
import { ShieldCheck, Sparkles, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white pt-10 pb-16 md:pt-14 md:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Gen Bus Reservation Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Travel Smarter. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Book Faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Book premium AC Sleepers, Multi-Axle Volvos & express intercity coaches across South India with live seat layouts, real-time GPS tracking & instant digital boarding passes.
          </motion.p>
        </div>

        {/* Animated Bus Travelling Across the Screen */}
        <div className="relative w-full max-w-4xl mx-auto h-24 sm:h-28 overflow-hidden rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-2xl backdrop-blur-md mb-8 flex flex-col justify-end">
          {/* Distant city silhouette & night sky */}
          <div className="absolute top-2 left-6 right-6 flex items-center justify-between text-[11px] text-emerald-400/60 font-mono tracking-wider">
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-emerald-400" /> CHENNAI CMBT</span>
            <span className="text-emerald-500/30">━━━━ LIVE INTERCITY CORRIDOR ━━━━</span>
            <span className="flex items-center gap-1.5">COIMBATORE GANDHIPURAM <MapPin className="w-3 h-3 text-emerald-400" /></span>
          </div>

          {/* Animated Bus Track */}
          <div className="relative w-full h-14 overflow-hidden">
            {/* Animated Bus Container */}
            <motion.div
              animate={{ x: ['-20%', '110%'] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute bottom-2 flex items-center gap-2 z-20"
            >
              {/* Bus SVG Graphic */}
              <div className="relative">
                {/* Modern Volvo/Bharat Benz Bus Silhouette */}
                <div className="w-24 h-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg shadow-lg relative flex items-center justify-between px-2 border-t border-emerald-300">
                  {/* Bus Windows */}
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3.5 bg-slate-900/80 rounded-sm" />
                    <div className="w-3 h-3.5 bg-slate-900/80 rounded-sm" />
                    <div className="w-3 h-3.5 bg-slate-900/80 rounded-sm" />
                    <div className="w-3.5 h-3.5 bg-slate-900/80 rounded-sm" />
                  </div>
                  {/* Front windshield */}
                  <div className="w-4 h-5 bg-sky-200/90 rounded-r-md -mr-1" />
                  {/* Bus Name Logo */}
                  <span className="absolute bottom-1 left-2 text-[8px] font-black tracking-widest text-emerald-950 uppercase">
                    BusGo
                  </span>
                  {/* Headlight beam */}
                  <div className="absolute -right-12 top-2 w-12 h-6 bg-gradient-to-r from-amber-300/40 to-transparent pointer-events-none blur-[1px]" />
                </div>
                {/* Wheels */}
                <div className="absolute -bottom-1.5 left-3 w-4 h-4 bg-slate-950 border-2 border-slate-600 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </div>
                <div className="absolute -bottom-1.5 right-4 w-4 h-4 bg-slate-950 border-2 border-slate-600 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Road Surface */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-950 border-t border-slate-700">
              {/* Moving road dashed lines */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200%] h-0.5 border-b-2 border-dashed border-amber-400/60 animate-road" />
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-0.5">
              <Zap className="w-4 h-4" /> 0% Booking Fee
            </div>
            <p className="text-[11px] text-slate-400">Zero hidden convenience charges</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-0.5">
              <MapPin className="w-4 h-4" /> Live Bus Tracking
            </div>
            <p className="text-[11px] text-slate-400">Real-time GPS on all coaches</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-0.5">
              <ShieldCheck className="w-4 h-4" /> Verified Operators
            </div>
            <p className="text-[11px] text-slate-400">Top-rated AC Sleepers & Volvos</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm mb-0.5">
              <Sparkles className="w-4 h-4" /> Instant Refund
            </div>
            <p className="text-[11px] text-slate-400">Seamless automated cancellation</p>
          </div>
        </div>
      </div>
    </div>
  );
};
