import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Cloud, 
  WifiOff, 
  Heart, 
  Droplets, 
  BellRing,
  ShieldAlert
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { id, type = 'info', title, message, duration = 3800 } = toast;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    triggerHaptic([12]);
  }, [id]);

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose(id);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  const getStyleAndIcon = () => {
    switch (type) {
      case 'heart':
      case 'love':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-rosePastel-300 dark:border-rosePastel-900/80 shadow-rosePastel-500/20 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-gradient-to-r from-rosePastel-400 to-blush-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-rosePastel-100 dark:bg-rosePastel-950/70 text-rosePastel-600 dark:text-rosePastel-400 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-rosePastel-500 text-rosePastel-500 animate-pulse" />
            </div>
          )
        };
      case 'water':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-sky-300 dark:border-sky-900/80 shadow-sky-500/20 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-gradient-to-r from-sky-400 to-cyan-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4 fill-sky-500 text-sky-500" />
            </div>
          )
        };
      case 'urgent':
      case 'duolingo':
        return {
          container: 'bg-rose-50/95 dark:bg-rose-950/95 border-rose-400 dark:border-rose-700 shadow-rose-500/30 text-rose-950 dark:text-rose-100 ring-2 ring-rose-400/50 animate-pulse',
          progressBg: 'bg-gradient-to-r from-rose-500 to-red-600',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <BellRing className="w-4 h-4 stroke-[2.5]" />
            </div>
          )
        };
      case 'success':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-emerald-300 dark:border-emerald-900/80 shadow-emerald-500/15 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-emerald-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          )
        };
      case 'warning':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-amber-300 dark:border-amber-900/80 shadow-amber-500/15 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-amber-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
          )
        };
      case 'cloud':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-sky-200 dark:border-slate-800 shadow-sky-500/10 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-sky-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
          )
        };
      case 'offline':
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-800 shadow-slate-900/20 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-slate-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
          )
        };
      default:
        return {
          container: 'bg-white/95 dark:bg-slate-900/95 border-rosePastel-200 dark:border-slate-800 shadow-rosePastel-500/10 text-slate-800 dark:text-slate-100',
          progressBg: 'bg-rosePastel-500',
          icon: (
            <div className="w-8 h-8 rounded-xl bg-rosePastel-100 dark:bg-slate-800 text-rosePastel-600 dark:text-rosePastel-400 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 stroke-[2.2]" />
            </div>
          )
        };
    }
  };

  const style = getStyleAndIcon();

  return (
    <div 
      className="fixed top-5 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-[92vw] sm:max-w-md animate-fade-in-up transition-all pointer-events-auto"
      role="status"
      aria-live="polite"
    >
      <div 
        className={`relative overflow-hidden flex items-start space-x-3 p-3.5 sm:p-4 rounded-2xl shadow-xl backdrop-blur-xl border ${style.container}`}
      >
        {style.icon}
        <div className="flex-1 min-w-0 text-left pt-0.5">
          {title && (
            <p className="text-xs font-extrabold tracking-tight leading-snug">
              {title}
            </p>
          )}
          <p className="text-xs font-medium opacity-90 leading-relaxed mt-0.5 break-words">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            onClose(id);
          }}
          className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Remaining Time Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-75 ${style.progressBg}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
