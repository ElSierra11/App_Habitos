import React, { useState } from 'react';
import { 
  Eye, 
  Droplets, 
  CheckCircle2, 
  Trash2, 
  Info
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { URINE_LEVELS } from '../utils/urineConstants';


export const UrineColorChecker = ({ 
  urineLogs = [], 
  onAddUrineLog, 
  onDeleteUrineLog, 
  onQuickAddWater 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = urineLogs.filter(l => l.date === today);

  const handleSelectLevel = (item) => {
    triggerHaptic([15, 25]);
    setSelectedLevel(item);
  };

  const handleConfirmLog = () => {
    if (!selectedLevel) return;
    triggerHaptic([20, 40]);
    onAddUrineLog({
      level: selectedLevel.level,
      colorHex: selectedLevel.colorHex,
      label: selectedLevel.label,
      advice: selectedLevel.action,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSelectedLevel(null);
    }, 1500);
  };

  return (
    <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient water glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-amber-100/30 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-amber-500/25 ring-4 ring-amber-100/80 dark:ring-amber-950/60">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Semáforo de Color de Orina
            </h2>
            <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">Escala clínica de Armstrong: Indicador real de dilución renal</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Registros hoy</span>
          <span className="text-lg font-mono font-extrabold text-amber-600 dark:text-amber-400">{todayLogs.length}</span>
        </div>
      </div>

      {/* Clinical explanation */}
      <div className="p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-900/50 mb-5 text-xs text-slate-700 dark:text-slate-300 relative z-10">
        <span className="font-bold text-sky-900 dark:text-sky-300">¿Cómo funciona?</span> Compara el color de tu orina al ir al baño y toca la muestra correspondiente. El objetivo tras un cálculo es mantenerla en los <span className="font-bold text-emerald-700 dark:text-emerald-400">Niveles 1 o 2</span> durante todo el día.
      </div>

      {/* Interactive Armstrong Swatches */}
      <div className="space-y-2 mb-6 relative z-10">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {URINE_LEVELS.map((item) => {
            const isSelected = selectedLevel?.level === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => handleSelectLevel(item)}
                className={`relative flex flex-col items-center p-2.5 sm:p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer active:scale-95 group ${
                  isSelected 
                    ? 'ring-4 ring-sky-400/30 scale-105 shadow-md border-sky-600 dark:border-sky-400' 
                    : 'hover:border-slate-300 dark:hover:border-slate-600 hover:scale-102 border-slate-200 dark:border-slate-700'
                }`}
                style={{ backgroundColor: item.colorHex }}
              >
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono mb-1">
                  #{item.level}
                </span>
                <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-1">
                  {item.label.split(' ')[0]}
                </span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Diagnosis & Action Callout */}
      {selectedLevel && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-sky-200 dark:border-slate-700 shadow-md mb-6 relative z-10 animate-fade-in-up">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Nivel Seleccionado: #{selectedLevel.level}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedLevel.status === 'safe'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : selectedLevel.status === 'moderate'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {selectedLevel.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                {selectedLevel.diagnosis}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>{selectedLevel.action}</span>
            </span>

            <div className="flex items-center space-x-2">
              {selectedLevel.level >= 3 && onQuickAddWater && (
                <button
                  type="button"
                  onClick={() => onQuickAddWater(250)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Tomar agua (+250ml)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirmLog}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 active:scale-95 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                {savedSuccess ? '¡Registrado!' : 'Guardar resultado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's History */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Historial de Orina Hoy ({todayLogs.length})
          </span>
          {todayLogs[0] && (
            <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono font-semibold">
              Última medición: {todayLogs[0]?.time}
            </span>
          )}
        </div>

        {todayLogs.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-sky-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs bg-sky-50/20 dark:bg-slate-850/40">
            Aún no has registrado muestras hoy. Selecciona el color de arriba para iniciar.
          </div>
        ) : (
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {todayLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 text-xs shadow-sm hover:border-sky-200 dark:hover:border-slate-600 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm shrink-0" 
                    style={{ backgroundColor: log.colorHex }}
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">Nivel {log.level} ({log.label})</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{log.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    log.level <= 2 
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : log.level === 3 
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {log.level <= 2 ? 'Diluida' : log.level === 3 ? 'Aceptable' : 'Concentrada'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic([10]);
                      onDeleteUrineLog(log.id);
                    }}
                    title="Eliminar registro"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
