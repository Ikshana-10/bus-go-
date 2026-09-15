import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, switchToRole } = useApp();

  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCity, setNewPlaceCity] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [showAddPlace, setShowAddPlace] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName || !newPlaceCity) return;

    const updatedPlaces = [
      ...(currentUser.savedLocations || []),
      {
        name: newPlaceName,
        city: newPlaceCity,
        address: newPlaceAddress || `${newPlaceName}, ${newPlaceCity}`
      }
    ];

    updateProfile({ savedLocations: updatedPlaces });
    setNewPlaceName('');
    setNewPlaceCity('');
    setNewPlaceAddress('');
    setShowAddPlace(false);
  };

  const handleRemovePlace = (idx: number) => {
    const updatedPlaces = (currentUser.savedLocations || []).filter((_, i) => i !== idx);
    updateProfile({ savedLocations: updatedPlaces });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/20">
            {currentUser.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.displayName}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {currentUser.email}
            </p>
            {currentUser.phoneNumber && (
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {currentUser.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Saved Locations */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Frequent Places
            </span>
            <button
              onClick={() => setShowAddPlace(true)}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Place
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(!currentUser.savedLocations || currentUser.savedLocations.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-2">
                No saved places yet. Add your Home, Work, or College location for faster searches.
              </p>
            ) : (
              currentUser.savedLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{loc.name}</span>
                      <p className="text-[11px] text-slate-400">{loc.address} ({loc.city})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlace(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Place Drawer */}
          {showAddPlace && (
            <form onSubmit={handleAddPlace} className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <input
                type="text"
                value={newPlaceName}
                onChange={(e) => setNewPlaceName(e.target.value)}
                placeholder="Place Label (e.g. Office, Campus)"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                required
              />
              <input
                type="text"
                value={newPlaceCity}
                onChange={(e) => setNewPlaceCity(e.target.value)}
                placeholder="City (e.g. Chennai)"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                required
              />
              <input
                type="text"
                value={newPlaceAddress}
                onChange={(e) => setNewPlaceAddress(e.target.value)}
                placeholder="Address / Landmark"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddPlace(false)}
                  className="px-3 py-1 text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                >
                  Save Location
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
