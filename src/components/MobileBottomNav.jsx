import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  Eye, 
  Apple, 
  BarChart3, 
  Plus, 
  SlidersHorizontal, 
  ChefHat, 
  Moon, 
  ShieldAlert, 
  MessageSquareHeart, 
  Menu, 
  X,
  Heart,
  Flame
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const MobileBottomNav = ({ 
  activeTab, 
  setActiveTab, 
  onQuickAddWater, 
  isAdmin,
  onOpenSos,
  onOpenWhatsAppCheckIn,
  onOpenNotificationCenter
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Inicio', icon: Droplets },
    { id: 'symptoms', label: 'Síntomas', icon: Activity },
    { id: 'quick_water', label: '+250 ml', isFab: true },
    { id: 'stats', label: 'Evolución', icon: BarChart3 },
    { id: 'more', label: 'Más', icon: Menu, isMore: true },
  ];

  const moreItems = [
    { 
      id: 'evaluator', 
      label: '¿Puedo comer esto?', 
      desc: 'Evaluador de sodio, potasio y oxalato',
      icon: ChefHat, 
      color: 'text-rosePastel-500 bg-rosePastel-50 dark:bg-rosePastel-950/40' 
    },
    { 
      id: 'urine', 
      label: 'Color de Orina', 
      desc: 'Semáforo de hidratación y saturación',
      icon: Eye, 
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
    },
    { 
      id: 'food', 
      label: 'Guía de Alimentos', 
      desc: 'Semáforo nutricional para riñón',
      icon: Apple, 
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' 
    },
    { 
      id: 'sleep', 
      label: 'Descanso y Sueño', 
      desc: 'Horas de sueño y recuperación',
      icon: Moon, 
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' 
    },
    ...(isAdmin ? [{ 
      id: 'admin', 
      label: 'Panel Cuidador', 
      desc: 'Gestión clínica y notas de amor',
      icon: SlidersHorizontal, 
      color: 'text-rosePastel-600 bg-rosePastel-50 dark:bg-rosePastel-950/40' 
    }] : [])
  ];

  const handleSelectTab = (tabId) => {
    triggerHaptic([10]);
    setActiveTab(tabId);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Sheet Modal ("Más") */}
      {isMoreOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-rosePastel-200 dark:border-rosePastel-900/60 p-5 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto no-scrollbar pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle and Title */}
            <div className="flex items-center justify-between pb-4 border-b border-rosePastel-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rosePastel-100 dark:bg-rosePastel-950/60 text-rosePastel-600 dark:text-rosePastel-400 flex items-center justify-center">
                  <Heart className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Herramientas de Cuidado
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Opciones adicionales de salud renal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (SOS & WhatsApp) */}
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic([15]);
                  setIsMoreOpen(false);
                  if (onOpenWhatsAppCheckIn) onOpenWhatsAppCheckIn();
                }}
                className="flex items-center space-x-2 p-3 rounded-2xl bg-rosePastel-50 dark:bg-rosePastel-950/40 border border-rosePastel-200/80 dark:border-rosePastel-900 text-rosePastel-700 dark:text-rosePastel-300 text-left cursor-pointer active:scale-95 transition-all"
              >
                <MessageSquareHeart className="w-4 h-4 shrink-0 text-rosePastel-500" />
                <span className="text-xs font-bold leading-tight">Check-in WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic([20]);
                  setIsMoreOpen(false);
                  if (onOpenSos) onOpenSos();
                }}
                className="flex items-center space-x-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-left cursor-pointer active:scale-95 transition-all"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="text-xs font-bold leading-tight">SOS Cólico</span>
              </button>
            </div>

            {/* Notification & Duolingo Quick Entry */}
            {onOpenNotificationCenter && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic([12]);
                  setIsMoreOpen(false);
                  onOpenNotificationCenter();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-rosePastel-200 dark:border-rosePastel-900/60 bg-rosePastel-50/50 dark:bg-rosePastel-950/30 text-left cursor-pointer active:scale-95 transition-all mb-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-500 bg-rose-100/80 dark:bg-rose-950/60">
                    <Flame className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Alertas & Modo Duolingo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Historial de avisos y modo insistente
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rosePastel-600 dark:text-rosePastel-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-rosePastel-200 dark:border-slate-700 shadow-2xs">
                  Configurar
                </span>
              </button>
            )}

            {/* Menu Items List */}
            <div className="space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isItemActive
                        ? 'border-rosePastel-400 bg-rosePastel-50/80 dark:bg-rosePastel-950/50 shadow-xs'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isItemActive ? 'text-rosePastel-700 dark:text-rosePastel-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    {isItemActive && (
                      <span className="w-2 h-2 rounded-full bg-rosePastel-500 mr-2"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav 
        aria-label="Navegación móvil inferior"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-bottom-bar pb-safe"
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-1 relative">
          {mainTabs.map((tab) => {
            // Floating Action Button (+250ml)
            if (tab.isFab) {
              return (
                <div key="quick_water" className="relative -top-5 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic([20, 40]);
                      if (onQuickAddWater) onQuickAddWater(250);
                    }}
                    title="Tomar 250 ml de agua fresca"
                    className="w-13 h-13 rounded-full bg-gradient-to-tr from-rosePastel-400 via-blush-400 to-sky-400 text-white shadow-lg shadow-rosePastel-500/35 flex items-center justify-center border-4 border-white dark:border-slate-900 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Plus className="w-6 h-6 stroke-[2.8]" />
                  </button>
                  <span className="text-[10px] font-extrabold text-rosePastel-600 dark:text-rosePastel-400 mt-0.5 tracking-tight">
                    +250 ml
                  </span>
                </div>
              );
            }

            // Normal tabs or "Más" trigger
            const Icon = tab.icon;
            const isActive = tab.isMore 
              ? moreItems.some(item => item.id === activeTab) || isMoreOpen
              : activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.isMore) {
                    triggerHaptic([10]);
                    setIsMoreOpen(!isMoreOpen);
                  } else {
                    handleSelectTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-rosePastel-600 dark:text-rosePastel-400 font-bold scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rosePastel-500 absolute -bottom-1 left-1/2 -translate-x-1/2"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
