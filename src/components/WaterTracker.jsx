import React, { useState } from 'react';
import { 
  Droplets, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Clock,
  Waves,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAlertSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const WaterTracker = ({ 
  targetWaterMl = 3000, 
  waterLogs = [], 
  onAddWater, 
  onDeleteWater,
  soundEnabled = true 
}) => {
  const [customMl, setCustomMl] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [lastClickedButton, setLastClickedButton] = useState(null);

  // Today's total
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = waterLogs.filter(log => log.date === today);
  const totalMl = todayLogs.reduce((sum, item) => sum + (Number(item.amountMl) || 0), 0);
  const percentage = Math.min(100, Math.round((totalMl / targetWaterMl) * 100));
  const remainingMl = Math.max(0, targetWaterMl - totalMl);

  const handleQuickAdd = (amount, buttonKey) => {
    triggerHaptic([18]);
    if (soundEnabled) playAlertSound('water');

    // Visual ripple effect trigger
    setLastClickedButton(buttonKey);
    setTimeout(() => setLastClickedButton(null), 500);

    const { updated } = onAddWater(amount);
    
    // Check if goal reached
    const newTotal = totalMl + amount;
    if (newTotal >= targetWaterMl && totalMl < targetWaterMl) {
      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#0284C7', '#38BDF8', '#10B981', '#BAE6FD'],
        origin: { y: 0.6 }
      });
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (val && val > 0 && val <= 2000) {
      handleQuickAdd(val, 'custom');
      setCustomMl('');
      setShowCustomModal(false);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl border border-sky-100/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient water glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80">
            <Droplets className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Hidratación Renal Continua</span>
            </h2>
            <p className="text-xs text-sky-700 font-medium">Meta clínica para evitar saturación de sales</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 font-mono tracking-tight">
            {totalMl.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-semibold block">
            / {targetWaterMl.toLocaleString()} ml
          </span>
        </div>
      </div>

      {/* Fluid Liquid Hydration Tank / Wave Visualizer */}
      <div className="relative mb-6 rounded-2xl p-4 bg-gradient-to-b from-sky-50/70 to-sky-100/50 dark:from-slate-800/80 dark:to-slate-850 dark:bg-slate-800/70 border border-sky-200/80 dark:border-slate-700/80 overflow-hidden">
        <div className="flex justify-between items-center text-xs mb-2 relative z-10">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-200">
            <Waves className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Nivel de Agua</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-sky-700 dark:text-sky-400 font-mono text-sm">{percentage}%</span>
            {percentage >= 100 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ¡Meta lograda!
              </span>
            )}
          </div>
        </div>

        {/* Liquid Progress Bar with Wave Effect */}
        <div className="h-6 w-full bg-white/80 dark:bg-slate-950 rounded-full overflow-hidden p-1 border border-sky-200/80 dark:border-slate-700 shadow-inner relative">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-400 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${Math.max(6, percentage)}%` }}
          >
            {/* Subtle animated water ripple reflection inside the bar */}
            <div className="absolute inset-0 bg-white/20 animate-wave-flow opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 20px)' }} />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-2 relative z-10">
          <span>{totalMl} ml ingeridos</span>
          <span className="text-sky-800 dark:text-sky-300 font-semibold">
            {remainingMl > 0 ? `Faltan ${remainingMl.toLocaleString()} ml para el objetivo` : 'Excelente dilución renal hoy'}
          </span>
        </div>
      </div>

      {/* Interactive Quick Add Water Buttons with Ripple / Bounce Feedback */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6 relative z-10">
        
        {/* +250 ml */}
        <button
          type="button"
          onClick={() => handleQuickAdd(250, '250')}
          className="relative overflow-hidden flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-sky-50/80 dark:hover:bg-slate-700/90 active:scale-95 border border-sky-200/80 dark:border-slate-700 hover:border-sky-300 text-slate-800 dark:text-slate-100 hover:text-sky-700 dark:hover:text-sky-300 shadow-sm hover:shadow transition-all duration-150 cursor-pointer group select-none"
        >
          {lastClickedButton === '250' && (
            <span className="absolute inset-0 rounded-2xl bg-sky-400/25 animate-water-ripple pointer-events-none" />
          )}
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400 fill-sky-500/20" />
          </div>
          <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">+250 ml</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Vaso regular</span>
        </button>

        {/* +350 ml */}
        <button
          type="button"
          onClick={() => handleQuickAdd(350, '350')}
          className="relative overflow-hidden flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-sky-50/80 dark:hover:bg-slate-700/90 active:scale-95 border border-sky-200/80 dark:border-slate-700 hover:border-sky-300 text-slate-800 dark:text-slate-100 hover:text-sky-700 dark:hover:text-sky-300 shadow-sm hover:shadow transition-all duration-150 cursor-pointer group select-none"
        >
          {lastClickedButton === '350' && (
            <span className="absolute inset-0 rounded-2xl bg-sky-400/25 animate-water-ripple pointer-events-none" />
          )}
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400 fill-sky-500/20" />
          </div>
          <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">+350 ml</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Vaso grande</span>
        </button>

        {/* +500 ml */}
        <button
          type="button"
          onClick={() => handleQuickAdd(500, '500')}
          className="relative overflow-hidden flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-sky-50/80 dark:hover:bg-slate-700/90 active:scale-95 border border-sky-200/80 dark:border-slate-700 hover:border-sky-300 text-slate-800 dark:text-slate-100 hover:text-sky-700 dark:hover:text-sky-300 shadow-sm hover:shadow transition-all duration-150 cursor-pointer group select-none"
        >
          {lastClickedButton === '500' && (
            <span className="absolute inset-0 rounded-2xl bg-sky-400/25 animate-water-ripple pointer-events-none" />
          )}
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400 fill-sky-500/20" />
          </div>
          <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">+500 ml</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Botella</span>
        </button>

        {/* +200 ml Nocturno */}
        <button
          type="button"
          onClick={() => handleQuickAdd(200, '200')}
          className="relative overflow-hidden flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:scale-95 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 shadow-sm hover:shadow transition-all duration-150 cursor-pointer group select-none"
        >
          {lastClickedButton === '200' && (
            <span className="absolute inset-0 rounded-2xl bg-indigo-400/25 animate-water-ripple pointer-events-none" />
          )}
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-xs font-extrabold font-mono text-indigo-950 dark:text-indigo-200">+200 ml</span>
          <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">Nocturno</span>
        </button>

        {/* Custom ml */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic([10]);
            setShowCustomModal(true);
          }}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 hover:bg-sky-100/70 dark:hover:bg-slate-700/60 active:scale-95 border border-dashed border-sky-300 dark:border-slate-700 text-sky-700 dark:text-sky-300 shadow-sm hover:shadow transition-all duration-150 cursor-pointer group select-none col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 rounded-full bg-sky-100/80 dark:bg-slate-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Otra dosis</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ingresar ml</span>
        </button>

      </div>

      {/* Clinical Nephrology Guideline */}
      <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-900/50 mb-6 relative z-10">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <span className="font-bold text-sky-900 dark:text-sky-300">Recomendación Médica Renal:</span> Ingerir de 2.5 a 3 litros al día permite una orina clara y poco concentrada, impidiendo que el calcio y el oxalato cristalicen en los riñones.
        </div>
      </div>

      {/* Today's Intake History */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Tomas registradas hoy ({todayLogs.length})
          </span>
          {todayLogs.length > 0 && (
            <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono font-medium">
              Última toma: {todayLogs[0]?.time}
            </span>
          )}
        </div>

        {todayLogs.length === 0 ? (
          <div className="py-7 text-center border border-dashed border-sky-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs bg-sky-50/30 dark:bg-slate-850/40">
            No has registrado tomas hoy. Pulsa cualquiera de los botones de arriba para sumar tu primer vaso.
          </div>
        ) : (
          <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
            {todayLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 text-xs hover:border-sky-300 dark:hover:border-slate-600 shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span className="font-mono text-slate-500 dark:text-slate-400">{log.time}</span>
                  <span className="font-mono font-extrabold text-sky-700 dark:text-sky-300">+{log.amountMl} ml</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic([12]);
                    onDeleteWater(log.id);
                  }}
                  title="Eliminar registro"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">Ingresar cantidad de agua</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Indica los mililitros consumidos (ej. 450)</p>
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                autoFocus
                required
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                placeholder="Ej. 400"
                className="w-full px-4 py-2.5 bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 focus:border-sky-500 dark:focus:border-sky-400 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
