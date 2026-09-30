import React from 'react';
import { Bell, Droplets, Utensils, Moon, X, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const ReminderAlertModal = ({ alert, onClose, onAcknowledge }) => {
  if (!alert) return null;

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'water':
        return <Droplets className="w-8 h-8 text-sky-600 fill-sky-500/20" />;
      case 'meal':
        return <Utensils className="w-8 h-8 text-amber-600" />;
      case 'sleep':
        return <Moon className="w-8 h-8 text-indigo-600" />;
      default:
        return <Bell className="w-8 h-8 text-sky-600" />;
    }
  };

  const handleAcknowledgeWater = () => {
    triggerHaptic([20, 30]);
    onAcknowledge(250);
  };

  const handleClose = () => {
    triggerHaptic([10]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-sm bg-white/95 dark:bg-slate-900 backdrop-blur-xl border border-sky-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big icon with pulse */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-100/80 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 flex items-center justify-center mb-4 ring-4 ring-sky-50 dark:ring-slate-850 shadow-inner">
          {getAlertIcon()}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5">
          {alert.title || 'Recordatorio de Salud'}
        </h3>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
          {alert.message}
        </p>

        {/* Actions */}
        <div className="flex space-x-2.5">
          {alert.type === 'water' && (
            <button
              type="button"
              onClick={handleAcknowledgeWater}
              className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 fill-white/20" />
              <span>Tomé un vaso (+250ml)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              alert.type === 'water'
                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md shadow-sky-500/20'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Entendido</span>
          </button>
        </div>

      </div>
    </div>
  );
};
