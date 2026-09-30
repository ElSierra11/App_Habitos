import React from 'react';
import { 
  Droplets, 
  Activity, 
  Eye, 
  Apple, 
  BarChart3, 
  Plus, 
  SlidersHorizontal 
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const MobileBottomNav = ({ 
  activeTab, 
  setActiveTab, 
  onQuickAddWater, 
  isAdmin 
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: Droplets },
    { id: 'symptoms', label: 'Síntomas', icon: Activity },
    { id: 'quick_water', label: '+250ml', isFab: true },
    { id: 'urine', label: 'Orina', icon: Eye },
    { id: 'stats', label: 'Evolución', icon: BarChart3 },
  ];

  return (
    <nav 
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-bottom-bar pb-safe"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1 relative">
        {tabs.map((tab) => {
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
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/40 flex items-center justify-center border-4 border-white dark:border-slate-900 active:scale-90 transition-transform cursor-pointer"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
                <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400 mt-0.5 tracking-tight">
                  +250 ml
                </span>
              </div>
            );
          }

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic([10]);
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 absolute -bottom-1 left-1/2 -translate-x-1/2"></span>
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
  );
};
