import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Sun, 
  Coffee, 
  Moon, 
  Info,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAlertSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export const MealSchedule = ({ 
  schedule = [], 
  mealLogs = [], 
  onToggleMeal,
  soundEnabled = true 
}) => {
  const [animatingMealId, setAnimatingMealId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentHours = now.getHours();
  const currentMins = now.getMinutes();
  const currentTotalMins = currentHours * 60 + currentMins;

  // Icon mapping helper
  const getMealIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-emerald-600" />;
      case 'Moon': return <Moon className="w-4 h-4 text-sky-600" />;
      case 'Clock': return <Clock className="w-4 h-4 text-sky-500" />;
      default: return <Utensils className="w-4 h-4 text-sky-600" />;
    }
  };

  const handleToggle = (meal) => {
    const isAlreadyCompleted = mealLogs.some(
      l => l.date === today && l.mealId === meal.id && l.completed
    );

    if (!isAlreadyCompleted) {
      triggerHaptic([20, 30, 20]);
      if (soundEnabled) playAlertSound('meal');

      // Trigger celebratory micro-confetti
      confetti({
        particleCount: 35,
        spread: 55,
        colors: ['#0284C7', '#10B981', '#38BDF8'],
        origin: { y: 0.7 }
      });

      // Animate card transformation
      setAnimatingMealId(meal.id);
      setTimeout(() => setAnimatingMealId(null), 600);
    } else {
      triggerHaptic([12]);
    }

    onToggleMeal(meal.id, '');
  };

  const completedCount = schedule.filter(meal => 
    mealLogs.some(log => log.date === today && log.mealId === meal.id && log.completed)
  ).length;

  return (
    <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-sky-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-sky-500/5 relative overflow-hidden transition-all">
      
      {/* Decorative ambient water glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-sky-200/25 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 ring-4 ring-sky-100/80 dark:ring-sky-900/40">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Horarios de Comida y Alarmas
            </h2>
            <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">Regularidad digestiva para no sobrecargar el metabolismo</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-extrabold text-sky-700 dark:text-sky-400 font-mono">
            {completedCount} / {schedule.length}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Completadas hoy</span>
        </div>
      </div>

      {/* Nephrology advice banner */}
      <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-900/50 mb-5 text-xs text-slate-700 dark:text-slate-300 relative z-10">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-sky-900 dark:text-sky-300 font-bold">Importante:</strong> Evita ayunos prolongados. Comer a tus horas exactas estabiliza el pH urinario y evita picos de concentración de ácido úrico y sales en los riñones.
        </span>
      </div>

      {/* Meal Items List */}
      <div className="space-y-3 relative z-10">
        {schedule.map((meal) => {
          const log = mealLogs.find(l => l.date === today && l.mealId === meal.id && l.completed);
          const isCompleted = !!log;
          const isAnimating = animatingMealId === meal.id;

          // Compute if overdue
          const [mealH, mealM] = meal.time.split(':').map(Number);
          const mealTotalMins = mealH * 60 + mealM;
          const isOverdue = !isCompleted && (currentTotalMins > mealTotalMins + 30);
          const isNow = !isCompleted && Math.abs(currentTotalMins - mealTotalMins) <= 30;

          return (
            <div 
              key={meal.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isAnimating ? 'scale-[1.02] shadow-lg ring-2 ring-emerald-400' : ''
              } ${
                isCompleted
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm'
                  : isOverdue
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/60'
                  : isNow
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 shadow-md shadow-sky-500/10'
                  : 'bg-white dark:bg-slate-800/60 border-sky-100 dark:border-slate-700/80 hover:border-sky-200 dark:hover:border-slate-600 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                
                {/* Left info */}
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isCompleted 
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-sky-50 dark:bg-slate-700/80 border-sky-100 dark:border-slate-700'
                  }`}>
                    {getMealIcon(meal.icon)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${
                        isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                      }`}>
                        {meal.name}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Realizado ({log.timeRecorded})
                        </span>
                      )}
                      {isNow && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 animate-pulse">
                          Hora de comer
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{meal.time}</span>
                      </span>
                      <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{meal.description}</span>
                    </div>
                  </div>
                </div>

                {/* Right button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggle(meal)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isCompleted
                        ? 'bg-white dark:bg-emerald-950/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md shadow-sky-500/20'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">Completada</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Marcar ingerida</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
