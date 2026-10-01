import React, { useState } from 'react';
import { 
  Bell, 
  Droplets, 
  Utensils, 
  Heart, 
  Flame, 
  Moon, 
  X, 
  Check, 
  Trash2, 
  ShieldAlert,
  Sliders,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const NotificationCenterModal = ({
  isOpen,
  onClose,
  notifications = [],
  onClearAll,
  settings,
  onUpdateSettings,
  onOpenIosGuide
}) => {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState('inbox'); // 'inbox' | 'settings'

  const [duolingoMode, setDuolingoMode] = useState(() => {
    return settings?.duolingoMode !== false; // Active by default
  });

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(() => {
    return settings?.quietHoursEnabled !== false;
  });

  const [quietStart, setQuietStart] = useState(() => settings?.quietStart || '23:00');
  const [quietEnd, setQuietEnd] = useState(() => settings?.quietEnd || '07:00');

  const handleSavePreferences = () => {
    triggerHaptic([15, 30]);
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        duolingoMode,
        quietHoursEnabled,
        quietStart,
        quietEnd
      });
    }
    setActiveSubTab('inbox');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'duolingo':
      case 'urgent':
        return <Flame className="w-4 h-4 text-rose-500 stroke-[2.4]" />;
      case 'love':
        return <Heart className="w-4 h-4 text-rosePastel-500 fill-rosePastel-500/20" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'water':
      default:
        return <Droplets className="w-4 h-4 text-sky-500 fill-sky-500/20" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-rosePastel-200 dark:border-rosePastel-900/60 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rosePastel-500 via-blush-500 to-rosePastel-600 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                Centro de Notificaciones & Alertas
              </h3>
              <p className="text-[11px] text-rose-100 font-medium">
                Gestión de alarmas e intensidad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch (Bandeja / Ajustes de Alarma) */}
        <div className="flex border-b border-rosePastel-100 dark:border-slate-800 bg-rosePastel-50/50 dark:bg-slate-850 px-3 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              setActiveSubTab('inbox');
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all cursor-pointer ${
              activeSubTab === 'inbox'
                ? 'border-rosePastel-500 text-rosePastel-600 dark:text-rosePastel-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Bandeja de Alertas ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              setActiveSubTab('settings');
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'border-rosePastel-500 text-rosePastel-600 dark:text-rosePastel-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Ajustes e Intensidad
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar flex-1 text-slate-800 dark:text-slate-100 space-y-4">
          
          {activeSubTab === 'inbox' && (
            <>
              {notifications.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-rosePastel-50 dark:bg-slate-800 text-rosePastel-400 mx-auto flex items-center justify-center">
                    <Bell className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bandeja al día
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                    Las alertas enviadas hoy aparecerán aquí para que no te pierdas ningún aviso de hidratación o comida.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Hoy
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic([10]);
                        if (onClearAll) onClearAll();
                      }}
                      className="text-[11px] text-rosePastel-600 dark:text-rosePastel-400 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpiar bandeja</span>
                    </button>
                  </div>

                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-3 rounded-2xl bg-rosePastel-50/40 dark:bg-slate-850 border border-rosePastel-100 dark:border-slate-800 flex items-start space-x-3 transition-all"
                    >
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSubTab === 'settings' && (
            <div className="space-y-4">
              
              {/* Duolingo Mode Switch */}
              <div className="p-4 rounded-2xl border border-rosePastel-200 dark:border-rosePastel-900/60 bg-rosePastel-50/50 dark:bg-rosePastel-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-rose-500 stroke-[2.4]" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Modo Alerta Intensa (Insistencia Progresiva)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={duolingoMode}
                    onChange={(e) => setDuolingoMode(e.target.checked)}
                    className="w-4 h-4 rounded text-rosePastel-600 focus:ring-rosePastel-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Si pasan más de 75-90 minutos sin tomar agua, la app eleva la urgencia con mensajes insistentes y vibración doble hasta que confirmes la toma.
                </p>
              </div>

              {/* Quiet hours */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Horas de Silencio (No Molestar)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHoursEnabled}
                    onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-rosePastel-600 focus:ring-rosePastel-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Desactiva las alarmas periódicas diurnas durante tus horas de sueño profundo:
                </p>

                {quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        Desde (Noche):
                      </label>
                      <input
                        type="time"
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        Hasta (Mañana):
                      </label>
                      <input
                        type="time"
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {onOpenIosGuide && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic([10]);
                    onOpenIosGuide();
                  }}
                  className="w-full p-3 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-between hover:bg-sky-100/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    <span className="text-left">Configurar alertas para iPhone / iPad</span>
                  </div>
                  <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 shadow-2xs">
                    Ver guía
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rosePastel-500 to-blush-500 hover:from-rosePastel-600 hover:to-blush-600 text-white text-xs font-bold shadow-md shadow-rosePastel-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Guardar Preferencias de Alarma
              </button>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic([10]);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
