import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Compass } from 'lucide-react';
import { PROMO_OFFERS } from '../data/demoData';

export const OffersSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const destinations = [
    { name: 'Chennai', tag: 'Cultural Capital & Beaches', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80', buses: '140+ Daily' },
    { name: 'Coimbatore', tag: 'Textile Hub & Western Ghats Gateway', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&auto=format&fit=crop&q=80', buses: '95+ Daily' },
    { name: 'Bengaluru', tag: 'Silicon Valley & Garden City', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&auto=format&fit=crop&q=80', buses: '180+ Daily' },
    { name: 'Madurai', tag: 'City of Temples & Heritage', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=500&auto=format&fit=crop&q=80', buses: '80+ Daily' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Promo Offers */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> BusGo Rewards & Promos
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Exclusive Travel Offers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMO_OFFERS.map((offer, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
                  {offer.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-dashed border-emerald-500 font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                  <Tag className="w-3.5 h-3.5" />
                  {offer.code}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Top Transit Cities
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Explore Popular Destinations
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  {dest.buses}
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">{dest.name}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{dest.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
