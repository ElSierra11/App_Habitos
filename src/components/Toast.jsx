import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Cloud, WifiOff } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { id, type = 'info', title, message, duration = 3500 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getStyleAndIcon = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/95 text-white shadow-emerald-500/25',
          border: 'border-emerald-400/40',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/95 text-white shadow-amber-500/25',
          border: 'border-amber-400/40',
          icon: <AlertTriangle className="w-4 h-4 text-amber-100 shrink-0" />,
        };
      case 'offline':
        return {
          bg: 'bg-slate-800/95 text-slate-100 shadow-slate-900/30',
          border: 'border-slate-700',
          icon: <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />,
        };
      case 'cloud':
        return {
          bg: 'bg-sky-600/95 text-white shadow-sky-600/25',
          border: 'border-sky-400/40',
          icon: <Cloud className="w-4 h-4 text-sky-100 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/95 text-white shadow-slate-900/30',
          border: 'border-slate-700',
          icon: <Info className="w-4 h-4 text-sky-300 shrink-0" />,
        };
    }
  };

  const style = getStyleAndIcon();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw] sm:max-w-md animate-fade-in-up transition-all pointer-events-auto">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${style.bg} ${style.border}`}>
        {style.icon}
        <div className="flex-1 text-left">
          {title && <p className="text-xs font-bold leading-tight">{title}</p>}
          <p className="text-xs font-medium opacity-95 leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => onClose(id)}
          className="p-1 rounded-lg hover:bg-black/10 active:scale-95 text-white/80 hover:text-white transition-all cursor-pointer"
          title="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
